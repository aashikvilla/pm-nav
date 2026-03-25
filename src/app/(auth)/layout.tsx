import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Authentication | Loomis",
  description: "Sign in to access your skills dashboard and learning path.",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-surface)] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-[var(--color-primary)]">
            Loomis
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
