"use client"

interface KeywordMatchProps {
  matched: string[]
  missing: string[]
}

export function KeywordMatch({ matched, missing }: KeywordMatchProps) {
  if (!matched.length && !missing.length) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-on-surface-variant)]">
        Keyword Match
      </p>

      {matched.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-[var(--color-on-surface-variant)]">
            Matched <span className="font-medium text-[var(--color-on-surface)]">{matched.length}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-[var(--color-on-surface-variant)]">
            Missing <span className="font-medium text-[var(--color-on-surface)]">{missing.length}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"
              >
                <span className="text-[10px]">✕</span>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
