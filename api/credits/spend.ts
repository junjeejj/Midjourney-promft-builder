import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { userId, amount = 1, reason = "prompt" } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId required" });

    const supa = adminSupabase();
    const { data, error } = await supa.rpc("spend_credits", {
      p_user: userId,
      p_amount: amount,
      p_reason: reason,
    });

    if (error) throw error;
    if (!data) return res.status(402).json({ ok: false, message: "NOT_ENOUGH_CREDITS" });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

