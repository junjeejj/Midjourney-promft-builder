// api/credits/balance.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(

  process.env.SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE!,

  {

    auth: { persistSession: false },

  }

);

/**

 * Authorization: Bearer <JWT> 에서 user id 꺼내기

 * (checkout.ts 에 썼던 것과 같은 방식)

 */

function getUserIdFromAuthHeader(req: VercelRequest): string | null {

  const authHeader = (req.headers.authorization ||

    (req.headers as any).Authorization) as string | undefined;

  if (!authHeader || typeof authHeader !== "string") return null;

  const [, token] = authHeader.split(" ");

  if (!token) return null;

  const parts = token.split(".");

  if (parts.length !== 3) return null;

  try {

    const payloadJson = Buffer.from(parts[1], "base64").toString("utf8");

    const payload = JSON.parse(payloadJson);

    return payload.sub || payload.user_id || null;

  } catch {

    return null;

  }

}

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "GET") {

    res.setHeader("Allow", "GET");

    return res.status(405).json({ error: "Method not allowed" });

  }

  const userId = getUserIdFromAuthHeader(req);

  if (!userId) {

    return res.status(401).json({ error: "Unauthorized" });

  }

  try {

    const { data, error } = await supabase

      .from("wallets")

      .select("balance, unlimited")

      .eq("user_id", userId)

      .maybeSingle();

    if (error && (error as any).code !== "PGRST116") {

      console.error("[credits/balance] select wallet error", error);

      return res.status(500).json({ error: "Wallet load failed" });

    }

    const balance = data?.balance ?? 0;

    const unlimited = data?.unlimited ?? false;

    return res.status(200).json({ balance, unlimited });

  } catch (err: any) {

    console.error("[credits/balance] unexpected error", err);

    return res.status(500).json({ error: "internal_error" });

  }

}
