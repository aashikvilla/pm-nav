import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getOwnedEntry(userId: string, id: string) {
  return prisma.psiEntry.findUnique({ where: { id } }).then((entry) => {
    if (!entry) return { entry: null, error: "not_found" as const };
    if (entry.userId !== userId) return { entry: null, error: "forbidden" as const };
    return { entry, error: null };
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { entry, error } = await getOwnedEntry(session.user.id, id);
  if (error === "not_found") return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (error === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { problem, solution, impact } = body ?? {};

  const errors: Record<string, string> = {};
  if (!problem?.trim()) errors.problem = "Problem is required";
  if (!solution?.trim()) errors.solution = "Solution is required";
  if (!impact?.trim()) errors.impact = "Impact is required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  const updated = await prisma.psiEntry.update({
    where: { id: entry!.id },
    data: {
      problem: problem.trim(),
      solution: solution.trim(),
      impact: impact.trim(),
    },
    include: {
      skillMappings: {
        include: { skill: { include: { category: true } } },
      },
    },
  });

  return NextResponse.json({
    id: updated.id,
    problem: updated.problem,
    solution: updated.solution,
    impact: updated.impact,
    isVisible: updated.isVisible,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    skillMappings: updated.skillMappings.map((m) => ({
      skillId: m.skillId,
      skillName: m.skill.name,
      categoryName: m.skill.category.name,
      evidenceScore: m.evidenceScore,
    })),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { entry, error } = await getOwnedEntry(session.user.id, id);
  if (error === "not_found") return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (error === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.psiEntry.update({
    where: { id: entry!.id },
    data: { isVisible: false },
  });

  return new NextResponse(null, { status: 204 });
}
