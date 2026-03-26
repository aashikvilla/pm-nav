export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const createSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional(),
  rawBullets: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiences = await prisma.workExperience.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(
      experiences.map((e) => ({
        id: e.id,
        company: e.company,
        title: e.title,
        startDate: e.startDate?.toISOString() ?? null,
        endDate: e.endDate?.toISOString() ?? null,
        isCurrent: e.isCurrent,
        description: e.description,
        rawBullets: e.rawBullets,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    logger.error("Failed to list work experiences", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { company, title, startDate, endDate, isCurrent, description, rawBullets } = parsed.data;

    const experience = await prisma.workExperience.create({
      data: {
        userId: session.user.id,
        company,
        title,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        isCurrent: isCurrent ?? false,
        description: description ?? null,
        rawBullets: rawBullets ?? [],
      },
    });

    return NextResponse.json(
      {
        id: experience.id,
        company: experience.company,
        title: experience.title,
        startDate: experience.startDate?.toISOString() ?? null,
        endDate: experience.endDate?.toISOString() ?? null,
        isCurrent: experience.isCurrent,
        description: experience.description,
        rawBullets: experience.rawBullets,
        createdAt: experience.createdAt.toISOString(),
        updatedAt: experience.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Failed to create work experience", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
