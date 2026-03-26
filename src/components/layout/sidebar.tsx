"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/dashboard/skills", label: "Skill Analysis", icon: "◆" },
  { href: "/dashboard/learning", label: "Learning Path", icon: "◎" },
  { href: "/dashboard/questions", label: "Questions", icon: "❓" },
  { href: "/dashboard/resume", label: "Resume Builder", icon: "◻" },
  { href: "/dashboard/applications", label: "Applications", icon: "◷" },
  { href: "/dashboard/master-profile", label: "Master Profile", icon: "◉" },
  { href: "/dashboard/profile", label: "Settings", icon: "◯" },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 min-h-screen bg-[var(--color-surface-container-low)] flex flex-col px-4 py-8">
      <div className="mb-8 px-3">
        <span className="text-[var(--color-primary)] font-semibold text-lg tracking-tight">pm·nav</span>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                active
                  ? "bg-[var(--color-primary-fixed)] text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-colors duration-200 w-full mt-4"
      >
        <span className="text-base">⏻</span>
        Sign out
      </button>
    </aside>
  )
}
