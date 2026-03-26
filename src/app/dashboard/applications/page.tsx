import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApplicationBoard } from "@/components/applications/application-board"

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const userId = session.user.id

  const applications = await prisma.applicationTracker.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-on-surface)] tracking-tight">
          Application Tracker
        </h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Keep track of every role you apply to, from first contact to offer.
        </p>
      </div>

      <ApplicationBoard
        initialApplications={applications.map((a) => ({
          id: a.id,
          companyName: a.companyName,
          roleTitle: a.roleTitle,
          status: a.status as "applied" | "phone_screen" | "interview" | "rejected" | "offer",
          notes: a.notes,
          appliedDate: a.appliedDate.toISOString(),
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
