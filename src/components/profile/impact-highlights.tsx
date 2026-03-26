"use client"

import { useState } from "react"

interface PsiEntry {
  id: string
  problem: string
  solution: string
  impact: string
  workExperience?: { company: string; title: string } | null
}

export function ImpactHighlights({ entries }: { entries: PsiEntry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (entries.length === 0) return null

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isExpanded = expandedId === entry.id
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
            className="w-full text-left bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)] hover:shadow-md transition-shadow"
          >
            {/* Collapsed: one-line impact */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-[var(--color-primary)]" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0L7.8 4.2L12 6L7.8 7.8L6 12L4.2 7.8L0 6L4.2 4.2Z" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-on-surface)] leading-snug line-clamp-2">
                  {entry.impact}
                </p>
                {entry.workExperience && (
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                    {entry.workExperience.title} at {entry.workExperience.company}
                  </p>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-[var(--color-on-surface-variant)] flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Expanded: full PSI */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-[var(--color-surface-container-low)] space-y-3">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">Problem</p>
                  <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{entry.problem}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">Solution</p>
                  <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{entry.solution}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">Impact</p>
                  <p className="text-sm font-medium text-[var(--color-on-surface)] leading-relaxed">{entry.impact}</p>
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
