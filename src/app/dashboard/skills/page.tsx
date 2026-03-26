import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { computeReadinessScore } from "@/lib/score-calculator"
import { getGapExplanation } from "@/lib/gap-explanations"

function scoreColor(score: number): string {
  if (score < 30) return "var(--color-secondary-fixed)"
  if (score < 60) return "var(--color-outline-variant)"
  return "var(--color-primary)"
}

function scoreBadgeClass(score: number): string {
  if (score >= 60) return "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
  if (score >= 30) return "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"
  return "bg-[var(--color-secondary-fixed)]/30 text-amber-700"
}

export default async function SkillsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const [skillScores, pmTarget] = await Promise.all([
    prisma.userSkillScore.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } },
    }),
    prisma.userPmTarget.findUnique({ where: { userId } }),
  ])

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
  const readiness = computeReadinessScore(scoreInputs, weightInputs)

  // Build weight map
  const weightMap = new Map(roleWeights.map((rw) => [rw.categoryId, rw.weight]))

  // Group skills by category
  type SkillData = {
    name: string
    evidenceScore: number
    assignmentScore: number
    learningScore: number
    totalScore: number
  }
  type CategoryData = {
    id: string
    name: string
    slug: string
    score: number
    weight: number
    explanation: string
    skills: SkillData[]
  }

  const categoryMap = new Map<string, CategoryData>()
  for (const ss of skillScores) {
    const cat = ss.skill.category
    if (!categoryMap.has(cat.id)) {
      const catScore = readiness.byCategory[cat.id] ?? 0
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        score: Math.round(catScore),
        weight: weightMap.get(cat.id) ?? 0,
        explanation: getGapExplanation(pmTarget?.targetRoleType ?? null, cat.slug),
        skills: [],
      })
    }
    categoryMap.get(cat.id)!.skills.push({
      name: ss.skill.name,
      evidenceScore: Math.round(ss.evidenceScore),
      assignmentScore: Math.round(ss.assignmentScore),
      learningScore: Math.round(ss.learningScore),
      totalScore: Math.round(ss.totalScore),
    })
  }

  // Sort categories by weight descending (most important first)
  const categories = [...categoryMap.values()].sort((a, b) => b.weight - a.weight)
  // Sort skills within each category by totalScore descending
  for (const cat of categories) {
    cat.skills.sort((a, b) => b.totalScore - a.totalScore)
  }

  const roleLabel = pmTarget?.targetRoleType
    ? pmTarget.targetRoleType.charAt(0).toUpperCase() + pmTarget.targetRoleType.slice(1) + " PM"
    : null

  const hasScores = skillScores.length > 0

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">Skill Analysis</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Detailed breakdown of your PM readiness across all skill areas.
          {roleLabel && <> Weighted for <span className="font-medium text-[var(--color-on-surface)]">{roleLabel}</span> roles.</>}
        </p>
      </div>

      {!hasScores ? (
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-10 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Complete onboarding to see your skill analysis.
          </p>
          <Link href="/onboarding/upload" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            Start onboarding →
          </Link>
        </div>
      ) : (
        <>
          {/* Overall Score Card */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)] flex items-center gap-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-surface-container)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={readiness.overall >= 70 ? "var(--color-secondary-fixed)" : "var(--color-primary)"}
                  strokeWidth="3"
                  strokeDasharray={`${readiness.overall} ${100 - readiness.overall}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--color-on-surface)]">
                {readiness.overall}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--color-on-surface)]">Overall Readiness</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                {readiness.overall >= 70
                  ? "Strong foundation — focus on polishing weak areas."
                  : readiness.overall >= 40
                    ? "Building momentum — keep working through your learning path."
                    : "Early stage — the learning path will help you build up quickly."}
              </p>
            </div>
          </div>

          {/* Score Legend */}
          <div className="flex items-center gap-6 text-xs text-[var(--color-on-surface-variant)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
              Evidence (50%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#6366f1" }} />
              Assignments (30%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8b5cf6" }} />
              Learning (20%)
            </span>
          </div>

          {/* Category Sections */}
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-[var(--shadow-ambient)] overflow-hidden">
              {/* Category Header */}
              <div className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-base font-semibold text-[var(--color-on-surface)]">{cat.name}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreBadgeClass(cat.score)}`}>
                      {cat.score}%
                    </span>
                    {cat.weight > 0 && (
                      <span className="text-xs text-[var(--color-on-surface-variant)]">
                        {Math.round(cat.weight * 100)}% weight
                      </span>
                    )}
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--color-surface-container)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(cat.score, 100)}%`, backgroundColor: scoreColor(cat.score) }}
                    />
                  </div>
                </div>
              </div>

              {/* Gap Explanation */}
              {cat.explanation && (
                <p className="px-5 pb-3 text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                  {cat.explanation}
                </p>
              )}

              {/* Individual Skills */}
              <div className="border-t border-[var(--color-surface-container-low)]">
                {cat.skills.map((skill) => {
                  const total = Math.round(0.5 * skill.evidenceScore + 0.3 * skill.assignmentScore + 0.2 * skill.learningScore)
                  return (
                    <div key={skill.name} className="px-5 py-3 flex items-center gap-4 hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-[var(--color-on-surface)]">{skill.name}</span>
                          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">{total}%</span>
                        </div>
                        {/* Stacked sub-score bars */}
                        <div className="flex gap-1 h-1.5">
                          <div className="flex-1 rounded-full bg-[var(--color-surface-container)] overflow-hidden" title={`Evidence: ${skill.evidenceScore}%`}>
                            <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${skill.evidenceScore}%` }} />
                          </div>
                          <div className="flex-1 rounded-full bg-[var(--color-surface-container)] overflow-hidden" title={`Assignment: ${skill.assignmentScore}%`}>
                            <div className="h-full rounded-full bg-[#6366f1]" style={{ width: `${skill.assignmentScore}%` }} />
                          </div>
                          <div className="flex-1 rounded-full bg-[var(--color-surface-container)] overflow-hidden" title={`Learning: ${skill.learningScore}%`}>
                            <div className="h-full rounded-full bg-[#8b5cf6]" style={{ width: `${skill.learningScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
