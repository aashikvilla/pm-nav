import { prisma } from "@/lib/prisma"

export async function getOnboardingRedirect(userId: string): Promise<string> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { onboardingStep: true, onboardingCompleted: true },
  })

  if (!profile || profile.onboardingStep === 0) return "/onboarding/upload"
  if (profile.onboardingStep === 1) return "/onboarding/profile"
  if (profile.onboardingStep === 2) return "/onboarding/analyzing"
  if (profile.onboardingStep === 3) return "/onboarding/conversation"
  if (profile.onboardingStep === 4) return "/onboarding/summary"
  return "/dashboard"
}
