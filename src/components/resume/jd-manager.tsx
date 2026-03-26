"use client"

import { useState, useTransition } from "react"
import type { JdItem, ResumeVersionItem } from "./types"

const OPTIMIZE_MESSAGES = [
  "Analyzing job requirements…",
  "Matching your experience…",
  "Crafting tailored bullets…",
  "Calculating ATS compatibility…",
]

interface JdManagerProps {
  initialJds: JdItem[]
  maxJds: number
  onVersionCreated: (version: ResumeVersionItem) => void
}

export function JdManager({ initialJds, maxJds, onVersionCreated }: JdManagerProps) {
  const [jds, setJds] = useState<JdItem[]>(initialJds)
  const [showForm, setShowForm] = useState(false)

  // Add JD form state
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [content, setContent] = useState("")
  const [addError, setAddError] = useState<string | null>(null)
  const [isAdding, startAdding] = useTransition()

  // Optimize state: jdId → loading message index
  const [optimizingId, setOptimizingId] = useState<string | null>(null)
  const [optimizeMsgIdx, setOptimizeMsgIdx] = useState(0)
  const [optimizeError, setOptimizeError] = useState<string | null>(null)

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAddJd(e: React.FormEvent) {
    e.preventDefault()
    setAddError(null)

    startAdding(async () => {
      try {
        const res = await fetch("/api/v1/resume/jds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), company: company.trim() || undefined, content }),
        })
        const data = await res.json()
        if (!res.ok) {
          setAddError(data.error ?? "Something went wrong. Please try again.")
          return
        }
        const newJd: JdItem = {
          ...data.jd,
          createdAt: data.jd.createdAt ?? new Date().toISOString(),
        }
        setJds((prev) => [newJd, ...prev])
        setTitle("")
        setCompany("")
        setContent("")
        setShowForm(false)
      } catch {
        setAddError("Network error — check your connection and try again.")
      }
    })
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/v1/resume/jds/${id}`, { method: "DELETE" })
      if (res.ok || res.status === 404) {
        setJds((prev) => prev.filter((j) => j.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  async function handleOptimize(jdId: string) {
    setOptimizingId(jdId)
    setOptimizeMsgIdx(0)
    setOptimizeError(null)

    // Cycle through loading messages
    let msgI = 0
    const interval = setInterval(() => {
      msgI = (msgI + 1) % OPTIMIZE_MESSAGES.length
      setOptimizeMsgIdx(msgI)
    }, 3500)

    try {
      const res = await fetch("/api/v1/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOptimizeError(data.error ?? "Optimization failed. Please try again.")
        return
      }
      // Build a full ResumeVersionItem to pass up
      const jd = jds.find((j) => j.id === jdId)
      const version: ResumeVersionItem = {
        id: data.version.id,
        title: data.version.title,
        atsScore: data.version.atsScore,
        keywordMatch: data.version.keywordMatch,
        content: data.content,
        createdAt: data.version.createdAt ?? new Date().toISOString(),
        jd: jd ? { id: jd.id, title: jd.title, company: jd.company } : null,
      }
      onVersionCreated(version)
    } catch {
      setOptimizeError("Network error — check your connection and try again.")
    } finally {
      clearInterval(interval)
      setOptimizingId(null)
    }
  }

  const canAdd = jds.length < maxJds

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-on-surface)]">Job Descriptions</h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
            {jds.length}/{maxJds} added
          </p>
        </div>
        {canAdd && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90"
          >
            <span className="text-base leading-none">+</span>
            Add JD
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAddJd}
          className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 space-y-4 shadow-[var(--shadow-ambient)]"
        >
          <p className="text-sm font-medium text-[var(--color-on-surface)]">New job description</p>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-[var(--color-on-surface-variant)]" htmlFor="jd-title">
                Job title <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                id="jd-title"
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full bg-[var(--color-surface-container-low)] text-sm text-[var(--color-on-surface)] rounded-xl px-3 py-2.5 border-0 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-on-surface-variant)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[var(--color-on-surface-variant)]" htmlFor="jd-company">
                Company <span className="text-[var(--color-on-surface-variant)] font-normal">(optional)</span>
              </label>
              <input
                id="jd-company"
                type="text"
                maxLength={200}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe"
                className="w-full bg-[var(--color-surface-container-low)] text-sm text-[var(--color-on-surface)] rounded-xl px-3 py-2.5 border-0 outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-on-surface-variant)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[var(--color-on-surface-variant)]" htmlFor="jd-content">
                Job description <span className="text-[var(--color-primary)]">*</span>
              </label>
              <textarea
                id="jd-content"
                required
                minLength={50}
                maxLength={20000}
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the full job description here — the more detail, the better your tailored resume will be."
                className="w-full bg-[var(--color-surface-container-low)] text-sm text-[var(--color-on-surface)] rounded-xl px-3 py-2.5 border-0 outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-y placeholder:text-[var(--color-on-surface-variant)] leading-relaxed"
              />
              <p className="text-[11px] text-[var(--color-on-surface-variant)]">
                {content.length} chars {content.length < 50 ? `— need ${50 - content.length} more` : ""}
              </p>
            </div>
          </div>

          {addError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{addError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isAdding || content.length < 50}
              className="flex-1 py-2.5 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white disabled:opacity-50 transition-opacity hover:opacity-90"
            >
              {isAdding ? "Extracting keywords…" : "Save & Extract Keywords"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setAddError(null)
              }}
              className="px-4 py-2.5 rounded-full text-sm font-medium text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-low)] transition-opacity hover:opacity-80"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* JD list */}
      {jds.length === 0 && !showForm ? (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 flex flex-col items-center gap-3 shadow-[var(--shadow-ambient)]">
          <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-on-surface-variant)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] text-center max-w-[220px]">
            Add a job description you're interested in, and we'll tailor your resume to it.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-1 px-5 py-2 rounded-full text-sm font-medium bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90"
          >
            Add your first JD
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {jds.map((jd) => {
            const isOptimizing = optimizingId === jd.id
            const isDeleting = deletingId === jd.id
            return (
              <li
                key={jd.id}
                className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 shadow-[var(--shadow-ambient)] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{jd.title}</p>
                    {jd.company && (
                      <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{jd.company}</p>
                    )}
                    <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1">
                      {jd.keywords.length} keywords extracted
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(jd.id)}
                    disabled={isDeleting || isOptimizing}
                    aria-label="Delete job description"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] disabled:opacity-40 transition-colors shrink-0"
                  >
                    {isDeleting ? (
                      <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Keywords preview */}
                {jd.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {jd.keywords.slice(0, 8).map((kw) => (
                      <span
                        key={kw}
                        className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"
                      >
                        {kw}
                      </span>
                    ))}
                    {jd.keywords.length > 8 && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                        +{jd.keywords.length - 8} more
                      </span>
                    )}
                  </div>
                )}

                {/* Optimize button */}
                <button
                  onClick={() => handleOptimize(jd.id)}
                  disabled={isOptimizing || !!optimizingId}
                  className="w-full py-2.5 rounded-full text-sm font-medium bg-[var(--color-secondary-fixed)] text-[var(--color-on-surface)] disabled:opacity-60 transition-opacity hover:opacity-90"
                >
                  {isOptimizing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-[1.5px] border-[var(--color-on-surface)] border-t-transparent rounded-full animate-spin" />
                      {OPTIMIZE_MESSAGES[optimizeMsgIdx]}
                    </span>
                  ) : (
                    "Optimize Resume for This Role"
                  )}
                </button>

              </li>
            )
          })}
        </ul>
      )}

      {/* Optimize error (shown once, after optimizing finishes) */}
      {optimizeError && !optimizingId && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{optimizeError}</p>
      )}
    </div>
  )
}
