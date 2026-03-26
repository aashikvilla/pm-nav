// Model: stepfun/step-3.5-flash:free (primary) → deepseek/deepseek-chat-v3.1 (fallback)
// Rationale: Assignments can be long (1-2 pages). Step 3.5 Flash's 256K context handles
// full submissions + rubric comfortably. Ranks highly on academic/analytical tasks —
// ideal for rubric-based evaluation. Same provider split as gap-analyzer to maximize
// rate limit headroom (StepFun primary, DeepSeek fallback).
import { orChat } from "@/lib/ai/openrouter"

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

  const response = await orChat("assignmentEvaluator", SYSTEM_PROMPT, [{ role: "user", content: prompt }], {
    jsonMode: true,
  })

  try {
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonStr = jsonMatch ? jsonMatch[1] : response.trim()
    return JSON.parse(jsonStr) as EvaluationResult
  } catch {
    throw new Error("Failed to parse evaluation JSON from AI response: " + response)
  }
}
