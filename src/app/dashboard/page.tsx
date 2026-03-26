import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeReadinessScore } from "@/lib/score-calculator"
import { getGapExplanation } from "@/lib/gap-explanations"
import { ReadinessScoreWidget } from "@/components/dashboard/readiness-score-widget"
import { SkillBreakdown } from "@/components/dashboard/skill-breakdown"
import { SkillGapsPanel } from "@/components/dashboard/skill-gaps-panel"
import { PsiSummaryWidget } from "@/components/dashboard/psi-summary-widget"
import { StreakWidget } from "@/components/dashboard/streak-widget"
import { ActivityGraph } from "@/components/dashboard/activity-graph"

const ONBOARDING_STEP_URLS: Record<number, string> = {
  0: "/onboarding/upload",
  1: "/onboarding/profile",
  2: "/onboarding/analyzing",
  3: "/onboarding/conversation",
  4: "/onboarding/summary",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const profile = await prisma.profile.findUnique({ where: { userId } })

  // Onboarding guard — only redirect if explicitly incomplete AND early stage
  if (profile && !profile.onboardingCompleted && (profile.onboardingStep ?? 0) < 3) {
    redirect(ONBOARDING_STEP_URLS[profile.onboardingStep ?? 0] ?? "/onboarding/upload")
  }

  // Parallel data fetch
  const [pmTarget, skillScores, psiEntries, psiCount, streak, activityLogs] = await Promise.all([
    prisma.userPmTarget.findUnique({ where: { userId } }),
    prisma.userSkillScore.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } },
    }),
    prisma.psiEntry.findMany({
      where: { userId, isVisible: true },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, problem: true },
    }),
    prisma.psiEntry.count({ where: { userId, isVisible: true } }),
    prisma.userStreak.findUnique({ where: { userId } }),
    prisma.activityLog.findMany({
      where: { userId, createdAt: { gte: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
  ])

  // Readiness score
  let readiness: { overall: number; byCategory: Record<string, number> } = { overall: 0, byCategory: {} }

  if (skillScores.length > 0) {
    const roleWeights = pmTarget
      ? await prisma.roleWeight.findMany({ where: { roleType: pmTarget.targetRoleType } })
      : []

    const scoreInputs = skillScores.map((s) => ({
      skillId: s.skillId,
      categoryId: s.skill.categoryId,
      evidenceScore: s.evidenceScore,
      assignmentScore: s.assignmentScore,
      learningScore: s.learningScore,
    }))

    const weightInputs = roleWeights.map((rw) => ({ categoryId: rw.categoryId, weight: rw.weight }))
    const result = computeReadinessScore(scoreInputs, weightInputs)

    // Map categoryId → slug
    const categorySlugMap = new Map<string, string>()
    for (const s of skillScores) {
      categorySlugMap.set(s.skill.categoryId, s.skill.category.slug)
    }

    const byCategorySlug: Record<string, number> = {}
    for (const [catId, score] of Object.entries(result.byCategory)) {
      const slug = categorySlugMap.get(catId)
      if (slug) byCategorySlug[slug] = Math.round(score)
    }

    readiness = { overall: result.overall, byCategory: byCategorySlug }
  }

  // Build category info for gaps/strengths
  const categoryInfo: { slug: string; name: string; score: number }[] = []
  for (const [slug, score] of Object.entries(readiness.byCategory)) {
    const match = skillScores.find((s) => s.skill.category.slug === slug)
    if (match) {
      categoryInfo.push({ slug, name: match.skill.category.name, score })
    }
  }
  categoryInfo.sort((a, b) => a.score - b.score)

  const roleType = pmTarget?.targetRoleType ?? null

  const topGaps = categoryInfo.slice(0, 3).map((c) => ({
    categoryName: c.name,
    score: c.score,
    explanation: getGapExplanation(roleType, c.slug),
    learningHref: "/dashboard/learning",
  }))

  const categoryList = categoryInfo.map((c) => ({ name: c.name, score: c.score }))

  const psiSummary = {
    totalCount: psiCount,
    previews: psiEntries.map((e) => ({ id: e.id, problemPreview: e.problem.slice(0, 120) })),
  }

  // Activity heatmap
  const activityByDay: Record<string, number> = {}
  for (const log of activityLogs) {
    const day = log.createdAt.toISOString().slice(0, 10)
    activityByDay[day] = (activityByDay[day] ?? 0) + 1
  }

  const hasScores = Object.keys(readiness.byCategory).length > 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          Welcome back{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/psi"
            className="text-sm text-[var(--color-primary)] font-medium hover:opacity-80 transition-opacity"
          >
            View Skill Analysis
          </Link>
          {streak && streak.currentStreak > 0 && (
            <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
              🔥 {streak.currentStreak}-day streak
            </span>
          )}
        </div>
      </div>

      {!hasScores ? (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-[var(--radius-card)] p-10 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Analysis still running — your scores will appear here shortly.
          </p>
        </div>
      ) : (
        <>
          {/* Top row: score + gaps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReadinessScoreWidget score={readiness.overall} targetRoleType={roleType} />
            <div className="md:col-span-2">
              <SkillGapsPanel gaps={topGaps} />
            </div>
          </div>

          {/* Skill breakdown */}
          <SkillBreakdown categories={categoryList} />

          {/* PSI summary + streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PsiSummaryWidget totalCount={psiSummary.totalCount} previews={psiSummary.previews} />
            {streak && (
              <StreakWidget
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
                lastActiveDate={streak.lastActiveDate ? new Date(streak.lastActiveDate) : null}
                totalDaysActive={streak.totalDaysActive}
              />
            )}
          </div>

          {/* Activity graph */}
          <ActivityGraph activityByDay={activityByDay} />
        </>
      )}
    </div>
  )
}
