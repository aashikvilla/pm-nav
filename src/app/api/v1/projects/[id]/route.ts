export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  url: z.union([z.string().url(), z.literal("")]).optional(),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isFromAssignment: z.boolean().optional(),
  assignmentSubmissionId: z.string().optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const existing = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        url: data.url === "" ? null : data.url,
        imageUrl: data.imageUrl === "" ? null : data.imageUrl,
      },
    })
    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to update project", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const existing = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.project.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logger.error("Failed to delete project", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
