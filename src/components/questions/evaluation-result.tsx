interface Breakdown {
  criterion: string
  score: number
  maxPoints: number
  comment: string
}

interface EvaluationResultProps {
  evaluation: {
    totalScore: number
    breakdown: Breakdown[]
    feedback: string
    missedKeyPoints: string[]
    strongPoints: string[]
  }
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? "var(--color-primary)" : score >= 40 ? "#d97706" : "#dc2626"

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--color-surface-container)" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-[var(--color-on-surface)]">{score}</span>
      </div>
    </div>
  )
}

export function EvaluationResult({ evaluation }: EvaluationResultProps) {
  const { totalScore, breakdown, feedback, missedKeyPoints, strongPoints } = evaluation

  return (
    <div className="space-y-6">
      {/* Score + Summary */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-[var(--shadow-ambient)] p-6 flex items-center gap-6">
        <ScoreRing score={totalScore} />
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-[var(--color-on-surface)]">Your Score</h3>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{feedback}</p>
        </div>
      </div>

      {/* Strong Points */}
      {strongPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">What you did well</h4>
          <div className="space-y-1.5">
            {strongPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas to Improve */}
      {missedKeyPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">Points to strengthen next time</h4>
          <div className="space-y-1.5">
            {missedKeyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                <span className="text-amber-500 mt-0.5 shrink-0">&#9679;</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criteria Breakdown */}
      {breakdown.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">Detailed Breakdown</h4>
          <div className="space-y-2">
            {breakdown.map((item, i) => (
              <div key={i} className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[var(--shadow-ambient)] p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-on-surface)]">{item.criterion}</span>
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    {item.score}/{item.maxPoints}
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                    style={{ width: `${item.maxPoints > 0 ? (item.score / item.maxPoints) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{item.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
