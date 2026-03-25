export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest) {
  void req
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const [profile, pmTarget, latestSnapshot, psiCount, skillScores] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.userPmTarget.findUnique({ where: { userId } }),
      prisma.readinessScoreSnapshot.findFirst({
        where: { userId },
        orderBy: { takenAt: "desc" },
      }),
      prisma.psiEntry.count({ where: { userId, isVisible: true } }),
      prisma.userSkillScore.findMany({
        where: { userId },
        include: { skill: { include: { category: true } } },
      }),
    ])

    // Group scores by category
    const categoryMap: Record<string, { name: string; scores: number[] }> = {}
    for (const ss of skillScores) {
      const catId = ss.skill.categoryId
      if (!categoryMap[catId]) {
        categoryMap[catId] = { name: ss.skill.category.name, scores: [] }
      }
      categoryMap[catId].scores.push(ss.evidenceScore)
    }

    const categorySummaries = Object.entries(categoryMap).map(([, v]) => ({
      category: v.name,
      score: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length),
    }))

    const sorted = [...categorySummaries].sort((a, b) => b.score - a.score)
    const topStrengths = sorted.slice(0, 3)
    const topGaps = [...sorted].sort((a, b) => a.score - b.score).slice(0, 3)

    const overallScore = latestSnapshot?.overallScore ?? 0

    // Mark onboarding complete
    if (profile && !profile.onboardingCompleted) {
      await prisma.profile.update({
        where: { userId },
        data: { onboardingCompleted: true, onboardingStep: 5 },
      })
    }

    return NextResponse.json({
      overallScore: Math.round(overallScore),
      targetRole: pmTarget?.targetRoleType ?? "consumer",
      topStrengths,
      topGaps,
      psiCount,
      readyToApply: overallScore >= 70,
    })
  } catch (error) {
    logger.error("Failed to load summary", { userId, error })
    return NextResponse.json({ error: "Failed to load summary" }, { status: 500 })
  }
}
