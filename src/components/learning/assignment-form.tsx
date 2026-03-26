"use client"

import { useState } from "react"

interface PreviousSubmission {
  id: string
  content: string
  aiScore: number | null
  aiFeedback: string | null
  passed: boolean
  submittedAt: string
}

interface AssignmentFormProps {
  assignmentId: string
  title: string
  brief: string
  rubric: string
  isLocked: boolean
  previousSubmissions: PreviousSubmission[]
}

interface SubmissionResult {
  aiScore: number | null
  aiFeedback: string | null
  passed: boolean
  breakdown: { criterion: string; score: number; maxPoints: number; comment: string }[]
  strengths: string[]
  improvements: string[]
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? "var(--color-primary)" : score >= 40 ? "#d97706" : "#dc2626"

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--color-surface-container)"
          strokeWidth="6"
        />
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

function PreviousAttempts({ attempts }: { attempts: PreviousSubmission[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  if (attempts.length === 0) return null

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--color-on-surface)]"
      >
        <span>Previous Attempts ({attempts.length})</span>
        <svg
          className={`w-4 h-4 text-[var(--color-on-surface-variant)] transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="space-y-2">
          {attempts.map((a) => (
            <div
              key={a.id}
              className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[var(--shadow-ambient)] overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      a.passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {a.passed ? "Passed" : "Not passed"}
                  </span>
                  {a.aiScore !== null && (
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{a.aiScore}/100</span>
                  )}
                  <span className="text-xs text-[var(--color-on-surface-variant)]">
                    {new Date(a.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  {expandedId === a.id ? "Hide" : "Show"}
                </span>
              </button>
              {expandedId === a.id && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1">Your submission:</p>
                    <p className="text-sm text-[var(--color-on-surface)] whitespace-pre-wrap leading-relaxed">
                      {a.content}
                    </p>
                  </div>
                  {a.aiFeedback && (
                    <div>
                      <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1">Feedback:</p>
                      <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{a.aiFeedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AssignmentForm({
  assignmentId,
  title,
  brief,
  rubric,
  isLocked,
  previousSubmissions,
}: AssignmentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rubricOpen, setRubricOpen] = useState(false)

  async function handleSubmit() {
    if (content.trim().length < 50) return
    setIsSubmitting(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/v1/learning/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, content }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      setResult({
        aiScore: data.aiScore ?? null,
        aiFeedback: data.aiFeedback ?? null,
        passed: data.passed ?? false,
        breakdown: data.breakdown ?? [],
        strengths: data.strengths ?? [],
        improvements: data.improvements ?? [],
      })
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setResult(null)
    setContent("")
    setError(null)
  }

  if (isLocked) {
    return (
      <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-6 text-center space-y-2">
        <p className="text-sm font-medium text-[var(--color-on-surface)]">Assignment locked</p>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Complete all resources and quick checks to unlock this assignment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Brief */}
      <div className="space-y-2">
        <h3 className="font-semibold text-[var(--color-on-surface)]">{title}</h3>
        <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-wrap">{brief}</p>
      </div>

      {/* Collapsible rubric */}
      <div className="bg-[var(--color-surface-container-low)] rounded-2xl overflow-hidden">
        <button
          onClick={() => setRubricOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-sm font-medium text-[var(--color-on-surface)]">Evaluation Rubric</span>
          <svg
            className={`w-4 h-4 text-[var(--color-on-surface-variant)] transition-transform ${rubricOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {rubricOpen && (
          <div className="px-4 pb-4">
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-wrap">
              {rubric}
            </p>
          </div>
        )}
      </div>

      {/* Result view */}
      {result ? (
        <div className="space-y-5">
          {/* Score + summary */}
          <div
            className={`rounded-2xl p-6 flex items-center gap-5 ${
              result.passed ? "bg-green-50" : "bg-[var(--color-secondary-fixed)]/40"
            }`}
          >
            {result.aiScore !== null && <ScoreRing score={result.aiScore} />}
            <div className="flex-1 space-y-1">
              <p
                className={`text-sm font-semibold ${
                  result.passed ? "text-green-700" : "text-amber-700"
                }`}
              >
                {result.passed
                  ? "Great work — you passed this assignment!"
                  : "Not quite there yet — keep refining your thinking."}
              </p>
              {result.aiFeedback && (
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {result.aiFeedback}
                </p>
              )}
            </div>
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">What you did well</h4>
              <div className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                    <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">Areas to strengthen</h4>
              <div className="space-y-1.5">
                {result.improvements.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                    <span className="text-amber-500 mt-0.5 shrink-0">&#9679;</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breakdown */}
          {result.breakdown.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">Detailed Breakdown</h4>
              <div className="space-y-2">
                {result.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[var(--shadow-ambient)] p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--color-on-surface)]">{item.criterion}</span>
                      <span className="text-sm font-semibold text-[var(--color-primary)]">
                        {item.score}/{item.maxPoints}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                        style={{
                          width: `${item.maxPoints > 0 ? (item.score / item.maxPoints) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{item.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-full text-sm font-medium bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        /* Submission form */
        <div className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your response here. Be thorough — this is a substantive assignment that deserves a full answer."
              rows={14}
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[var(--color-surface-container-lowest)] shadow-[var(--shadow-ambient)] p-4 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 resize-y outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
              {content.length} characters
              {content.length > 0 && content.length < 50 ? " — write at least 50 characters" : ""}
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || content.trim().length < 50}
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? "We're reading your work carefully…" : "Submit for Review"}
          </button>
        </div>
      )}

      {/* Previous attempts */}
      {previousSubmissions.length > 0 && (
        <PreviousAttempts attempts={previousSubmissions} />
      )}
    </div>
  )
}
