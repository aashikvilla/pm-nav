import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { calculateCategoryScores } from "@/lib/scores"

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const profile = await prisma.profile.findUnique({
    where: { profileSlug: slug },
    include: {
      user: {
        include: {
          profileSettings: true,
          psiEntries: {
            where: { isVisible: true },
            orderBy: { isPinned: "desc" },
            take: 6,
          },
          streak: true,
          learningProgress: {
            where: { status: "completed" },
          },
          userSkillScores: {
            include: { skill: true },
          },
        },
      },
    },
  })

  // Profile must exist and have a slug set (slug presence = public intent)
  if (!profile || !profile.profileSlug) {
    notFound()
  }

  const { user } = profile
  const settings = user.profileSettings

  // Calculate skill category scores if needed
  let categoryScores: Record<string, number> = {}
  if (settings?.showReadinessScore && user.userSkillScores.length > 0) {
    const skillScores = user.userSkillScores.map((s) => ({
      skillId: s.skillId,
      evidenceScore: s.evidenceScore,
      assignmentScore: s.assignmentScore,
      learningScore: s.learningScore,
    }))
    const skills = user.userSkillScores.map((s) => ({
      id: s.skillId,
      categoryId: s.skill.categoryId,
    }))
    categoryScores = calculateCategoryScores(skillScores, skills)
  }

  const stagesCompleted = user.learningProgress.length
  const streak = user.streak

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Nav */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/20">
        <div className="flex items-center justify-between px-6 h-16 max-w-3xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
            Loomis
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[var(--color-primary)] text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hero */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-8 shadow-[var(--shadow-ambient)]">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {(profile.fullName ?? user.name ?? "?")[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[var(--color-on-surface)] leading-tight">
                  {profile.fullName ?? user.name ?? "Loomis Member"}
                </h1>
                {profile.currentJobRole && (
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{profile.currentJobRole}</p>
                )}
                {profile.location && (
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{profile.location}</p>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs text-[var(--color-primary)] hover:underline font-medium"
                  >
                    LinkedIn →
                  </a>
                )}
              </div>
            </div>
            {profile.bio && (
              <p className="mt-6 text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Streak */}
          {settings?.showStreak && streak && streak.currentStreak > 0 && (
            <div className="bg-[var(--color-secondary-fixed)] rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-on-surface)]">
                    {streak.currentStreak}-day streak
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    {streak.totalDaysActive} total days active · Longest: {streak.longestStreak} days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skill Scores */}
          {settings?.showReadinessScore && Object.keys(categoryScores).length > 0 && (
            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-5">Skill Readiness</h2>
              <div className="space-y-4">
                {Object.entries(categoryScores).map(([catId, score]) => (
                  <div key={catId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[var(--color-on-surface-variant)] capitalize">
                        {catId.replace(/-/g, " ")}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-on-surface)]">{score}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full"
                        style={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PSI Entries */}
          {settings?.showPsiEntries && user.psiEntries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[var(--color-on-surface)]">
                Impact Stories
              </h2>
              {user.psiEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]"
                >
                  <div className="space-y-3 text-sm text-[var(--color-on-surface)] leading-relaxed">
                    <p>
                      <span className="font-semibold text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
                        Problem
                      </span>
                      <br />
                      {entry.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
                        Solution
                      </span>
                      <br />
                      {entry.solution}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
                        Impact
                      </span>
                      <br />
                      {entry.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Learning Progress */}
          {settings?.showAssignments && stagesCompleted > 0 && (
            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
              <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-3">Learning Progress</h2>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-[var(--color-primary)]">{stagesCompleted}</div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">
                    {stagesCompleted === 1 ? "Stage" : "Stages"} completed
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">out of 12 in the learning path</p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${Math.round((stagesCompleted / 12) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center py-6">
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              Build your own PM career profile on Loomis.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started — Free
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
