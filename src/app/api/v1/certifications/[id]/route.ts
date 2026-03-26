export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  issuer: z.string().optional(),
  issueDate: z.coerce.date().optional(),
  expirationDate: z.coerce.date().optional(),
  credentialUrl: z.union([z.string().url(), z.literal("")]).optional(),
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
    const existing = await prisma.certification.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        ...data,
        credentialUrl: data.credentialUrl === "" ? null : data.credentialUrl,
      },
    })
    return NextResponse.json(certification)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 })
    }
    logger.error("Failed to update certification", { error })
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
    const existing = await prisma.certification.findFirst({
      where: { id, userId: session.user.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.certification.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logger.error("Failed to delete certification", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
