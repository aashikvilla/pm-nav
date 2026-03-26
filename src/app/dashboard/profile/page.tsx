import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const [profile, settings] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.publicProfileSettings.findUnique({ where: { userId } }),
  ])

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">Edit Profile</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Update your public-facing profile and control what others can see.
        </p>
      </div>

      <ProfileForm
        initialProfile={
          profile
            ? {
                fullName: profile.fullName,
                bio: profile.bio,
                linkedinUrl: profile.linkedinUrl,
                githubUrl: profile.githubUrl,
                portfolioUrl: profile.portfolioUrl,
                profileImageUrl: profile.profileImageUrl,
                location: profile.location,
                currentJobRole: profile.currentJobRole,
                yearsExperience: profile.yearsExperience,
                profileSlug: profile.profileSlug,
              }
            : null
        }
        initialSettings={
          settings
            ? {
                showReadinessScore: settings.showReadinessScore,
                showPsiEntries: settings.showPsiEntries,
                showAssignments: settings.showAssignments,
                showActivityGraph: settings.showActivityGraph,
                showStreak: settings.showStreak,
              }
            : null
        }
      />
    </div>
  )
}
