import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOnboardingRedirect } from "@/lib/onboarding"
import { ProfileForm } from "@/components/onboarding/profile-form"

export default async function OnboardingProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { onboardingStep: true, fullName: true },
  })

  if (!profile || profile.onboardingStep < 1) redirect("/onboarding/upload")
  if (profile.onboardingStep > 2) redirect(await getOnboardingRedirect(userId))

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

        <ProfileForm defaultName={profile.fullName ?? undefined} />
      </div>
    </div>
  )
}
