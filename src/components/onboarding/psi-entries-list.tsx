"use client"

import { useState } from "react"

interface PsiEntry {
  id: string
  problem: string
  solution: string
  impact: string
}

interface Props {
  entries: PsiEntry[]
}

function PsiEntryCard({ entry, index }: { entry: PsiEntry; index: number }) {
  const [open, setOpen] = useState(false)

  // Truncate problem for collapsed preview
  const preview = entry.problem.length > 90 ? entry.problem.slice(0, 90) + "…" : entry.problem

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-[var(--color-surface-container-low)] transition-colors"
      >
        <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center text-xs font-semibold text-[var(--color-on-surface-variant)] mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--color-on-surface)] leading-snug">{open ? entry.problem : preview}</p>
        </div>
        <span className="shrink-0 text-[var(--color-on-surface-variant)] text-xs mt-0.5 ml-2">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-surface-container-low)]">
          <div className="pt-3 space-y-3 text-sm text-[var(--color-on-surface)] leading-relaxed">
            <div>
              <span className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                Solution
              </span>
              <p>{entry.solution}</p>
            </div>
            <div>
              <span className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                Impact
              </span>
              <p>{entry.impact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function PsiEntriesList({ entries }: Props) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <PsiEntryCard key={entry.id} entry={entry} index={i} />
      ))}
    </div>
  )
}
