import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StageCard } from "@/components/learning/stage-card"

async function getStagesWithProgress(userId: string) {
  const stages = await prisma.learningStage.findMany({
    where: { isActive: true },
    orderBy: { stageNumber: "asc" },
    include: {
      subtopics: {
        where: { isActive: true },
        include: { resources: { where: { isActive: true }, select: { id: true } } },
      },
      gateAssignments: { where: { isActive: true }, select: { id: true } },
      learningProgress: { where: { userId } },
    },
  })

  const [completions, submissions] = await Promise.all([
    prisma.stageResourceCompletion.findMany({
      where: { userId },
      select: { resourceId: true },
    }),
    prisma.assignmentSubmission.findMany({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      select: { assignmentId: true, aiScore: true, passed: true },
    }),
  ])

  const completedResIds = new Set(completions.map((c) => c.resourceId))
  const subByAssignment = new Map<string, { aiScore: number | null; passed: boolean }>()
  for (const s of submissions) {
    if (!subByAssignment.has(s.assignmentId)) subByAssignment.set(s.assignmentId, s)
  }

  return stages.map((stage, idx) => {
    const progress = stage.learningProgress[0]
    const totalRes = stage.subtopics.reduce((sum, st) => sum + st.resources.length, 0)
    const compRes = stage.subtopics.reduce(
      (sum, st) => sum + st.resources.filter((r) => completedResIds.has(r.id)).length, 0,
    )
    const assignment = stage.gateAssignments[0]
    const sub = assignment ? subByAssignment.get(assignment.id) : undefined
    const prevCompleted = idx === 0 || stages[idx - 1].learningProgress[0]?.status === "completed"

    return {
      id: stage.id,
      stageNumber: stage.stageNumber,
      title: stage.title,
      description: stage.description,
      estimatedHours: stage.estimatedHours,
      subtopicCount: stage.subtopics.length,
      totalResources: totalRes,
      completedResources: compRes,
      status: progress?.status ?? "not_started",
      isUnlocked: prevCompleted,
      assignmentScore: sub?.aiScore ?? null,
      assignmentPassed: sub?.passed ?? false,
    }
  })
}

export default async function LearningPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const stages = await getStagesWithProgress(session.user.id)
  const completedCount = stages.filter((s) => s.status === "completed").length
  const currentStage = stages.find((s) => s.status === "in_progress") ?? stages.find((s) => s.isUnlocked && s.status === "not_started")

  if (stages.length === 0) {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">Your Learning Path</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            12 stages from PM fundamentals to offer-ready.
          </p>
        </div>
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-10 text-center space-y-3">
          <p className="text-base font-medium text-[var(--color-on-surface)]">Your learning path is being prepared</p>
          <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm mx-auto">
            The 12-stage curriculum hasn&apos;t been seeded yet. Run{" "}
            <code className="text-xs bg-[var(--color-surface-container-low)] px-1.5 py-0.5 rounded font-mono">
              pnpm db:seed
            </code>{" "}
            to populate the learning stages.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">Your Learning Path</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          {completedCount === 0
            ? "Your personalized journey to becoming a Product Manager. Take it one stage at a time."
            : completedCount === stages.length
              ? "You've completed all stages. Incredible dedication."
              : `${completedCount} of ${stages.length} stages completed. ${currentStage ? `Currently on: ${currentStage.title}` : "Ready for the next step."}`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-[var(--color-surface-container-low)] rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
          style={{ width: `${Math.round((completedCount / stages.length) * 100)}%` }}
        />
      </div>

      {/* Stage list */}
      <div className="space-y-3">
        {stages.map((stage) => (
          <StageCard key={stage.id} {...stage} />
        ))}
      </div>
    </div>
  )
}
