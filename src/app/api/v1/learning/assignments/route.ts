export const runtime = "nodejs"
export const maxDuration = 120

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { evaluateAssignment } from "@/lib/ai/agents/assignment-evaluator"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"

const bodySchema = z.object({
  assignmentId: z.string().min(1),
  content: z.string().min(50, "Please provide a more detailed submission (at least 50 characters)"),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }
    const { assignmentId, content } = parsed.data

    // Verify assignment exists
    const assignment = await prisma.learningGateAssignment.findUnique({
      where: { id: assignmentId },
      include: { stage: true },
    })
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Count previous attempts
    const previousAttempts = await prisma.assignmentSubmission.count({
      where: { userId, assignmentId },
    })

    // Evaluate with AI
    const rubric = assignment.rubric as { criterion: string; points: number; description: string }[]
    const evaluation = await evaluateAssignment({
      assignmentTitle: assignment.title,
      assignmentPrompt: assignment.prompt,
      rubric,
      submission: content,
      maxScore: assignment.maxScore,
    })

    // Store submission
    const submission = await prisma.assignmentSubmission.create({
      data: {
        userId,
        assignmentId,
        content,
        aiScore: evaluation.totalScore,
        aiFeedback: {
          breakdown: evaluation.breakdown,
          overallFeedback: evaluation.overallFeedback,
          strengthAreas: evaluation.strengthAreas,
          improvementAreas: evaluation.improvementAreas,
        },
        passed: evaluation.passed,
        attempt: previousAttempts + 1,
      },
    })

    // If passed, mark stage as completed, update skill scores, unlock next stage
    if (evaluation.passed) {
      const stageId = assignment.stageId
      await prisma.userLearningProgress.upsert({
        where: { userId_stageId: { userId, stageId } },
        create: { userId, stageId, status: "completed", completedAt: new Date(), startedAt: new Date() },
        update: { status: "completed", completedAt: new Date() },
      })

      // Boost learningScore for skills in this stage's categories
      const stageCategorySlugs = assignment.stage.skillCategories
      if (stageCategorySlugs.length > 0) {
        const categories = await prisma.skillCategory.findMany({
          where: { slug: { in: stageCategorySlugs } },
          select: { id: true },
        })
        const categoryIds = categories.map((c) => c.id)

        const skills = await prisma.skill.findMany({
          where: { categoryId: { in: categoryIds } },
          select: { id: true },
        })

        // Boost: assignment score adds to learningScore, recalculate totalScore
        const scoreBoost = Math.round((evaluation.totalScore / assignment.maxScore) * 100)
        for (const skill of skills) {
          const existing = await prisma.userSkillScore.findUnique({
            where: { userId_skillId: { userId, skillId: skill.id } },
          })
          const newLearning = Math.min(100, (existing?.learningScore ?? 0) + scoreBoost * 0.3)
          const newAssignment = Math.max(existing?.assignmentScore ?? 0, scoreBoost)
          const evidence = existing?.evidenceScore ?? 0
          const newTotal = 0.5 * evidence + 0.3 * newAssignment + 0.2 * newLearning

          await prisma.userSkillScore.upsert({
            where: { userId_skillId: { userId, skillId: skill.id } },
            create: { userId, skillId: skill.id, evidenceScore: 0, assignmentScore: newAssignment, learningScore: newLearning, totalScore: newTotal },
            update: { assignmentScore: newAssignment, learningScore: newLearning, totalScore: newTotal },
          })
        }
        logger.info("Skill scores updated from assignment", { userId, stageId, categorySlugs: stageCategorySlugs, skillCount: skills.length, scoreBoost })
      }

      // Unlock next stage
      const nextStage = await prisma.learningStage.findFirst({
        where: { stageNumber: assignment.stage.stageNumber + 1 },
      })
      if (nextStage) {
        await prisma.userLearningProgress.upsert({
          where: { userId_stageId: { userId, stageId: nextStage.id } },
          create: { userId, stageId: nextStage.id, status: "not_started" },
          update: {},
        })
      }
    }

    // Log activity and update streak
    await recordActivity(userId, "assignment", assignmentId, "assignment")

    logger.info("Assignment submitted", {
      userId,
      assignmentId,
      score: evaluation.totalScore,
      passed: evaluation.passed,
      attempt: previousAttempts + 1,
    })

    return NextResponse.json({
      id: submission.id,
      score: evaluation.totalScore,
      maxScore: assignment.maxScore,
      passed: evaluation.passed,
      attempt: previousAttempts + 1,
      feedback: {
        breakdown: evaluation.breakdown,
        overallFeedback: evaluation.overallFeedback,
        strengthAreas: evaluation.strengthAreas,
        improvementAreas: evaluation.improvementAreas,
      },
    })
  } catch (error) {
    logger.error("Assignment evaluation failed", { userId, error })
    return NextResponse.json({ error: "Failed to evaluate your submission. Please try again." }, { status: 500 })
  }
}
