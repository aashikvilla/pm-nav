import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PsiEntriesList } from "@/components/onboarding/psi-entries-list"

interface CategoryScore {
  category: string
  score: number
}

const ROLE_LABELS: Record<string, string> = {
  consumer: "Consumer PM",
  growth: "Growth PM",
  technical: "Technical PM",
  platform: "Platform PM",
  ai: "AI PM",
  b2b: "B2B PM",
}

export default async function OnboardingSummaryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  })

  if (!profile || profile.onboardingStep < 3) redirect("/onboarding/analyzing")

  // Load summary data directly (same logic as API route)
  const [pmTarget, latestSnapshot, psiEntries, skillScores] = await Promise.all([
    prisma.userPmTarget.findUnique({ where: { userId } }),
    prisma.readinessScoreSnapshot.findFirst({
      where: { userId },
      orderBy: { takenAt: "desc" },
    }),
    prisma.psiEntry.findMany({
      where: { userId, isVisible: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, problem: true, solution: true, impact: true },
    }),
    prisma.userSkillScore.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } },
    }),
  ])

  const psiCount = psiEntries.length

  // Group by category
  const categoryMap: Record<string, { name: string; scores: number[] }> = {}
  for (const ss of skillScores) {
    const catId = ss.skill.categoryId
    if (!categoryMap[catId]) {
      categoryMap[catId] = { name: ss.skill.category.name, scores: [] }
    }
    categoryMap[catId].scores.push(ss.evidenceScore)
  }

  const categorySummaries: CategoryScore[] = Object.values(categoryMap).map((v) => ({
    category: v.name,
    score: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length),
  }))

  const sorted = [...categorySummaries].sort((a, b) => b.score - a.score)
  const topStrengths = sorted.slice(0, 3)
  const topGaps = [...sorted].sort((a, b) => a.score - b.score).slice(0, 3)

  const rawScore = Math.round(latestSnapshot?.overallScore ?? 0)
  // Treat scores under 5 as uncalibrated (gap analysis slug mismatch produces near-zero)
  const scoreIsCalibrated = rawScore >= 5
  const overallScore = scoreIsCalibrated ? rawScore : 0
  const readyToApply = overallScore >= 70
  const targetRole = ROLE_LABELS[pmTarget?.targetRoleType ?? "consumer"] ?? "PM"

  // Mark onboarding complete
  if (profile.onboardingStep < 5) {
    await prisma.profile.update({
      where: { userId },
      data: { onboardingCompleted: true, onboardingStep: 5 },
    })
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Analysis complete</p>
          <h1 className="text-3xl font-semibold text-[var(--color-on-surface)] tracking-tight">
            Your PM readiness snapshot
          </h1>
          <p className="text-[var(--color-on-surface-variant)]">Based on {psiCount} experience signals extracted from your profile</p>
        </div>

        {/* Readiness score */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-surface-container)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeDasharray={`${(overallScore / 100) * 314} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {scoreIsCalibrated ? (
                <>
                  <span className="text-4xl font-bold text-[var(--color-on-surface)]">{overallScore}</span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">/ 100</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[var(--color-on-surface-variant)]">—</span>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-[var(--color-on-surface)]">Readiness for {targetRole}</p>
            {!scoreIsCalibrated ? (
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 max-w-xs mx-auto">
                We&apos;re still calibrating — your score will improve as you complete learning stages
              </p>
            ) : readyToApply ? (
              <p className="text-sm text-emerald-600 mt-1 font-medium">You&apos;re ready to start applying</p>
            ) : (
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                Reach 70 to start applying confidently
              </p>
            )}
          </div>
        </div>

        {/* Per-category skill scores */}
        {categorySummaries.length > 0 && (
          <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">Skill breakdown by category</h3>
            <div className="space-y-3">
              {sorted.map((s) => (
                <div key={s.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--color-on-surface-variant)]">{s.category}</span>
                    <span className="text-sm font-semibold text-[var(--color-on-surface)]">{s.score}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full"
                      style={{ width: `${Math.min(s.score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & gaps */}
        {categorySummaries.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Top strengths</h3>
              <div className="space-y-2">
                {topStrengths.map((s) => (
                  <div key={s.category} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-[var(--color-on-surface)] truncate">{s.category}</span>
                    <span className="text-sm font-semibold text-emerald-600 shrink-0">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">Focus areas</h3>
              <div className="space-y-2">
                {topGaps.map((g) => (
                  <div key={g.category} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-[var(--color-on-surface)] truncate">{g.category}</span>
                    <span className="text-sm font-semibold text-[var(--color-primary)] shrink-0">{g.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PSI entries */}
        {psiEntries.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-on-surface)]">
                {psiCount} experience {psiCount === 1 ? "entry" : "entries"} extracted
              </h3>
              <span className="text-xs text-[var(--color-on-surface-variant)]">Problem · Solution · Impact</span>
            </div>
            <PsiEntriesList entries={psiEntries} />
          </div>
        )}

        {/* PSI count (fallback when no entries to show) */}
        {psiEntries.length === 0 && (
          <div className="bg-[var(--color-secondary-fixed)] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white bg-opacity-50 flex items-center justify-center text-lg shrink-0">
              ✦
            </div>
            <div>
              <p className="font-semibold text-[var(--color-on-surface)]">No experience entries yet</p>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                Complete the conversation step to extract your experiences
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full text-center bg-[var(--color-primary)] text-white rounded-full py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
          >
            Enter your dashboard →
          </Link>
          <p className="text-xs text-center text-[var(--color-on-surface-variant)]">
            Your full skill breakdown, learning path, and resume builder are inside
          </p>
        </div>
      </div>
    </div>
  )
}
