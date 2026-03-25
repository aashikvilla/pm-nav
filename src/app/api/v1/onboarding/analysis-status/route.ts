export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  void req
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { analysisStatus: true, onboardingStep: true },
  })

  if (!profile) {
    return NextResponse.json({ status: "pending" })
  }

  return NextResponse.json({
    status: profile.analysisStatus,
    onboardingStep: profile.onboardingStep,
  })
}
