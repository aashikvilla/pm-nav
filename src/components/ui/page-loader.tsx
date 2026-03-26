"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-surface)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary-fixed)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-primary)] animate-spin" />
        </div>
      </div>
    </div>
  )
}

export function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary-fixed)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-primary)] animate-spin" />
        </div>
        {message && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">{message}</p>
        )}
      </div>
    </div>
  )
}
