"use client"

import { useState } from "react"
import { EvaluationResult } from "./evaluation-result"

interface AnswerFormProps {
  questionId: string
  category: string
}

const CATEGORY_HINTS: Record<string, string[]> = {
  product_sense: [
    "Think about the user problem and who the target audience is",
    "Consider how you would measure success",
    "Structure your answer with a clear framework",
  ],
  analytical: [
    "Break down the problem into components",
    "Consider what data you would need",
    "State your assumptions clearly",
  ],
  strategy: [
    "Think about market dynamics and competitive landscape",
    "Consider short-term vs long-term tradeoffs",
    "Ground your answer in business metrics",
  ],
  behavioral: [
    "Use the STAR method: Situation, Task, Action, Result",
    "Be specific about your role and contributions",
    "Share what you learned from the experience",
  ],
  technical: [
    "Consider system design tradeoffs",
    "Think about scalability and edge cases",
    "Explain your reasoning, not just the answer",
  ],
  estimation: [
    "State your assumptions upfront",
    "Break the problem into smaller, estimable parts",
    "Sanity-check your final number",
  ],
  execution: [
    "Think about prioritization and sequencing",
    "Consider dependencies and risks",
    "Define clear success criteria",
  ],
}

const LOADING_MESSAGES = [
  "Reading your answer carefully...",
  "Evaluating against PM interview standards...",
  "Analyzing your reasoning and structure...",
  "Checking coverage of key points...",
]

interface EvaluationData {
  totalScore: number
  breakdown: { criterion: string; score: number; maxPoints: number; comment: string }[]
  feedback: string
  missedKeyPoints: string[]
  strongPoints: string[]
}

export function AnswerForm({ questionId, category }: AnswerFormProps) {
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("")
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hints = CATEGORY_HINTS[category] ?? CATEGORY_HINTS.product_sense

  async function handleSubmit() {
    if (response.trim().length < 10) return
    setIsSubmitting(true)
    setError(null)
    setEvaluation(null)

    // Rotate loading messages
    let msgIndex = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIndex])
    }, 3000)

    try {
      const res = await fetch("/api/v1/questions/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, response }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      setEvaluation(data.evaluation)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      clearInterval(interval)
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setResponse("")
    setEvaluation(null)
    setError(null)
  }

  if (evaluation) {
    return (
      <div className="space-y-6">
        <EvaluationResult evaluation={evaluation} />
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-4 space-y-2">
        <p className="text-sm font-medium text-[var(--color-on-surface)]">Before you answer, consider:</p>
        <ul className="space-y-1">
          {hints.map((hint, i) => (
            <li key={i} className="text-sm text-[var(--color-on-surface-variant)] flex items-start gap-2">
              <span className="text-[var(--color-primary)] mt-0.5 shrink-0">&#8227;</span>
              {hint}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your answer here. Take your time — structure and depth matter more than speed."
          rows={12}
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[var(--color-surface-container-lowest)] shadow-[var(--shadow-ambient)] p-4 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 resize-y outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
          {response.length} characters {response.length < 10 && response.length > 0 ? "— write at least 10 characters" : ""}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || response.trim().length < 10}
        className="px-6 py-2.5 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        {isSubmitting ? loadingMsg : "Submit for AI Evaluation"}
      </button>
    </div>
  )
}
