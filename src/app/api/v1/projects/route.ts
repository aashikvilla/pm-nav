export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.union([z.string().url(), z.literal("")]).optional(),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isFromAssignment: z.boolean().optional(),
  assignmentSubmissionId: z.string().optional(),
  isVisible: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(projects)
  } catch (error) {
    logger.error("Failed to list projects", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...data,
        userId: session.user.id,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to create project", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
