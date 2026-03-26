import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { calculateCategoryScores } from "@/lib/scores"
import { ImpactHighlights } from "@/components/profile/impact-highlights"

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
            orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
            take: 8,
            include: { workExperience: { select: { company: true, title: true } } },
          },
          workExperiences: {
            orderBy: { startDate: "desc" },
            take: 5,
          },
          streak: true,
          learningProgress: {
            where: { status: "completed" },
          },
          userSkillScores: {
            include: { skill: { include: { category: true } } },
          },
          questionAttempts: { select: { id: true } },
          assignmentSubmissions: { where: { passed: true }, select: { id: true } },
          education: {
            where: { isVisible: true },
            orderBy: { endDate: "desc" },
          },
          projects: {
            where: { isVisible: true },
            orderBy: { sortOrder: "asc" },
          },
          certifications: {
            where: { isVisible: true },
            orderBy: { sortOrder: "asc" },
          },
          achievements: {
            where: { isVisible: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  })

  if (!profile || !profile.profileSlug) notFound()

  const { user } = profile
  const settings = user.profileSettings

  // Category scores
  const categoryScoreMap: Record<string, { name: string; score: number }> = {}
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
    const rawScores = calculateCategoryScores(skillScores, skills)
    for (const ss of user.userSkillScores) {
      const catId = ss.skill.categoryId
      if (rawScores[catId] && !categoryScoreMap[catId]) {
        categoryScoreMap[catId] = { name: ss.skill.category.name, score: rawScores[catId] }
      }
    }
  }
  const categoryScores = Object.values(categoryScoreMap).sort((a, b) => b.score - a.score)

  // Top PM skills (individual skills with highest totalScore)
  const topSkills = [...user.userSkillScores]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 6)

  const stagesCompleted = user.learningProgress.length
  const questionsAnswered = user.questionAttempts.length
  const assignmentsPassed = user.assignmentSubmissions.length
  const streak = user.streak
  const displayName = profile.fullName ?? user.name ?? "Loomis Member"
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
  const imageUrl = profile.profileImageUrl ?? user.image

  const hasLinks = profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Nav */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-16 max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">

          {/* ──── Hero Section ──── */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 md:p-10 shadow-[var(--shadow-ambient)]">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 overflow-hidden shadow-lg">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-[var(--color-on-surface)] leading-tight tracking-tight">
                  {displayName}
                </h1>
                {profile.currentJobRole && (
                  <p className="text-base text-[var(--color-on-surface-variant)] mt-1 font-medium">
                    {profile.currentJobRole}
                    {profile.yearsExperience ? ` · ${profile.yearsExperience}+ years experience` : ""}
                  </p>
                )}
                {profile.location && (
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">{profile.location}</p>
                )}

                {/* Connect Links */}
                {hasLinks && (
                  <div className="flex items-center gap-3 mt-4">
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/8 px-3 py-1.5 rounded-full hover:bg-[var(--color-primary)]/15 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    )}
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] px-3 py-1.5 rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] px-3 py-1.5 rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/></svg>
                        Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {profile.bio && (
              <p className="mt-6 text-sm text-[var(--color-on-surface-variant)] leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-[var(--color-surface-container-low)]">
              {profile.yearsExperience != null && profile.yearsExperience > 0 && (
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)]">{profile.yearsExperience}+</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Years Exp.</p>
                </div>
              )}
              {stagesCompleted > 0 && settings?.showAssignments && (
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)]">{stagesCompleted}/12</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Stages Done</p>
                </div>
              )}
              {assignmentsPassed > 0 && settings?.showAssignments && (
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)]">{assignmentsPassed}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Assignments Passed</p>
                </div>
              )}
              {questionsAnswered > 0 && (
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)]">{questionsAnswered}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Questions Practiced</p>
                </div>
              )}
              {settings?.showStreak && streak && streak.currentStreak > 0 && (
                <div>
                  <p className="text-2xl font-bold text-[var(--color-on-surface)]">{streak.currentStreak}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Day Streak</p>
                </div>
              )}
            </div>
          </div>

          {/* ──── Two-column grid ──── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">

            {/* Left column — skills */}
            <div className="md:col-span-2 space-y-6">

              {/* PM Skill Areas */}
              {settings?.showReadinessScore && categoryScores.length > 0 && (
                <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-5">PM Skill Areas</h2>
                  <div className="space-y-4">
                    {categoryScores.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-[var(--color-on-surface)]">{cat.name}</span>
                          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">{cat.score}%</span>
                        </div>
                        <div className="h-2 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(cat.score, 100)}%`,
                              backgroundColor: cat.score >= 60 ? "var(--color-primary)" : cat.score >= 30 ? "#f59e0b" : "var(--color-surface-container)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Skills Tags */}
              {settings?.showReadinessScore && topSkills.length > 0 && (
                <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">Top Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((ss) => (
                      <span
                        key={ss.id}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)]/8 text-[var(--color-primary)]"
                      >
                        {ss.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Progress */}
              {settings?.showAssignments && stagesCompleted > 0 && (
                <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 shadow-[var(--shadow-ambient)]">
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">Learning Progress</h2>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black text-[var(--color-primary)]">{stagesCompleted}</div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">
                        {stagesCompleted === 1 ? "Stage" : "Stages"} completed
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">of 12 in the PM learning path</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full"
                      style={{ width: `${Math.round((stagesCompleted / 12) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right column — impact stories + experience */}
            <div className="md:col-span-3 space-y-6">

              {/* Impact Highlights (PSI) */}
              {settings?.showPsiEntries && user.psiEntries.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                    Impact Highlights
                  </h2>
                  <ImpactHighlights entries={user.psiEntries.map((e) => ({
                    id: e.id,
                    problem: e.problem,
                    solution: e.solution,
                    impact: e.impact,
                    workExperience: e.workExperience,
                  }))} />
                </div>
              )}

              {/* Work Experience */}
              {(settings?.showWorkExperience !== false) && user.workExperiences.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                    Experience
                  </h2>
                  <div className="space-y-3">
                    {user.workExperiences.map((wx) => (
                      <div
                        key={wx.id}
                        className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{wx.title}</p>
                            <p className="text-sm text-[var(--color-on-surface-variant)]">{wx.company}</p>
                          </div>
                          <p className="text-xs text-[var(--color-on-surface-variant)] flex-shrink-0">
                            {wx.startDate ? new Date(wx.startDate).getFullYear() : ""}
                            {" — "}
                            {wx.isCurrent ? "Present" : wx.endDate ? new Date(wx.endDate).getFullYear() : ""}
                          </p>
                        </div>
                        {wx.description && (
                          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2 leading-relaxed line-clamp-3">
                            {wx.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Projects */}
              {(settings?.showProjects !== false) && user.projects.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {user.projects.map((p) => (
                      <div key={p.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{p.title}</p>
                            {p.isFromAssignment && (
                              <span className="text-xs text-[var(--color-primary)] font-medium">Case Study</span>
                            )}
                          </div>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-primary)] hover:underline flex-shrink-0">
                              View →
                            </a>
                          )}
                        </div>
                        {p.description && (
                          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2 leading-relaxed line-clamp-3">{p.description}</p>
                        )}
                        {p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {p.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/8 text-[var(--color-primary)]">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {(settings?.showEducation !== false) && user.education.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {user.education.map((ed) => (
                      <div key={ed.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)]">
                        <p className="text-sm font-semibold text-[var(--color-on-surface)]">{ed.school}</p>
                        <p className="text-sm text-[var(--color-on-surface-variant)]">
                          {[ed.degree, ed.fieldOfStudy].filter(Boolean).join(" in ")}
                          {ed.gpa && <span> · GPA: {ed.gpa}</span>}
                        </p>
                        {ed.startDate && (
                          <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                            {new Date(ed.startDate).getFullYear()} — {ed.endDate ? new Date(ed.endDate).getFullYear() : "Present"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {(settings?.showCertifications !== false) && user.certifications.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                    Certifications
                  </h2>
                  <div className="space-y-3">
                    {user.certifications.map((c) => (
                      <div key={c.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)] flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-on-surface)]">{c.name}</p>
                          {c.issuer && <p className="text-sm text-[var(--color-on-surface-variant)]">{c.issuer}</p>}
                          {c.issueDate && (
                            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                              Issued {new Date(c.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        {c.credentialUrl && (
                          <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-primary)] hover:underline flex-shrink-0">
                            Verify →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {(settings?.showAchievements !== false) && user.achievements.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-4">
                    Achievements
                  </h2>
                  <div className="space-y-3">
                    {user.achievements.map((a) => (
                      <div key={a.id} className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 shadow-[var(--shadow-ambient)]">
                        <p className="text-sm font-semibold text-[var(--color-on-surface)]">{a.title}</p>
                        {a.description && (
                          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">{a.description}</p>
                        )}
                        {a.date && (
                          <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                            {new Date(a.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ──── CTA ──── */}
          <div className="text-center py-12 mt-6">
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
              Build your PM career profile on Loomis.
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
