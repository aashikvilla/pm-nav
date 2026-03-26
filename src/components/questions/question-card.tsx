import Link from "next/link"

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

interface QuestionCardProps {
  id: string
  question: string
  category: string
  difficulty: string
  roleTypes: string[]
  lastAttempt: { bestScore: number | null; lastAttemptedAt: string; attemptCount: number } | null
}

export function QuestionCard({ id, question, category, difficulty, roleTypes, lastAttempt }: QuestionCardProps) {
  const catColor = CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700"
  const catLabel = CATEGORY_LABELS[category] ?? category

  return (
    <Link
      href={`/dashboard/questions/${id}`}
      className="block bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-[var(--shadow-ambient)] p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
              {catLabel}
            </span>
            <DifficultyIndicator difficulty={difficulty} />
          </div>
          <p className="text-[var(--color-on-surface)] font-medium leading-snug line-clamp-2">
            {question}
          </p>
          {roleTypes.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {roleTypes.map((r) => (
                <span key={r} className="text-[10px] uppercase tracking-wide text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          {lastAttempt ? (
            <div className="space-y-0.5">
              <div className="text-lg font-semibold text-[var(--color-primary)]">
                {lastAttempt.bestScore ?? "—"}<span className="text-xs font-normal text-[var(--color-on-surface-variant)]">/100</span>
              </div>
              <div className="text-[10px] text-[var(--color-on-surface-variant)]">
                {lastAttempt.attemptCount} attempt{lastAttempt.attemptCount !== 1 ? "s" : ""}
              </div>
            </div>
          ) : (
            <span className="text-xs text-[var(--color-on-surface-variant)] italic">Not attempted</span>
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-[var(--color-primary)] font-medium">
        Practice This Question &rarr;
      </div>
    </Link>
  )
}
