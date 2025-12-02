import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { adminSupabase } from "./_supabase";
import { enforceRateLimit } from "./_rateLimit";
import { GeneratePromptSchema, type GeneratePromptInput } from "../src/lib/validation";

// 간단한 JWT 파서: Authorization 헤더에서 userId 뽑아오기
type AuthInfo = {
  userId: string;
};

function getUserFromAuthHeader(req: any): AuthInfo | null {
  const authHeader =
    (req.headers?.authorization as string | undefined) ??
    (req.headers?.Authorization as string | undefined);

  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }

  const [, token] = authHeader.split(" ");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);

    const sub =
      (payload.sub as string | undefined) ??
      (payload.user_id as string | undefined);

    if (!sub) return null;

    return { userId: sub };
  } catch {
    return null;
  }
}

const SYSTEM = `You are a Midjourney prompt engineer.

Return a single concise prompt optimized for /imagine.

No code fences, no explanations.`;

const COST_PER_GENERATE = 1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 표준 에러 포맷 사용
    const bad = (code: string, message: string, status = 400) => 
      res.status(status).json({ ok: false, error: { code, message } });
    
    if (req.method !== "POST") return bad("METHOD_NOT_ALLOWED", "POST only", 405);

    if (!(await enforceRateLimit(req, res))) return;

    const auth = await getUserFromAuthHeader(req);
    if (!auth) return bad("UNAUTHORIZED", "Authentication required", 401);

    // 입력 검증
    const parsed = GeneratePromptSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return bad("INVALID_INPUT", parsed.error.issues.map(i => i.message).join("; "));
    }
    const { subject, params } = parsed.data;

    const supa = adminSupabase();
    const { data: wallet } = await supa
      .from("wallets")
      .select("balance, unlimited")
      .eq("user_id", auth.userId)
      .maybeSingle();
    const unlimited = !!wallet?.unlimited;
    if (!unlimited && (wallet?.balance ?? 0) < COST_PER_GENERATE) {
      return bad("NOT_ENOUGH_CREDITS", "Insufficient credits", 402);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return bad("MISSING_API_KEY", "OPENAI_API_KEY not configured", 500);

    const openai = new OpenAI({ apiKey });
    const rsp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserText(subject, params) }
      ],
    });
    const text = rsp.choices[0]?.message?.content?.trim();
    if (!text) return bad("OPENAI_EMPTY", "Empty completion", 502);

    if (!unlimited) {
      const { error: spendErr } = await supa.rpc("spend_credits", { 
        p_user: auth.userId, 
        p_amount: COST_PER_GENERATE, 
        p_reason: "generate" 
      });
      if (spendErr) throw spendErr;
    }
    return res.status(200).json({ ok: true, prompt: text });
  } catch (err: any) {
    return res.status(500).json({ 
      ok: false, 
      error: { code: "INTERNAL_ERROR", message: String(err?.message || err) } 
    });
  }
}

function buildUserText(subject: string, params: GeneratePromptInput["params"]) {
  const parts: string[] = [];
  parts.push(`Subject: ${subject}`);
  if (params?.ar) parts.push(`Aspect: --ar ${params.ar}`);
  if (params?.stylize) parts.push(`Stylize: --stylize ${params.stylize}`);
  if (params?.chaos) parts.push(`Chaos: --chaos ${params.chaos}`);
  if (params?.tile) parts.push(`Use --tile`);
  if (params?.q) parts.push(`Quality: --q ${params.q}`);
  if (params?.version) parts.push(`Version: --v ${params.version}`);
  if (params?.no) parts.push(`No: --no ${params.no.join(", ").slice(0, 100)}`);
  if (params?.seed) parts.push(`Seed: --seed ${params.seed}`);
  if (params?.stop) parts.push(`Stop: --stop ${params.stop}`);
  if (params?.repeat) parts.push(`Repeat: --repeat ${params.repeat}`);
  if (params?.sref) parts.push(`Style Reference: --sref ${params.sref}`);
  if (params?.cref) parts.push(`Character Reference: --cref ${params.cref}`);
  if (params?.niji) parts.push(`Use --niji`);

  return `Make ONE Midjourney /imagine prompt for the subject with these hints:

${parts.join("\n")}

Rules:

- Return only the final prompt line (no commentary).

- Keep it 1–2 lines, vivid, concrete nouns, lighting, composition.

- Append valid MJ params inferred above at the end.`;
}

