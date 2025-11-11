import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "../_supabase";
import { getUserFromAuthHeader } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") return res.status(405).end();

    const auth = await getUserFromAuthHeader(req);
    if (!auth) return res.status(401).json({ error: "Unauthorized" });

    const supa = adminSupabase();
    const { data, error } = await supa
      .from("wallets")
      .select("balance")
      .eq("user_id", auth.userId)
      .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;

    return res.status(200).json({ balance: data?.balance ?? 0 });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

