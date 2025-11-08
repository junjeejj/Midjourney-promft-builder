import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { userId, amount, reason = "purchase" } = req.body || {};
    if (!userId || !amount) return res.status(400).json({ error: "userId, amount required" });

    const supa = adminSupabase();
    const { error } = await supa.rpc("grant_credits", {
      p_user: userId,
      p_amount: amount,
      p_reason: reason,
    });
    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

