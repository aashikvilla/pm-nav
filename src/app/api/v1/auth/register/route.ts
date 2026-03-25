import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, password } = body ?? {}

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: { name, email },
  })

  // Store password hash in the credentials account record
  await prisma.account.create({
    data: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
      access_token: hash, // repurpose access_token to store hash
    },
  })

  // Create profile + streak
  await prisma.profile.create({
    data: { userId: user.id, onboardingStep: 0, onboardingCompleted: false },
  })
  await prisma.userStreak.create({ data: { userId: user.id } })

  return NextResponse.json({ success: true }, { status: 201 })
}
