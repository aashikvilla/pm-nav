// Model: meta-llama/llama-3.3-70b-instruct:free (primary) → openai/gpt-oss-120b (fallback)
// Rationale: Conversation agent talks directly to users — tone and warmth matter most.
// Llama 3.3 70B is the most community-tested conversational model with strong multilingual
// support (critical for our Indian user base). Full 70B dense model = more coherent than MoE
// for multi-turn dialogue. GPT-OSS 120B covers rate limits from a different provider.
import { orChat } from "@/lib/ai/openrouter"

export interface PsiSignal {
  problem: string
  solution: string
  impact: string
  skillsHinted: string[]
}

export interface WorkExperienceContext {
  companyName: string
  jobTitle: string
  startDate: string | null
  endDate: string | null
  description: string | null
}

export interface PsiEntryContext {
  problem: string
  solution: string
  impact: string
  confidenceScore: number | null
}

interface ConversationInput {
  userName: string
  currentRole: string
  targetRole: string
  topGaps: { categoryName: string; score: number }[]
  history: { role: "user" | "assistant"; content: string }[]
  userMessage: string
  workExperiences?: WorkExperienceContext[]
  existingPsiEntries?: PsiEntryContext[]
}

export interface ConversationOutput {
  reply: string
  isComplete: boolean
  newPsiSignals: PsiSignal[]
}

const BASE_SYSTEM_PROMPT = `You are a PM career coach having a focused conversation to surface hidden PM skills.

Your goals:
1. Ask ONE targeted question per turn about specific past experiences
2. Reference the candidate's actual resume experiences and job titles — be specific, not generic
3. Focus on the candidate's skill gaps — ask about situations that reveal PM instincts
4. Extract concrete PSI (Problem/Solution/Impact) signals from their answers
5. After 8-10 turns of productive conversation, conclude the session with a warm wrap-up

Rules:
- Be warm, specific, and encouraging — reference what they just said AND their actual work history
- Ask about their ACTUAL past experiences by name (e.g. "At Acme Corp, you mentioned X — tell me about...")
- Keep responses concise: 2-4 sentences acknowledging their answer + one follow-up question
- Do NOT ask hypotheticals — always ground questions in their real history
- After 8-10 exchanges, when you have enough PM signal, write a 1-sentence wrap-up and add exactly [COMPLETE] at the end

PSI extraction: When the user describes a PM-relevant experience, extract it.
After your conversational reply, on a new line output a PSI block ONLY if there's a new signal:
<psi>{"problem":"...","solution":"...","impact":"...","skillsHinted":["skill-slug-1","skill-slug-2"]}</psi>

Valid skill slugs: product-thinking, user-research, data-analysis, prioritization, stakeholder-management, technical-acumen, execution, communication, business-acumen, leadership`

export async function runConversationTurn(input: ConversationInput): Promise<ConversationOutput> {
  const gapList = input.topGaps
    .slice(0, 3)
    .map((g) => `${g.categoryName} (${g.score}/100)`)
    .join(", ")

  const workHistory =
    input.workExperiences && input.workExperiences.length > 0
      ? input.workExperiences
          .map((w) => {
            const tenure = [w.startDate, w.endDate ?? "present"].filter(Boolean).join(" – ")
            return `  • ${w.jobTitle} at ${w.companyName}${tenure ? ` (${tenure})` : ""}${w.description ? `: ${w.description.slice(0, 120)}` : ""}`
          })
          .join("\n")
      : "  (no work history available)"

  const psiContext =
    input.existingPsiEntries && input.existingPsiEntries.length > 0
      ? input.existingPsiEntries
          .slice(0, 4)
          .map(
            (p) =>
              `  • Problem: ${p.problem.slice(0, 80)} → Solution: ${p.solution.slice(0, 80)} (confidence: ${p.confidenceScore ?? "n/a"})`
          )
          .join("\n")
      : "  (none yet — surface new ones)"

  const systemPrompt = `${BASE_SYSTEM_PROMPT}

Candidate context:
- Name: ${input.userName}
- Current role: ${input.currentRole}
- Target: ${input.targetRole} PM
- Key skill gaps to explore: ${gapList || "unknown — use general PM questions"}

Work history (reference these specifically in your questions):
${workHistory}

PSI signals already captured (avoid re-asking about these):
${psiContext}`

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...input.history,
    { role: "user", content: input.userMessage },
  ]

  const response = await orChat("conversationAgent", systemPrompt, messages, { maxTokens: 400 })

  const isComplete = response.includes("[COMPLETE]")

  const newPsiSignals: PsiSignal[] = []
  const psiMatches = response.matchAll(/<psi>([\s\S]*?)<\/psi>/g)
  for (const match of psiMatches) {
    try {
      const jsonMatch = match[1].match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
      const jsonStr = jsonMatch ? jsonMatch[1] : match[1].trim()
      const signal = JSON.parse(jsonStr) as PsiSignal
      newPsiSignals.push(signal)
    } catch {
      // ignore malformed PSI
    }
  }

  const cleanReply = response
    .replace("[COMPLETE]", "")
    .replace(/<psi>[\s\S]*?<\/psi>/g, "")
    .trim()

  return { reply: cleanReply, isComplete, newPsiSignals }
}
