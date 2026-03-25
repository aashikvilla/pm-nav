import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.psiEntry.findMany({
    where: { userId: session.user.id, isVisible: true },
    orderBy: { createdAt: "desc" },
    include: {
      skillMappings: {
        include: {
          skill: { include: { category: true } },
        },
      },
    },
  });

  return NextResponse.json(
    entries.map((e) => ({
      id: e.id,
      problem: e.problem,
      solution: e.solution,
      impact: e.impact,
      isVisible: e.isVisible,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
      skillMappings: e.skillMappings.map((m) => ({
        skillId: m.skillId,
        skillName: m.skill.name,
        categoryName: m.skill.category.name,
        evidenceScore: m.evidenceScore,
      })),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { problem, solution, impact } = body ?? {};

  const errors: Record<string, string> = {};
  if (!problem?.trim()) errors.problem = "Problem is required";
  if (!solution?.trim()) errors.solution = "Solution is required";
  if (!impact?.trim()) errors.impact = "Impact is required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  const entry = await prisma.psiEntry.create({
    data: {
      userId: session.user.id,
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

  return NextResponse.json(
    {
      id: entry.id,
      problem: entry.problem,
      solution: entry.solution,
      impact: entry.impact,
      isVisible: entry.isVisible,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      skillMappings: [],
    },
    { status: 201 }
  );
}
