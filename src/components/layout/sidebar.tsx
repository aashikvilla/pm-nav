"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/dashboard/learning", label: "Learning Path", icon: "◎" },
  { href: "/dashboard/questions", label: "Questions", icon: "❓" },
  { href: "/dashboard/resume", label: "Resume Builder", icon: "◻" },
  { href: "/dashboard/applications", label: "Applications", icon: "◷" },
  { href: "/dashboard/profile", label: "Profile", icon: "◯" },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 min-h-screen bg-[var(--color-surface-container-low)] flex flex-col px-4 py-8 gap-1">
      <div className="mb-8 px-3">
        <span className="text-[var(--color-primary)] font-semibold text-lg tracking-tight">pm·nav</span>
      </div>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
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
    </aside>
  )
}
