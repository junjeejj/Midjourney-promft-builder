import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") return res.status(405).end();

    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const supa = adminSupabase();
    const { data, error } = await supa.from("wallets").select("balance").eq("user_id", userId).single();
    if (error) throw error;

    return res.status(200).json({ balance: data?.balance ?? 0 });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

