import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MasterProfileSections } from "@/components/master-profile/master-profile-sections"

export default async function MasterProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const [workExperiences, education, projects, certifications, achievements] = await Promise.all([
    prisma.workExperience.findMany({ where: { userId }, orderBy: { startDate: "desc" } }),
    prisma.education.findMany({ where: { userId }, orderBy: [{ endDate: "desc" }] }),
    prisma.project.findMany({ where: { userId }, orderBy: { sortOrder: "asc" } }),
    prisma.certification.findMany({ where: { userId }, orderBy: { sortOrder: "asc" } }),
    prisma.achievement.findMany({ where: { userId }, orderBy: { sortOrder: "asc" } }),
  ])

  // Serialize dates to ISO strings for client components
  const serialize = <T extends Record<string, unknown>>(items: T[]) =>
    items.map((item) => {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(item)) {
        result[key] = value instanceof Date ? value.toISOString() : value
      }
      return result
    })

  return (
    <div className="max-w-3xl space-y-2">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">Master Profile</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Your complete professional profile. Add everything about your career — control what&apos;s visible on your public profile.
        </p>
      </div>

      <MasterProfileSections
        workExperiences={serialize(workExperiences) as never[]}
        education={serialize(education) as never[]}
        projects={serialize(projects) as never[]}
        certifications={serialize(certifications) as never[]}
        achievements={serialize(achievements) as never[]}
      />
    </div>
  )
}
