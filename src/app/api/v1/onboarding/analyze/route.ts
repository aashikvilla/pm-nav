export const runtime = "nodejs"
export const maxDuration = 300

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { reframeBatch } from "@/lib/ai/agents/psi-reframer"
import { analyzeGaps } from "@/lib/ai/agents/gap-analyzer"
import { calculateCategoryScores, calculateReadinessScore } from "@/lib/scores"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    // Mark analysis as processing
    await prisma.profile.update({
      where: { userId },
      data: { analysisStatus: "processing" },
    })

    // Load work experiences + profile data
    const [workExperiences, profile, pmTarget] = await Promise.all([
      prisma.workExperience.findMany({ where: { userId } }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.userPmTarget.findUnique({ where: { userId } }),
    ])

    if (!workExperiences.length) {
      await prisma.profile.update({ where: { userId }, data: { analysisStatus: "failed" } })
      return NextResponse.json({ error: "No work experience found. Please upload your resume first." }, { status: 400 })
    }

    // Collect all bullets across all experiences
    const allBullets: { company: string; title: string; bullet: string; workExperienceId: string }[] = []
    for (const exp of workExperiences) {
      for (const bullet of exp.rawBullets) {
        if (bullet.trim()) {
          allBullets.push({
            company: exp.company,
            title: exp.title,
            bullet,
            workExperienceId: exp.id,
          })
        }
      }
    }

    // Also add descriptions as bullets if no bullets but has description
    if (allBullets.length === 0) {
      for (const exp of workExperiences) {
        if (exp.description) {
          const lines = exp.description.split(/\n|\./).filter((l) => l.trim().length > 20)
          for (const line of lines.slice(0, 3)) {
            allBullets.push({
              company: exp.company,
              title: exp.title,
              bullet: line.trim(),
              workExperienceId: exp.id,
            })
          }
        }
      }
    }

    logger.info("Starting PSI reframing", { userId, bulletCount: allBullets.length })

    // Clear existing PSI entries for this user
    await prisma.psiEntry.deleteMany({ where: { userId } })

    // Reframe bullets in batches of 8 (single API call per batch — reduces token overhead)
    const BATCH_SIZE = 8
    const psiResults: Array<{
      workExperienceId: string
      problem: string
      solution: string
      impact: string
      confidenceScore: number
      skillsHinted: string[]
    }> = []

    for (let i = 0; i < allBullets.length; i += BATCH_SIZE) {
      const batch = allBullets.slice(i, i + BATCH_SIZE)
      try {
        const results = await reframeBatch(
          batch.map((b) => ({ company: b.company, title: b.title, bullet: b.bullet })),
        )
        for (let j = 0; j < results.length; j++) {
          if (results[j].confidenceScore >= 20) {
            psiResults.push({ workExperienceId: batch[j].workExperienceId, ...results[j] })
          }
        }
      } catch(error) {
        logger.warn("PSI batch failed, skipping", { batchStart: i, error })
      }
    }

    logger.info("PSI reframing complete", { userId, psiCount: psiResults.length })

    // Load skills for mapping
    const skills = await prisma.skill.findMany({
      select: { id: true, slug: true, categoryId: true },
    })
    const skillBySlug = new Map(skills.map((s) => [s.slug, s]))

    // Store PSI entries + skill mappings
    const createdPsiEntries: string[] = []
    for (const psi of psiResults) {
      const entry = await prisma.psiEntry.create({
        data: {
          userId,
          workExperienceId: psi.workExperienceId,
          problem: psi.problem,
          solution: psi.solution,
          impact: psi.impact,
          confidenceScore: psi.confidenceScore,
        },
      })
      createdPsiEntries.push(entry.id)

      // Create skill mappings for hinted skills
      const mappings = psi.skillsHinted
        .map((slug) => skillBySlug.get(slug))
        .filter(Boolean)
        .map((skill) => ({
          psiEntryId: entry.id,
          skillId: skill!.id,
          evidenceScore: psi.confidenceScore,
        }))

      if (mappings.length > 0) {
        await prisma.psiSkillMapping.createMany({
          data: mappings,
          skipDuplicates: true,
        })
      }
    }

    // Run gap analysis
    const gapInput = {
      psiEntries: psiResults.map((p) => ({
        problem: p.problem,
        solution: p.solution,
        impact: p.impact,
        skillsHinted: p.skillsHinted,
      })),
      targetRoleType: pmTarget?.targetRoleType ?? "consumer",
      yearsExperience: profile?.yearsExperience ?? 0,
      currentRole: profile?.currentJobRole ?? "Professional",
    }

    logger.info("Running gap analysis", { userId, psiCount: psiResults.length })

    // If all PSI batches failed, run gap analysis with raw experience descriptions as fallback
    const effectivePsiEntries = psiResults.length > 0
      ? gapInput.psiEntries
      : workExperiences.slice(0, 5).map((w) => ({
          problem: w.description ?? w.title,
          solution: w.title,
          impact: "",
          skillsHinted: [],
        }))

    logger.info("[Analyze] Calling gap analysis", { userId, effectivePsiCount: effectivePsiEntries.length, targetRole: gapInput.targetRoleType })
    const gapResult = await analyzeGaps({ ...gapInput, psiEntries: effectivePsiEntries })
    logger.info("[Analyze] Gap analysis returned", { userId, skillSlugs: Object.keys(gapResult.skillScores), topStrengths: gapResult.topStrengths, topGaps: gapResult.topGaps })

    // Upsert skill scores
    const matchedSlugs: string[] = []
    const unmatchedSlugs: string[] = []
    const skillScoreOps = Object.entries(gapResult.skillScores).map(([slug, score]) => {
      const skill = skillBySlug.get(slug)
      if (!skill) { unmatchedSlugs.push(slug); return null }
      matchedSlugs.push(slug)
      return prisma.userSkillScore.upsert({
        where: { userId_skillId: { userId, skillId: skill.id } },
        create: { userId, skillId: skill.id, evidenceScore: score, totalScore: score * 0.5 },
        update: { evidenceScore: score, totalScore: score * 0.5 },
      })
    })
    logger.info("[Analyze] Skill score upsert", { userId, matched: matchedSlugs, unmatched: unmatchedSlugs, opsCount: skillScoreOps.filter(Boolean).length })
    await Promise.all(skillScoreOps.filter(Boolean))
    logger.info("[Analyze] Skill scores saved", { userId })

    // Calculate and store readiness score snapshot
    const allSkillScores = await prisma.userSkillScore.findMany({
      where: { userId },
      select: { skillId: true, evidenceScore: true, assignmentScore: true, learningScore: true },
    })
    const roleType = pmTarget?.targetRoleType ?? "consumer"
    const roleWeights = await prisma.roleWeight.findMany({
      where: { roleType },
      select: { categoryId: true, weight: true },
    })
    logger.info("[Analyze] Readiness calc inputs", { userId, skillScoreCount: allSkillScores.length, roleWeightCount: roleWeights.length, roleType })

    const categoryScores = calculateCategoryScores(allSkillScores, skills)
    const overallScore = calculateReadinessScore(categoryScores, roleWeights)
    logger.info("[Analyze] Readiness calculated", { userId, categoryScores, overallScore })

    // Get category names for the snapshot
    const categories = await prisma.skillCategory.findMany({ select: { id: true, slug: true } })
    const categoryScoresBySlug: Record<string, number> = {}
    for (const cat of categories) {
      if (categoryScores[cat.id] !== undefined) {
        categoryScoresBySlug[cat.slug] = categoryScores[cat.id]
      }
    }
    logger.info("[Analyze] Creating readiness snapshot", { userId, overallScore, roleType, categoryScoresBySlug })

    await prisma.readinessScoreSnapshot.create({
      data: {
        userId,
        overallScore,
        roleType,
        categoryScores: categoryScoresBySlug,
      },
    })

    // Mark analysis complete
    await prisma.profile.update({
      where: { userId },
      data: {
        analysisStatus: "completed",
        onboardingStep: 3,
      },
    })

    await recordActivity(userId, "analysis_completed")

    logger.info("Analysis complete", { userId, overallScore, psiCount: createdPsiEntries.length })

    return NextResponse.json({
      success: true,
      psiCount: createdPsiEntries.length,
      overallScore,
      analysisComplete: true,
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    const errStack = error instanceof Error ? error.stack : undefined
    logger.error("[Analyze] FAILED", { userId, error: errMsg, stack: errStack })
    await prisma.profile
      .update({ where: { userId }, data: { analysisStatus: "failed" } })
      .catch(() => null)
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 })
  }
}
