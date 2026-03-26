export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  isVisible: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(achievements)
  } catch (error) {
    logger.error("Failed to list achievements", { error })
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

    const achievement = await prisma.achievement.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })
    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to create achievement", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
