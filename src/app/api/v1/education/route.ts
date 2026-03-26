export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const createEducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
  isVisible: z.boolean().optional().default(true),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const education = await prisma.education.findMany({
      where: { userId: session.user.id },
      orderBy: { endDate: { sort: "desc", nulls: "first" } },
    })

    return NextResponse.json(education)
  } catch (error) {
    logger.error("Failed to list education", { error, userId: session.user.id })
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
    const data = createEducationSchema.parse(body)

    const education = await prisma.education.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to create education", { error, userId: session.user.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
