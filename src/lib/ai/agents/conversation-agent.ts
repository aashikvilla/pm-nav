// Model: STRUCTURED (meta-llama/llama-3.3-70b-instruct:free)
// Rationale: The gap-fill conversation is real-time (user is waiting). Llama 3.3
// 70B is explicitly optimised for "multilingual dialogue use cases" and is
// significantly faster than the 405B model — critical for interactive chat UX.
// It reliably follows the structured instruction format (PSI extraction tags,
// [COMPLETE] signal) while maintaining warm, coaching-style conversation.
import { orChat, MODELS } from "@/lib/ai/openrouter"

export interface PsiSignal {
  problem: string
  solution: string
  impact: string
  skillsHinted: string[]
}

interface ConversationInput {
  userName: string
  currentRole: string
  targetRole: string
  topGaps: { categoryName: string; score: number }[]
  history: { role: "user" | "assistant"; content: string }[]
  userMessage: string
}

export interface ConversationOutput {
  reply: string
  isComplete: boolean
  newPsiSignals: PsiSignal[]
}

const BASE_SYSTEM_PROMPT = `You are a PM career coach having a focused conversation to surface hidden PM skills.

Your goals:
1. Ask ONE targeted question per turn about specific past experiences
2. Focus on the candidate's skill gaps — ask about situations that reveal PM instincts
3. Extract concrete PSI (Problem/Solution/Impact) signals from their answers
4. After 6-8 turns of productive conversation, conclude the session

Rules:
- Be warm, specific, and encouraging — reference what they just said
- Ask about their ACTUAL past experiences, not hypotheticals
- Keep responses concise: 2-4 sentences acknowledging their answer + one follow-up question
- When you've gathered enough signals (6-8 exchanges), add exactly [COMPLETE] at the end of your final message

PSI extraction: When the user describes a PM-relevant experience, extract it.
After your conversational reply, on a new line output a PSI block ONLY if there's a new signal:
<psi>{"problem":"...","solution":"...","impact":"...","skillsHinted":["skill-slug-1","skill-slug-2"]}</psi>

Valid skill slugs: product-thinking, user-research, data-analysis, prioritization, stakeholder-management, technical-acumen, execution, communication, business-acumen, leadership`

export async function runConversationTurn(input: ConversationInput): Promise<ConversationOutput> {
  const gapList = input.topGaps
    .slice(0, 3)
    .map((g) => `${g.categoryName} (${g.score}/100)`)
    .join(", ")

  const systemPrompt = `${BASE_SYSTEM_PROMPT}

Candidate context:
- Name: ${input.userName}
- Current role: ${input.currentRole}
- Target: ${input.targetRole} PM
- Key skill gaps to explore: ${gapList || "unknown — use general PM questions"}`

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...input.history,
    { role: "user", content: input.userMessage },
  ]

  const response = await orChat(systemPrompt, messages, { model: MODELS.STRUCTURED })

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
