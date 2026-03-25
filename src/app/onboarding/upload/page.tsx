import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOnboardingRedirect } from "@/lib/onboarding"
import { ResumeUploadZone } from "@/components/onboarding/resume-upload-zone"

export default async function OnboardingUploadPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { onboardingStep: true },
  })

  if (profile && profile.onboardingStep > 1) {
    redirect(await getOnboardingRedirect(userId))
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-[var(--color-on-surface)] tracking-tight">
            Let&apos;s start with your resume
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-base leading-relaxed max-w-lg">
            We&apos;ll extract your work experience and identify where your skills already map to PM roles — no
            guesswork.
          </p>
        </div>

        <ResumeUploadZone />

        <p className="text-xs text-center text-[var(--color-on-surface-variant)]">
          Your resume is processed securely and never shared. We only extract relevant experience signals.
        </p>
      </div>
    </div>
  )
}
