// api/generate-prompt.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Authorization: Bearer <JWT>
 * Supabase JWT 안에서 user id를 뽑아오는 간단한 헬퍼
 */
function getUserIdFromAuthHeader(req: VercelRequest): string | null {
  const authHeader =
    (req.headers.authorization as string | undefined) ??
    (req.headers.Authorization as string | undefined);

  if (!authHeader || typeof authHeader !== "string") return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme.toLowerCase() !== "bearer" || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);

    // supabase JWT 에서는 보통 sub / user_id 중 하나에 유저 id 가 들어 있음
    return payload.sub || payload.user_id || null;
  } catch {
    return null;
  }
}

// OpenAI 관련 상수
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
// 원하면 Vercel 환경 변수로 바꿀 수 있음 (OPENAI_MODEL 같은 이름으로)
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[generate-prompt] missing OPENAI_API_KEY");
      return res
        .status(500)
        .json({ error: "missing OPENAI_API_KEY", code: "MISSING_API_KEY" });
    }

    // 로그인 확인 (JWT만 간단히 체크)
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 프론트에서 보내는 payload 읽기
    const body: any = (req as any).body || {};

    // Subject 입력창 내용
    const subject: string = (body.subject ?? "").toString().trim();

    // 선택 요약(Selection Summary) 쪽에서 보내는 문자열들(있으면 사용, 없어도 동작)
    const selectionSummary: string = (body.selectionSummary ?? "").toString().trim();

    const previewPrompt: string = (body.previewPrompt ?? "").toString().trim();

    if (!subject) {
      return res.status(400).json({ error: "subject_required" });
    }

    // OpenAI에 보낼 메시지 구성
    const userLines: string[] = [];

    userLines.push(`Subject: ${subject}`);

    if (selectionSummary) {
      userLines.push(`Selected parameters: ${selectionSummary}`);
    }

    if (previewPrompt) {
      userLines.push(
        `Current base prompt (you may improve on this): ${previewPrompt}`
      );
    }

    const messages = [
      {
        role: "system" as const,
        content:
          "You are an expert Midjourney prompt engineer. " +
          "User will give you a subject (in Korean or English) and some parameters. " +
          "Your job is to return ONE single Midjourney prompt string that will work well with /imagine. " +
          "Do NOT explain, do NOT add quotes, just return the final prompt text only.",
      },
      {
        role: "user" as const,
        content: userLines.join("\n"),
      },
    ];

    // OpenAI Chat Completions 호출 (SDK 안 쓰고 fetch만 사용)
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        // 살짝 랜덤하게
        temperature: 0.9,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(
        "[generate-prompt] OpenAI error",
        response.status,
        response.statusText,
        text
      );
      return res
        .status(500)
        .json({ error: "openai_request_failed", status: response.status });
    }

    const data: any = await response.json();
    let content = data?.choices?.[0]?.message?.content;

    // 일부 모델은 content 를 배열로 줄 수 있어서 방어코드
    if (Array.isArray(content)) {
      content = content
        .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
        .join("");
    }

    const prompt = (content || "").toString().trim();

    if (!prompt) {
      console.error("[generate-prompt] empty completion", data);
      return res
        .status(500)
        .json({ error: "empty_completion", raw: data ?? null });
    }

    // 프론트가 거의 100% 이 형태를 기대하고 있음
    return res.status(200).json({ prompt });
  } catch (err: any) {
    console.error("[generate-prompt] unexpected error", err);
    return res
      .status(500)
      .json({ error: err?.message || "unknown_error", code: "UNEXPECTED" });
  }
}
