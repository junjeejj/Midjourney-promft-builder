import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "./_supabase";
import { isRequestAllowed } from "./_moderation";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const body: any = (req as any).body || {};
    const prompt = (body.prompt ?? "").toString().trim();
    const reason = (body.reason ?? "").toString().trim();
    const pagePath = (body.pagePath ?? "").toString().trim();

    if (!prompt || !reason) return res.status(400).json({ error: "prompt/reason이 필요합니다." });

    const m = isRequestAllowed(prompt);
    const sb = adminSupabase();

    const { error } = await sb.from("prompt_reports").insert([
      {
        prompt: prompt.slice(0, 5000),
        reason: reason.slice(0, 2000),
        page_path: pagePath || null,
        flagged_labels: m.ok ? null : m.labels,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) return res.status(500).json({ error: "저장에 실패했습니다." });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "서버 오류" });
  }
}






