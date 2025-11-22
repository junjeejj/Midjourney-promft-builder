import { API_ENDPOINTS } from "../config/constants";

export async function generatePromptFromSubject(subject: string, params?: any): Promise<string> {
  const res = await fetch(API_ENDPOINTS.GENERATE_PROMPT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, params })
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Failed to generate prompt: ${res.status} ${msg}`);
  }
  const data = await res.json();
  return data.prompt as string;
}

// 과거 호환
export const generateMidjourneyPrompt = generatePromptFromSubject;
