export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const createSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().optional(),
  issueDate: z.coerce.date().optional(),
  expirationDate: z.coerce.date().optional(),
  credentialUrl: z.union([z.string().url(), z.literal("")]).optional(),
  isVisible: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const certifications = await prisma.certification.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(certifications)
  } catch (error) {
    logger.error("Failed to list certifications", { error })
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

    const certification = await prisma.certification.create({
      data: {
        ...data,
        userId: session.user.id,
        credentialUrl: data.credentialUrl || null,
      },
    })
    return NextResponse.json(certification, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to create certification", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
