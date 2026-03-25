// Model: REASONING (nousresearch/hermes-3-llama-3.1-405b:free)
// Rationale: Assignment evaluation requires genuine PM domain expertise to score
// submissions against nuanced rubric criteria. A 70B model may miss subtle PM
// thinking patterns; the 405B Hermes model's depth gives it the judgment needed
// to provide accurate, actionable feedback that mirrors a senior PM hiring manager.
import { orChat, MODELS } from "@/lib/ai/openrouter"

interface EvaluationInput {
  assignmentTitle: string
  assignmentPrompt: string
  rubric: { criterion: string; points: number; description: string }[]
  submission: string
  maxScore: number
}

interface EvaluationResult {
  totalScore: number
  passed: boolean
  breakdown: { criterion: string; score: number; maxPoints: number; comment: string }[]
  overallFeedback: string
  strengthAreas: string[]
  improvementAreas: string[]
}

const SYSTEM_PROMPT = `You are a senior PM hiring manager evaluating a PM assignment submission.
Score honestly against the rubric. Be specific in feedback. Return ONLY valid JSON.`

export async function evaluateAssignment(input: EvaluationInput): Promise<EvaluationResult> {
  const rubricText = input.rubric
    .map((r) => `- ${r.criterion} (${r.points} pts): ${r.description}`)
    .join("\n")

  const prompt = `Assignment: ${input.assignmentTitle}
Prompt: ${input.assignmentPrompt}

Rubric (total ${input.maxScore} pts):
${rubricText}

Submission:
${input.submission}

Evaluate and return JSON: {
  "totalScore": number,
  "passed": boolean (score >= 60% of maxScore),
  "breakdown": [{"criterion":string,"score":number,"maxPoints":number,"comment":string}],
  "overallFeedback": string,
  "strengthAreas": string[],
  "improvementAreas": string[]
}`

  const response = await orChat(SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    model: MODELS.REASONING,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as EvaluationResult
  } catch {
    throw new Error("Failed to parse evaluation JSON from AI response: " + response)
  }
}
