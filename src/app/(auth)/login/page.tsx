"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid email or password")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Sign in to continue your PM journey
        </p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/30 rounded-full py-3 px-4 hover:bg-[var(--color-surface-container-low)] transition-colors font-medium text-[var(--color-on-surface)] disabled:opacity-50 mb-6"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-outline-variant)]/20" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)]">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Email / password */}
      <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-on-surface-variant)]">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface)] text-[var(--color-on-surface)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-on-surface-variant)]">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface)] text-[var(--color-on-surface)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] text-white font-semibold rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-on-surface-variant)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[var(--color-primary)] font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
