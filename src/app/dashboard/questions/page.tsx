import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { QuestionCard } from "@/components/questions/question-card"
import { QuestionFilters } from "@/components/questions/question-filters"

interface PageProps {
  searchParams: Promise<{ category?: string; difficulty?: string }>
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const { category, difficulty } = await searchParams

  const where: Record<string, unknown> = { isActive: true }
  if (category) where.category = category
  if (difficulty) where.difficulty = difficulty

  const [questions, attempts] = await Promise.all([
    prisma.questionBank.findMany({ where, orderBy: { category: "asc" } }),
    prisma.questionAttempt.findMany({
      where: { userId },
      select: { questionId: true, aiScore: true, attemptedAt: true },
      orderBy: { attemptedAt: "desc" },
    }),
  ])

  // Group attempts by questionId
  const attemptMap = new Map<
    string,
    { bestScore: number | null; lastAttemptedAt: string; attemptCount: number }
  >()
  for (const a of attempts) {
    const existing = attemptMap.get(a.questionId)
    if (!existing) {
      attemptMap.set(a.questionId, {
        bestScore: a.aiScore,
        lastAttemptedAt: a.attemptedAt.toISOString(),
        attemptCount: 1,
      })
    } else {
      existing.attemptCount += 1
      if (a.aiScore !== null && (existing.bestScore === null || a.aiScore > existing.bestScore)) {
        existing.bestScore = a.aiScore
      }
    }
  }

  const uniqueAttempted = attemptMap.size
  const scores = [...attemptMap.values()]
    .map((a) => a.bestScore)
    .filter((s): s is number => s !== null)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

  const hasAttempts = uniqueAttempted > 0

  const subtitle = hasAttempts
    ? `${uniqueAttempted} question${uniqueAttempted !== 1 ? "s" : ""} practiced${avgScore !== null ? `, averaging ${avgScore}/100` : ""}. Keep building that muscle.`
    : "Practice makes permanent. Choose a question and take your time."

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          Question Bank
        </h1>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{subtitle}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--color-on-surface)]">
            {questions.length}
          </div>
          <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Total questions</div>
        </div>
        <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--color-on-surface)]">
            {uniqueAttempted}
          </div>
          <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Attempted</div>
        </div>
        <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--color-on-surface)]">
            {avgScore !== null ? avgScore : "—"}
          </div>
          <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Avg. score</div>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-12 rounded-2xl bg-[var(--color-surface-container-low)] animate-pulse" />}>
        <QuestionFilters />
      </Suspense>

      {/* Question grid */}
      {questions.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <p className="text-sm">No questions match your filters.</p>
          <p className="text-xs mt-1 opacity-70">Try removing a filter to see more questions.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              category={q.category}
              difficulty={q.difficulty}
              roleTypes={q.roleTypes}
              lastAttempt={attemptMap.get(q.id) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
