import { gptChat } from "@/lib/ai/openai"

interface ResumeOptimizeInput {
  psiEntries: { problem: string; solution: string; impact: string }[]
  targetRole: string
  targetCompany?: string
  jobDescription: string
  jdKeywords: string[]
}

interface ResumeOptimizeResult {
  bullets: { original: string; optimized: string; keywords: string[] }[]
  summary: string
  atsScore: number
  keywordMatch: { matched: string[]; missing: string[] }
}

const SYSTEM_PROMPT = `You are a resume optimization expert specializing in PM roles.
Transform PSI entries into ATS-optimized resume bullets. Use PM vocabulary. Quantify impact.
Return ONLY valid JSON.`

export async function optimizeResume(input: ResumeOptimizeInput): Promise<ResumeOptimizeResult> {
  const psiText = input.psiEntries
    .slice(0, 8)
    .map((e, i) => `Entry ${i + 1}: P:${e.problem} | S:${e.solution} | I:${e.impact}`)
    .join("\n")

  const prompt = `Optimize for ${input.targetRole} PM role${input.targetCompany ? ` at ${input.targetCompany}` : ""}.

JD keywords to target: ${input.jdKeywords.join(", ")}
JD excerpt: ${input.jobDescription.slice(0, 500)}

PSI Entries:
${psiText}

Return JSON: {"bullets":[{"original":string,"optimized":string,"keywords":string[]}],"summary":string,"atsScore":number,"keywordMatch":{"matched":string[],"missing":string[]}}`

  const response = await gptChat(SYSTEM_PROMPT, prompt, { maxTokens: 4096 })
  try {
    return JSON.parse(response) as ResumeOptimizeResult
  } catch {
    throw new Error("Failed to parse resume optimize JSON")
  }
}
