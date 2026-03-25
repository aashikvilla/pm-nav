// Model: REASONING (nousresearch/hermes-3-llama-3.1-405b:free)
// Rationale: PSI reframing is the most nuanced task in the pipeline — it must
// interpret ambiguous work bullets through a PM lens, distinguish business/user
// problems from technical tasks, and write compelling problem-solution-impact
// narratives. Hermes 3 405B's fine-tuning for "advanced reasoning and roleplaying"
// makes it the strongest free model for this kind of domain-specific creative rewriting.
import { orChat, MODELS } from "@/lib/ai/openrouter"

interface WorkBullet {
  company: string
  title: string
  bullet: string
  context?: string
}

interface PsiResult {
  problem: string
  solution: string
  impact: string
  confidenceScore: number
  skillsHinted: string[]
}

const SYSTEM_PROMPT = `You are an expert PM career coach. Your job is to reframe work experiences into PM-relevant PSI (Problem → Solution → Impact) format.

Rules:
- Extract the ACTUAL problem being solved (user/business pain, not technical task)
- Describe the solution in terms of PRODUCT decisions, not just implementation
- Frame impact in terms of user/business outcomes with numbers where possible
- Confidence score 0-100: how strong is the PM signal in this bullet
- skillsHinted: list PM skill slugs from: product-thinking, user-research, data-analysis, prioritization, stakeholder-management, technical-acumen, execution, communication, business-acumen, leadership

Return ONLY valid JSON. No markdown.`

export async function reframeToPsi(bullet: WorkBullet): Promise<PsiResult> {
  const prompt = `Reframe this work experience into PSI format:

Company: ${bullet.company}
Role: ${bullet.title}
Experience: ${bullet.bullet}
${bullet.context ? `Additional context: ${bullet.context}` : ""}

Return JSON: {"problem":string,"solution":string,"impact":string,"confidenceScore":number,"skillsHinted":string[]}`

  const response = await orChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    model: MODELS.REASONING,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as PsiResult
  } catch {
    throw new Error("Failed to parse PSI JSON from AI response")
  }
}
