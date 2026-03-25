import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PsiEntriesList } from "@/components/dashboard/psi-entries-list";
import type { PsiEntryWithSkills } from "@/components/dashboard/psi-entry-card";

async function getPsiEntries(): Promise<PsiEntryWithSkills[]> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/v1/psi`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function PsiPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const entries = await getPsiEntries();

  return (
    <div className="max-w-3xl mx-auto">
      <PsiEntriesList initialEntries={entries} />
    </div>
  );
}
