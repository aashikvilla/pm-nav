"use client"

import { useState } from "react"

interface ExistingSubmission {
  response: string
  aiFeedback: string | null
  score: number | null
  passed: boolean
}

interface QuickCheckFormProps {
  subtopicId: string
  subtopicTitle: string
  existingSubmission: ExistingSubmission | null
}

interface SubmissionResult {
  response: string
  aiFeedback: string | null
  score: number | null
  passed: boolean
}

export function QuickCheckForm({ subtopicId, subtopicTitle, existingSubmission }: QuickCheckFormProps) {
  const [submission, setSubmission] = useState<SubmissionResult | null>(existingSubmission)
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (response.trim().length < 10) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/v1/learning/quick-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId, response }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      setSubmission({
        response,
        aiFeedback: data.aiFeedback ?? null,
        score: data.score ?? null,
        passed: data.passed ?? false,
      })
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleTryAgain() {
    setSubmission(null)
    setResponse("")
    setError(null)
  }

  if (submission) {
    const bgClass = submission.passed
      ? "bg-green-50"
      : "bg-[var(--color-secondary-fixed)]/40"

    return (
      <div className="space-y-4">
        <div className={`rounded-2xl p-5 space-y-3 ${bgClass}`}>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                submission.passed
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {submission.passed ? "Passed" : "Needs Review"}
            </span>
            {submission.score !== null && (
              <span className="text-xs text-[var(--color-on-surface-variant)]">{submission.score}%</span>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1">Your response:</p>
            <p className="text-sm text-[var(--color-on-surface)] leading-relaxed whitespace-pre-wrap">
              {submission.response}
            </p>
          </div>

          {submission.aiFeedback && (
            <div>
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1">Feedback:</p>
              <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{submission.aiFeedback}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleTryAgain}
          className="px-5 py-2 rounded-full text-sm font-medium bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-on-surface)] mb-1">
          Quick check — {subtopicTitle}
        </p>
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Briefly describe what you understand about this topic in your own words.
        </p>
      </div>

      <div>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write a short explanation in your own words..."
          rows={5}
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--color-surface-container-lowest)] shadow-[var(--shadow-ambient)] p-4 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 resize-y outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
          {response.length} characters
          {response.length > 0 && response.length < 10 ? " — write at least 10 characters" : ""}
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || response.trim().length < 10}
        className="px-6 py-2.5 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        {isSubmitting ? "Reviewing your understanding…" : "Submit"}
      </button>
    </div>
  )
}
