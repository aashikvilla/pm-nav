import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AnswerForm } from "@/components/questions/answer-form"
import { AttemptHistory } from "@/components/questions/attempt-history"

const CATEGORY_COLORS: Record<string, string> = {
  product_sense: "bg-blue-100 text-blue-700",
  analytical: "bg-purple-100 text-purple-700",
  strategy: "bg-green-100 text-green-700",
  behavioral: "bg-amber-100 text-amber-700",
  technical: "bg-gray-100 text-gray-700",
  estimation: "bg-teal-100 text-teal-700",
  execution: "bg-rose-100 text-rose-700",
}

const CATEGORY_LABELS: Record<string, string> = {
  product_sense: "Product Sense",
  analytical: "Analytical",
  strategy: "Strategy",
  behavioral: "Behavioral",
  technical: "Technical",
  estimation: "Estimation",
  execution: "Execution",
}

function DifficultyIndicator({ difficulty }: { difficulty: string }) {
  const levels = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3
  return (
    <span className="flex items-center gap-0.5 text-xs text-[var(--color-on-surface-variant)]">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${
            i <= levels ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-container)]"
          }`}
        />
      ))}
      <span className="ml-1 capitalize">{difficulty}</span>
    </span>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const { id } = await params

  const [question, attempts] = await Promise.all([
    prisma.questionBank.findUnique({ where: { id, isActive: true } }),
    prisma.questionAttempt.findMany({
      where: { userId, questionId: id },
      orderBy: { attemptedAt: "desc" },
    }),
  ])

  if (!question) notFound()

  const catColor = CATEGORY_COLORS[question.category] ?? "bg-gray-100 text-gray-700"
  const catLabel = CATEGORY_LABELS[question.category] ?? question.category

  const criteria: string[] =
    Array.isArray(question.evaluationCriteria)
      ? (question.evaluationCriteria as string[])
      : typeof question.evaluationCriteria === "string"
        ? [question.evaluationCriteria]
        : []

  const serializedAttempts = attempts.map((a) => ({
    id: a.id,
    aiScore: a.aiScore,
    aiFeedback: a.aiFeedback,
    attemptedAt: a.attemptedAt.toISOString(),
    response: a.response,
  }))

  return (
    <div className="max-w-2xl space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard/questions"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
      >
        <span>&#8592;</span>
        <span>Question Bank</span>
      </Link>

      {/* Question header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
            {catLabel}
          </span>
          <DifficultyIndicator difficulty={question.difficulty} />
          {question.roleTypes.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {question.roleTypes.map((r) => (
                <span
                  key={r}
                  className="text-[10px] uppercase tracking-wide text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full"
                >
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        <h1 className="text-xl font-medium text-[var(--color-on-surface)] leading-snug">
          {question.question}
        </h1>

        {criteria.length > 0 && (
          <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
              You will be evaluated on
            </p>
            <ul className="space-y-1.5">
              {criteria.map((c, i) => (
                <li
                  key={i}
                  className="text-sm text-[var(--color-on-surface-variant)] flex items-start gap-2"
                >
                  <span className="text-[var(--color-primary)] shrink-0 mt-0.5">&#8227;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Answer form */}
      <AnswerForm questionId={question.id} category={question.category} />

      {/* Attempt history */}
      {serializedAttempts.length > 0 && (
        <div className="pt-4">
          <AttemptHistory attempts={serializedAttempts} />
        </div>
      )}
    </div>
  )
}
