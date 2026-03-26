import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOnboardingRedirect } from "@/lib/onboarding"
import { ProfileForm } from "@/components/onboarding/profile-form"

export default async function OnboardingProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const [profile, recentExp] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      select: { onboardingStep: true, fullName: true, currentJobRole: true, yearsExperience: true, currentIndustry: true },
    }),
    prisma.workExperience.findFirst({
      where: { userId, isCurrent: true },
      select: { title: true },
      orderBy: { startDate: "desc" },
    }),
  ])

  if (!profile || profile.onboardingStep < 1) redirect("/onboarding/upload")
  if (profile.onboardingStep > 2) redirect(await getOnboardingRedirect(userId))

  // Infer recommended PM role from industry
  const industry = profile.currentIndustry ?? ""
  const recommendedRole = (() => {
    if (/tech|software|saas|startup/i.test(industry)) return "technical"
    if (/finance|fintech|banking/i.test(industry)) return "b2b"
    if (/health|medical|pharma/i.test(industry)) return "b2b"
    if (/ecom|retail|consumer/i.test(industry)) return "consumer"
    if (/media|entertain/i.test(industry)) return "consumer"
    if (/consult/i.test(industry)) return "b2b"
    return "consumer"
  })()

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-[var(--color-on-surface)] tracking-tight">
            Tell us about yourself
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-base leading-relaxed">
            This helps us calibrate your skill gaps against the right PM role type and timeline.
          </p>
        </div>

        <ProfileForm
          defaultName={profile.fullName ?? undefined}
          defaultJobRole={recentExp?.title ?? profile.currentJobRole ?? undefined}
          defaultYearsExperience={profile.yearsExperience ?? undefined}
          recommendedRole={recommendedRole}
        />
      </div>
    </div>
  )
}
