import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { getUserFromAuthHeader } from "./_auth";
import { adminSupabase } from "./_supabase";
import { enforceRateLimit } from "./_rateLimit";

const SYSTEM = `You are a Midjourney prompt engineer.

Return a single concise prompt optimized for /imagine.

No code fences, no explanations.`;

const COST_PER_GENERATE = 1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    if (!(await enforceRateLimit(req, res))) return;

    const auth = await getUserFromAuthHeader(req);
    if (!auth) return res.status(401).json({ error: "Unauthorized" });

    const { subject, params } = (req.body as any) || {};

    if (!subject || typeof subject !== "string") {
      return res.status(400).json({ error: "subject (string) is required" });
    }

    const supa = adminSupabase();

    const { data: spendResult, error: spendError } = await supa.rpc("spend_credits", {
      p_user: auth.userId,
      p_amount: COST_PER_GENERATE,
      p_reason: "auto_prompt",
    });
    if (spendError) throw spendError;
    if (!spendResult) {
      return res.status(402).json({ error: "Insufficient credits" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const openai = new OpenAI({ apiKey });
    const userText = buildUserText(subject, params);

    try {
      const chat = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userText },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const prompt = chat.choices?.[0]?.message?.content?.trim() || "";
      if (!prompt) return res.status(500).json({ error: "Empty prompt" });

      const { data: wallet, error: walletError } = await supa
        .from("wallets")
        .select("balance")
        .eq("user_id", auth.userId)
        .maybeSingle();
      if (walletError && walletError.code !== "PGRST116") throw walletError;

      return res.status(200).json({ prompt, balance: wallet?.balance ?? null });
    } catch (err) {
      await supa.rpc("grant_credits", {
        p_user: auth.userId,
        p_amount: COST_PER_GENERATE,
        p_reason: "auto_prompt_refund",
      });
      throw err;
    }
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

