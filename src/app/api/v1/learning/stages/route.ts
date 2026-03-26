export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const stages = await prisma.learningStage.findMany({
      where: { isActive: true },
      orderBy: { stageNumber: "asc" },
      include: {
        subtopics: {
          where: { isActive: true },
          include: {
            resources: { where: { isActive: true }, select: { id: true } },
          },
        },
        gateAssignments: {
          where: { isActive: true },
          select: { id: true, title: true, passingScore: true, maxScore: true },
        },
        learningProgress: {
          where: { userId },
        },
      },
    })

    // Get user's skill scores for "likely covered" hint
    const userSkillScores = await prisma.userSkillScore.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } },
    })

    const categoryScoreMap = new Map<string, number>()
    for (const uss of userSkillScores) {
      const slug = uss.skill.category.slug
      const existing = categoryScoreMap.get(slug) ?? 0
      categoryScoreMap.set(slug, Math.max(existing, uss.totalScore))
    }

    // Get completed resource counts per stage
    const resourceCompletions = await prisma.stageResourceCompletion.findMany({
      where: { userId },
      select: { resourceId: true, subtopicId: true },
    })
    const completedResourceIds = new Set(resourceCompletions.map((c) => c.resourceId))

    // Get passed assignment submissions
    const passedSubmissions = await prisma.assignmentSubmission.findMany({
      where: { userId, passed: true },
      select: { assignmentId: true, aiScore: true },
    })
    const passedAssignmentMap = new Map(
      passedSubmissions.map((s) => [s.assignmentId, s.aiScore])
    )

    const result = stages.map((stage) => {
      const progress = stage.learningProgress[0]
      const subtopicCount = stage.subtopics.length
      const totalResources = stage.subtopics.reduce((sum, st) => sum + st.resources.length, 0)
      const completedResources = stage.subtopics.reduce(
        (sum, st) => sum + st.resources.filter((r) => completedResourceIds.has(r.id)).length,
        0
      )

      const assignment = stage.gateAssignments[0]
      const assignmentScore = assignment ? passedAssignmentMap.get(assignment.id) : undefined

      // Check if user likely has high skills for this stage
      const avgCategoryScore =
        stage.skillCategories.length > 0
          ? stage.skillCategories.reduce((sum, slug) => sum + (categoryScoreMap.get(slug) ?? 0), 0) /
            stage.skillCategories.length
          : 0
      const likelyCovered = avgCategoryScore >= 65

      return {
        id: stage.id,
        stageNumber: stage.stageNumber,
        title: stage.title,
        slug: stage.slug,
        description: stage.description,
        estimatedHours: stage.estimatedHours,
        skillCategories: stage.skillCategories,
        subtopicCount,
        totalResources,
        completedResources,
        status: progress?.status ?? "not_started",
        completedAt: progress?.completedAt,
        assignmentTitle: assignment?.title,
        assignmentScore,
        assignmentPassed: assignment ? passedAssignmentMap.has(assignment.id) : false,
        likelyCovered,
      }
    })

    return NextResponse.json({ stages: result })
  } catch (error) {
    logger.error("Failed to fetch learning stages", { userId, error })
    return NextResponse.json({ error: "Failed to load learning stages" }, { status: 500 })
  }
}
