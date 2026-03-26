export const runtime = "nodejs"
export const maxDuration = 60

import { NextRequest, NextResponse } from "next/server"
import { extractText, getDocumentProxy } from "unpdf"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseResume } from "@/lib/ai/agents/resume-parser"
import { recordActivity } from "@/lib/streak"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = session.user.id

  try {
    let resumeText = ""

    const contentType = req.headers.get("content-type") ?? ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file") as File | null
      const text = formData.get("text") as string | null

      if (text) {
        resumeText = text
      } else if (file) {
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
        }
        const validTypes = ["application/pdf", "text/plain"]
        if (!validTypes.includes(file.type) && !file.name.endsWith(".txt") && !file.name.endsWith(".pdf")) {
          return NextResponse.json({ error: "Only PDF and text files are supported" }, { status: 400 })
        }

        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          resumeText = await file.text()
        } else {
          // PDF parsing
          const buffer = new Uint8Array(await file.arrayBuffer())
          const pdf = await getDocumentProxy(buffer)
          const { text } = await extractText(pdf, { mergePages: true })
          resumeText = text
        }
      } else {
        return NextResponse.json({ error: "No file or text provided" }, { status: 400 })
      }
    } else {
      const body = await req.json()
      resumeText = body.text ?? ""
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ error: "Resume text is empty" }, { status: 400 })
    }

    logger.info("Parsing resume", { userId, textLength: resumeText.length })

    const parsed = await parseResume(resumeText)

    // Upsert profile with any extracted name/contact info
    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: parsed.fullName || null,
        linkedinUrl: parsed.linkedinUrl || null,
        onboardingStep: 1,
      },
      update: {
        fullName: parsed.fullName || undefined,
        linkedinUrl: parsed.linkedinUrl || undefined,
        onboardingStep: 1,
      },
    })

    // Clear previous work experiences
    await prisma.workExperience.deleteMany({ where: { userId } })

    // Store work experiences
    const workExps = parsed.workExperiences.filter((w) => w.company || w.title)
    if (workExps.length > 0) {
      await prisma.workExperience.createMany({
        data: workExps.map((w) => ({
          userId,
          company: w.company || "Unknown",
          title: w.title || "Unknown",
          startDate: w.startDate ? new Date(w.startDate + "-01") : null,
          endDate: w.endDate ? new Date(w.endDate + "-01") : null,
          isCurrent: w.isCurrent,
          description: w.description || null,
          rawBullets: w.bullets,
        })),
      })
    }

    await recordActivity(userId, "resume_uploaded")

    logger.info("Resume parsed successfully", { userId, experienceCount: workExps.length })

    return NextResponse.json({
      success: true,
      experienceCount: workExps.length,
      parsedName: parsed.fullName,
    })
  } catch (error) {
    logger.error("Failed to parse resume", { userId, error: JSON.stringify(error) })
    return NextResponse.json({ error: "Failed to parse resume. Please try again." }, { status: 500 })
  }
}
