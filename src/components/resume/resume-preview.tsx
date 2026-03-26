"use client"

import { useState } from "react"
import type { ResumeVersionItem } from "./types"
import { AtsScoreGauge } from "./ats-score-gauge"
import { KeywordMatch } from "./keyword-match"

interface ResumePreviewProps {
  versions: ResumeVersionItem[]
}

export function ResumePreview({ versions }: ResumePreviewProps) {
  const [selectedId, setSelectedId] = useState<string>(versions[0]?.id ?? "")
  const version = versions.find((v) => v.id === selectedId) ?? versions[0]

  if (!version) {
    return (
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-10 flex flex-col items-center justify-center gap-4 min-h-[320px] shadow-[var(--shadow-ambient)]">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-on-surface-variant)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-[var(--color-on-surface)]">No resume version yet</p>
          <p className="text-xs text-[var(--color-on-surface-variant)] max-w-[240px]">
            Add a job description and hit "Optimize Resume" — we'll tailor your bullets to the role.
          </p>
        </div>
      </div>
    )
  }

  const { content, atsScore, keywordMatch } = version
  const km = keywordMatch as { matched: string[]; missing: string[] } | null

  return (
    <div className="space-y-4">
      {/* Version selector */}
      {versions.length > 1 && (
        <div className="flex items-center gap-2">
          <label htmlFor="version-select" className="text-xs text-[var(--color-on-surface-variant)] shrink-0">
            Version:
          </label>
          <select
            id="version-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 text-xs bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] rounded-lg px-3 py-1.5 border-0 outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}{v.jd ? ` — ${v.jd.title}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Card */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-[var(--shadow-ambient)] overflow-hidden">
        {/* ATS + keywords sidebar strip */}
        {(atsScore !== null || km) && (
          <div className="bg-[var(--color-surface-container-low)] px-6 py-5 flex flex-wrap gap-6 items-start">
            {atsScore !== null && <AtsScoreGauge score={atsScore} />}
            {km && (
              <div className="flex-1 min-w-[200px]">
                <KeywordMatch matched={km.matched} missing={km.missing} />
              </div>
            )}
          </div>
        )}

        {/* Resume document */}
        <div className="px-6 py-6 space-y-6">
          {/* Profile header */}
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold text-[var(--color-on-surface)] leading-tight">
              {content.profile.fullName || "Your Name"}
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {content.profile.currentRole || "Product Manager"}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {content.profile.email && (
                <span className="text-xs text-[var(--color-on-surface-variant)]">{content.profile.email}</span>
              )}
              {content.profile.linkedinUrl && (
                <a
                  href={content.profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Summary */}
          {content.summary && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                Summary
              </p>
              <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">{content.summary}</p>
            </div>
          )}

          {/* Experience bullets */}
          {content.bullets?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-on-surface-variant)]">
                Experience Highlights
              </p>
              <ul className="space-y-4">
                {content.bullets.map((bullet, i) => (
                  <li key={i} className="space-y-2">
                    {/* Optimized bullet */}
                    <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                      <BulletWithHighlights text={bullet.optimized} keywords={bullet.keywords} />
                    </p>
                    {/* Original — shown as a softer reference */}
                    {bullet.original && bullet.original !== bullet.optimized && (
                      <p className="text-[11px] text-[var(--color-on-surface-variant)] leading-relaxed pl-3 border-l-2 border-[var(--color-surface-container)]">
                        Original: {bullet.original}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BulletWithHighlights({ text, keywords }: { text: string; keywords: string[] }) {
  if (!keywords?.length) return <>{text}</>

  // Split on keyword boundaries (case-insensitive)
  const pattern = new RegExp(`(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi")
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, i) =>
        keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
          <mark
            key={i}
            className="bg-[var(--color-secondary-fixed)] text-[var(--color-on-surface)] rounded px-0.5 not-italic font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
