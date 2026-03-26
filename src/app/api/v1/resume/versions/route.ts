export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const versions = await prisma.resumeVersion.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        atsScore: true,
        keywordMatch: true,
        content: true,
        createdAt: true,
        jd: {
          select: { id: true, title: true, company: true },
        },
      },
    })

    return NextResponse.json({ versions })
  } catch (error) {
    logger.error("Failed to fetch resume versions", error)
    return NextResponse.json({ error: "Failed to fetch resume versions" }, { status: 500 })
  }
}
