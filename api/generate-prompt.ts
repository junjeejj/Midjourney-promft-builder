import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const SYSTEM = `You are a Midjourney prompt engineer.

Return a single concise prompt optimized for /imagine.

No code fences, no explanations.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { subject, params, userId } = (req.body as any) || {};

    if (!subject || typeof subject !== "string") {
      return res.status(400).json({ error: "subject (string) is required" });
    }

    // (임시) userId 수신
    if (!userId) return res.status(401).json({ error: "userId required" });

    // TODO: 실제 DB에서 현재 잔액 조회
    async function getBalance(uid: string) { return 5000; } // 임시 5k
    async function spendCredits(uid: string, amount: number) { console.log("SPEND", uid, amount); }

    const COST_PER_GENERATE = 5; // 1회 5크레딧 예시
    const balance = await getBalance(userId);
    if (balance < COST_PER_GENERATE) return res.status(402).json({ error: "Insufficient credits" });

    // ↓↓↓ 기존 OpenAI 호출 전에 선차감(혹은 후차감)
    await spendCredits(userId, COST_PER_GENERATE);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const openai = new OpenAI({ apiKey });
    const userText = buildUserText(subject, params);

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userText }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const prompt = chat.choices?.[0]?.message?.content?.trim() || "";
    if (!prompt) return res.status(500).json({ error: "Empty prompt" });

    return res.status(200).json({ prompt });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}

function buildUserText(subject: string, params: any) {
  const parts: string[] = [];
  parts.push(`Subject: ${subject}`);
  if (params?.ar) parts.push(`Aspect: --ar ${params.ar}`);
  if (params?.s) parts.push(`Stylize: --s ${params.s}`);
  if (params?.chaos) parts.push(`Chaos: --chaos ${params.chaos}`);
  if (params?.weird) parts.push(`Weird: --weird ${params.weird}`);
  if (params?.raw) parts.push(`Use --raw`);
  if (params?.tile) parts.push(`Use --tile`);
  if (params?.quality) parts.push(`Quality: --q ${params.quality}`);
  if (params?.v) parts.push(`Version: --v ${params.v}`);
  if (params?.no) parts.push(`No: --no ${String(params.no).slice(0, 100)}`);

  return `Make ONE Midjourney /imagine prompt for the subject with these hints:

${parts.join("\n")}

Rules:

- Return only the final prompt line (no commentary).

- Keep it 1–2 lines, vivid, concrete nouns, lighting, composition.

- Append valid MJ params inferred above at the end.`;
}

