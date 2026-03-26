export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const APPLICATION_STATUSES = ["applied", "phone_screen", "interview", "rejected", "offer"] as const

const CreateSchema = z.object({
  companyName: z.string().min(1).max(200),
  roleTitle: z.string().max(200).optional(),
  status: z.enum(APPLICATION_STATUSES).default("applied"),
  notes: z.string().max(2000).optional(),
  appliedDate: z.string().datetime().optional(),
})

const UpdateSchema = z.object({
  id: z.string().cuid(),
  companyName: z.string().min(1).max(200).optional(),
  roleTitle: z.string().max(200).optional(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().max(2000).optional(),
})

const DeleteSchema = z.object({
  id: z.string().cuid(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const applications = await prisma.applicationTracker.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ applications })
  } catch (error) {
    logger.error("Failed to fetch applications", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = CreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { companyName, roleTitle, status, notes, appliedDate } = parsed.data

    const application = await prisma.applicationTracker.create({
      data: {
        userId,
        companyName,
        roleTitle: roleTitle || null,
        status,
        notes: notes || null,
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        statusUpdatedAt: new Date(),
      },
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    logger.error("Failed to create application", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...updates } = parsed.data

    // Verify ownership
    const existing = await prisma.applicationTracker.findFirst({ where: { id, userId } })
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (updates.companyName !== undefined) data.companyName = updates.companyName
    if (updates.roleTitle !== undefined) data.roleTitle = updates.roleTitle || null
    if (updates.notes !== undefined) data.notes = updates.notes || null
    if (updates.status !== undefined) {
      data.status = updates.status
      data.statusUpdatedAt = new Date()
    }

    const application = await prisma.applicationTracker.update({ where: { id }, data })

    return NextResponse.json({ application })
  } catch (error) {
    logger.error("Failed to update application", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    const body = await req.json()
    const parsed = DeleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { id } = parsed.data

    const existing = await prisma.applicationTracker.findFirst({ where: { id, userId } })
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    await prisma.applicationTracker.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Failed to delete application", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
