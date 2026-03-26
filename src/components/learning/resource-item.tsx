"use client"

import { useState } from "react"

type ResourceType = "article" | "video" | "exercise" | "tool"

const TYPE_ICONS: Record<ResourceType, string> = {
  article: "📖",
  video: "🎥",
  exercise: "✏️",
  tool: "🔧",
}

const TYPE_LABELS: Record<ResourceType, string> = {
  article: "Article",
  video: "Video",
  exercise: "Exercise",
  tool: "Tool",
}

interface ResourceItemProps {
  id: string
  subtopicId: string
  title: string
  type: ResourceType
  url: string | null
  estimatedMinutes: number | null
  isCompleted: boolean
}

export function ResourceItem({
  id,
  subtopicId,
  title,
  type,
  url,
  estimatedMinutes,
  isCompleted: initialCompleted,
}: ResourceItemProps) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMarkDone() {
    if (completed || isLoading) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/v1/learning/resources/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: id, subtopicId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Failed to mark as done.")
        return
      }
      setCompleted(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Type icon */}
      <span className="text-base shrink-0" aria-label={TYPE_LABELS[type]}>
        {TYPE_ICONS[type]}
      </span>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline leading-snug"
          >
            {title}
          </a>
        ) : (
          <span className="text-sm font-medium text-[var(--color-on-surface)] leading-snug">{title}</span>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--color-on-surface-variant)]">{TYPE_LABELS[type]}</span>
          {estimatedMinutes !== null && (
            <>
              <span className="text-xs text-[var(--color-on-surface-variant)]">&middot;</span>
              <span className="text-xs text-[var(--color-on-surface-variant)]">{estimatedMinutes} min</span>
            </>
          )}
        </div>
        {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      </div>

      {/* Completion control */}
      {completed ? (
        <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-green-600">
          <svg
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 10 8 14 16 6" />
          </svg>
          Done
        </span>
      ) : (
        <button
          onClick={handleMarkDone}
          disabled={isLoading}
          className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving…" : "Mark Done"}
        </button>
      )}
    </div>
  )
}
