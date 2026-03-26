import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ResourceItem } from "@/components/learning/resource-item"
import { QuickCheckForm } from "@/components/learning/quick-check-form"
import { AssignmentForm } from "@/components/learning/assignment-form"

async function getStageDetail(userId: string, stageId: string) {
  const stage = await prisma.learningStage.findUnique({
    where: { id: stageId },
    include: {
      subtopics: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          resources: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
          quickCheckSubmissions: { where: { userId }, orderBy: { submittedAt: "desc" }, take: 1 },
        },
      },
      gateAssignments: {
        where: { isActive: true },
        include: { submissions: { where: { userId }, orderBy: { submittedAt: "desc" } } },
      },
      learningProgress: { where: { userId } },
    },
  })

  if (!stage) return null

  const subtopicIds = stage.subtopics.map((st) => st.id)
  const completions = await prisma.stageResourceCompletion.findMany({
    where: { userId, subtopicId: { in: subtopicIds } },
    select: { resourceId: true },
  })
  const completedIds = new Set(completions.map((c) => c.resourceId))

  const totalRes = stage.subtopics.reduce((sum, st) => sum + st.resources.length, 0)
  const completedRes = stage.subtopics.reduce(
    (sum, st) => sum + st.resources.filter((r) => completedIds.has(r.id)).length, 0,
  )

  // Gate unlock: need at least 1 resource per subtopic completed
  const gateReady = stage.subtopics.length > 0 &&
    stage.subtopics.every((st) => st.resources.some((r) => completedIds.has(r.id)))

  const assignment = stage.gateAssignments[0]

  return {
    ...stage,
    completedIds,
    totalRes,
    completedRes,
    gateReady,
    assignment: assignment ?? null,
  }
}

export default async function StageDetailPage({
  params,
}: {
  params: Promise<{ stageId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { stageId } = await params
  const stage = await getStageDetail(session.user.id, stageId)
  if (!stage) notFound()

  const progress = Math.round((stage.completedRes / Math.max(stage.totalRes, 1)) * 100)

  return (
    <div className="max-w-3xl space-y-8">
      {/* Back nav */}
      <Link
        href="/dashboard/learning"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
      >
        &larr; Back to Learning Path
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold">
            {stage.stageNumber}
          </span>
          <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">
            {stage.title}
          </h1>
        </div>
        {stage.description && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">{stage.description}</p>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[var(--color-on-surface-variant)]">
          <span>{stage.completedRes} of {stage.totalRes} resources completed</span>
          <span>{progress}%</span>
        </div>
        <div className="bg-[var(--color-surface-container-low)] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Subtopics */}
      <div className="space-y-8">
        {stage.subtopics.map((subtopic, idx) => {
          const lastSubmission = subtopic.quickCheckSubmissions[0]
          return (
            <section key={subtopic.id} className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-[var(--color-on-surface)]">
                  {idx + 1}. {subtopic.title}
                </h2>
                {subtopic.description && (
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                    {subtopic.description}
                  </p>
                )}
              </div>

              {/* Resources */}
              {subtopic.resources.length > 0 && (
                <div className="space-y-1">
                  {subtopic.resources.map((resource) => (
                    <ResourceItem
                      key={resource.id}
                      id={resource.id}
                      title={resource.title}
                      type={resource.type}
                      url={resource.url}
                      estimatedMinutes={resource.estimatedMins}
                      isCompleted={stage.completedIds.has(resource.id)}
                      subtopicId={subtopic.id}
                    />
                  ))}
                </div>
              )}

              {/* Quick Check */}
              {subtopic.quickCheck && (
                <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">
                    Quick Check
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    {subtopic.quickCheck}
                  </p>
                  <QuickCheckForm
                    subtopicId={subtopic.id}
                    subtopicTitle={subtopic.title}
                    existingSubmission={
                      lastSubmission
                        ? {
                            response: lastSubmission.response,
                            aiFeedback: lastSubmission.aiFeedback,
                            score: lastSubmission.aiScore,
                            passed: lastSubmission.passed,
                          }
                        : null
                    }
                  />
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Gate Assignment */}
      {stage.assignment && (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-[var(--shadow-ambient)] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)]">
              Stage Gate Assignment
            </h2>
          </div>
          <AssignmentForm
            assignmentId={stage.assignment.id}
            title={stage.assignment.title}
            brief={stage.assignment.prompt}
            rubric={typeof stage.assignment.rubric === "string" ? stage.assignment.rubric : JSON.stringify(stage.assignment.rubric, null, 2)}
            isLocked={!stage.gateReady}
            previousSubmissions={stage.assignment.submissions.map((s) => ({
              id: s.id,
              content: s.content,
              aiScore: s.aiScore,
              aiFeedback: s.aiFeedback,
              passed: s.passed,
              submittedAt: s.submittedAt.toISOString(),
            }))}
          />
        </div>
      )}
    </div>
  )
}
