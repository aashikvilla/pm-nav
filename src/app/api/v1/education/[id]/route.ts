export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const updateEducationSchema = z.object({
  school: z.string().min(1).optional(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const body = await req.json()
    const data = updateEducationSchema.parse(body)

    const education = await prisma.education.updateMany({
      where: { id, userId: session.user.id },
      data,
    })

    if (education.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const updated = await prisma.education.findUnique({ where: { id } })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to update education", { error, userId: session.user.id, id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const result = await prisma.education.deleteMany({
      where: { id, userId: session.user.id },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logger.error("Failed to delete education", { error, userId: session.user.id, id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
