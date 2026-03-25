"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Register the account
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    // Auto sign-in after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Account created but sign-in failed. Please log in.")
      router.push("/login")
      return
    }

    router.push("/onboarding/upload")
    router.refresh()
  }

  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Start your PM career journey today
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
            or sign up with email
          </span>
        </div>
      </div>

      {/* Registration form */}
      <form onSubmit={handleSignUp} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-on-surface-variant)]">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Sharma"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface)] text-[var(--color-on-surface)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
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
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--color-on-surface-variant)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          Log in
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
