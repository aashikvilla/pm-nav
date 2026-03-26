export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const updateSchema = z.object({
  company: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().nullable().optional(),
  rawBullets: z.array(z.string()).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.workExperience.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const experience = await prisma.workExperience.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
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
    });
  } catch (error) {
    logger.error("Failed to update work experience", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.workExperience.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.workExperience.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Failed to delete work experience", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
