"use client"

interface AtsScoreGaugeProps {
  score: number
}

export function AtsScoreGauge({ score }: AtsScoreGaugeProps) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = () => {
    if (score >= 80) return "var(--color-primary)"
    if (score >= 60) return "var(--color-secondary-fixed)"
    return "var(--color-error, #dc2626)"
  }

  const getLabel = () => {
    if (score >= 80) return "Strong match"
    if (score >= 60) return "Good start"
    return "Needs work"
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)]">
        ATS Score
      </p>
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke="var(--color-surface-container-low)"
            strokeWidth="8"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={getScoreColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-[var(--color-on-surface)]">{score}</span>
          <span className="text-[10px] text-[var(--color-on-surface-variant)]">/100</span>
        </div>
      </div>
      <p className="text-xs text-[var(--color-on-surface-variant)]">{getLabel()}</p>
    </div>
  )
}
