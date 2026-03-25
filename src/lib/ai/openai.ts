import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function gptChat(
  systemPrompt: string,
  userMessage: string,
  opts?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: opts?.model ?? "gpt-4o-mini",
    max_tokens: opts?.maxTokens ?? 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  })
  return response.choices[0].message.content ?? ""
}
