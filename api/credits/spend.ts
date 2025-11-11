import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "../_supabase";
import { getUserFromAuthHeader } from "../_auth";
import { enforceRateLimit } from "../_rateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    if (!(await enforceRateLimit(req, res))) return;

    const auth = await getUserFromAuthHeader(req);
    if (!auth) return res.status(401).json({ error: "Unauthorized" });

    const { amount = 1, reason = "prompt" } = req.body || {};
    if (amount <= 0) return res.status(400).json({ error: "invalid amount" });

    const supa = adminSupabase();
    const { data, error } = await supa.rpc("spend_credits", {
      p_user: auth.userId,
      p_amount: amount,
      p_reason: reason,
    });

    if (error) throw error;
    if (!data) return res.status(402).json({ ok: false, message: "NOT_ENOUGH_CREDITS" });

    const { data: wallet, error: walletError } = await supa
      .from("wallets")
      .select("balance")
      .eq("user_id", auth.userId)
      .maybeSingle();
    if (walletError && walletError.code !== "PGRST116") throw walletError;

    return res.status(200).json({ ok: true, balance: wallet?.balance ?? 0 });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

