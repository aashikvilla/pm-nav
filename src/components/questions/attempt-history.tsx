"use client"

import { useState } from "react"

interface Attempt {
  id: string
  aiScore: number | null
  aiFeedback: string | null
  attemptedAt: string
  response: string
}

export function AttemptHistory({ attempts }: { attempts: Attempt[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (attempts.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">
        Previous Attempts ({attempts.length})
      </h4>
      <div className="space-y-2">
        {attempts.map((a) => (
          <div key={a.id} className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[var(--shadow-ambient)] overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  {a.aiScore ?? "—"}/100
                </span>
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  {new Date(a.attemptedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <span className="text-[var(--color-on-surface-variant)] text-xs">
                {expandedId === a.id ? "Hide" : "Show"}
              </span>
            </button>
            {expandedId === a.id && (
              <div className="px-4 pb-4 space-y-2 border-t border-[var(--color-surface-container)]">
                <div className="pt-3">
                  <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1">Your answer:</p>
                  <p className="text-sm text-[var(--color-on-surface)] whitespace-pre-wrap">{a.response}</p>
                </div>
                {a.aiFeedback && (
                  <div>
                    <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1">Feedback:</p>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">{a.aiFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
