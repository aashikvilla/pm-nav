export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id
  const { stageId } = await params

  try {
    const stage = await prisma.learningStage.findUnique({
      where: { id: stageId },
      include: {
        subtopics: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            resources: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
            quickCheckSubmissions: {
              where: { userId },
              orderBy: { submittedAt: "desc" },
              take: 3,
            },
          },
        },
        gateAssignments: {
          where: { isActive: true },
          include: {
            submissions: {
              where: { userId },
              orderBy: { submittedAt: "desc" },
            },
          },
        },
        learningProgress: {
          where: { userId },
        },
      },
    })

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 })
    }

    // Get completed resources for this user within this stage's subtopics
    const subtopicIds = stage.subtopics.map((st) => st.id)
    const completions = await prisma.stageResourceCompletion.findMany({
      where: { userId, subtopicId: { in: subtopicIds } },
      select: { resourceId: true, subtopicId: true },
    })
    const completedResourceIds = new Set(completions.map((c) => c.resourceId))

    // Check if previous stage is completed (for lock logic)
    let isUnlocked = stage.stageNumber === 1
    if (!isUnlocked) {
      const prevStage = await prisma.learningStage.findFirst({
        where: { stageNumber: stage.stageNumber - 1 },
      })
      if (prevStage) {
        const prevProgress = await prisma.userLearningProgress.findUnique({
          where: { userId_stageId: { userId, stageId: prevStage.id } },
        })
        isUnlocked = prevProgress?.status === "completed" || prevProgress?.status === "skipped"
      }
    }
    // Also unlocked if user already has progress
    const userProgress = stage.learningProgress[0]
    if (userProgress && userProgress.status !== "not_started") {
      isUnlocked = true
    }

    // Check gate readiness: at least 1 resource per subtopic completed
    const subtopicsWithCompletion = stage.subtopics.map((st) => {
      const hasCompletion = st.resources.some((r) => completedResourceIds.has(r.id))
      return hasCompletion
    })
    const gateReady = subtopicsWithCompletion.every(Boolean) && subtopicsWithCompletion.length > 0

    const result = {
      id: stage.id,
      stageNumber: stage.stageNumber,
      title: stage.title,
      slug: stage.slug,
      description: stage.description,
      estimatedHours: stage.estimatedHours,
      skillCategories: stage.skillCategories,
      isUnlocked,
      status: userProgress?.status ?? "not_started",
      gateReady,
      subtopics: stage.subtopics.map((st) => ({
        id: st.id,
        title: st.title,
        slug: st.slug,
        description: st.description,
        quickCheck: st.quickCheck,
        resources: st.resources.map((r) => ({
          id: r.id,
          title: r.title,
          url: r.url,
          type: r.type,
          estimatedMins: r.estimatedMins,
          difficulty: r.difficulty,
          completed: completedResourceIds.has(r.id),
        })),
        completedCount: st.resources.filter((r) => completedResourceIds.has(r.id)).length,
        totalCount: st.resources.length,
        quickCheckSubmissions: st.quickCheckSubmissions.map((qc) => ({
          id: qc.id,
          response: qc.response,
          feedback: qc.aiFeedback,
          passed: qc.passed,
          submittedAt: qc.submittedAt,
        })),
      })),
      gateAssignment: stage.gateAssignments[0]
        ? {
            id: stage.gateAssignments[0].id,
            title: stage.gateAssignments[0].title,
            prompt: stage.gateAssignments[0].prompt,
            rubric: stage.gateAssignments[0].rubric as { criterion: string; points: number; description: string }[],
            passingScore: stage.gateAssignments[0].passingScore,
            maxScore: stage.gateAssignments[0].maxScore,
            submissions: stage.gateAssignments[0].submissions.map((s) => ({
              id: s.id,
              content: s.content,
              score: s.aiScore,
              feedback: s.aiFeedback,
              passed: s.passed,
              attempt: s.attempt,
              submittedAt: s.submittedAt,
            })),
          }
        : null,
    }

    return NextResponse.json(result)
  } catch (error) {
    logger.error("Failed to fetch stage detail", { userId, stageId, error })
    return NextResponse.json({ error: "Failed to load stage" }, { status: 500 })
  }
}
