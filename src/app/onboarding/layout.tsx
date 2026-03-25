import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { OnboardingProgress } from "@/components/onboarding/progress"

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col">
      <OnboardingProgress />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
