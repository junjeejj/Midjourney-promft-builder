// api/paypal/capture-order.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// getUserIdFromAuthHeader, PAYPAL_MODE, PAYPAL_API_BASE, getPayPalAccessToken,
// PRICE_MAP 은 create-order.ts 와 동일하게 사용

function getUserIdFromAuthHeader(req: VercelRequest): string | null {
  const authHeader = (req.headers.authorization ||
    // @ts-ignore
    req.headers.Authorization) as string | undefined;

  if (!authHeader) return null;
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

const PAYPAL_MODE = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
const PAYPAL_API_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not set");
  }

  const basicAuth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[paypal] oauth2 error", res.status, text);
    throw new Error("Failed to get PayPal access token");
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

const PRICE_MAP: Record<
  string,
  { value: string; credits: number; name: string }
> = {
  starter: {
    value: "5.00",
    credits: 1000,
    name: "Starter Pack",
  },
  pro: {
    value: "14.00",
    credits: 5000,
    name: "Pro Pack",
  },
  studio: {
    value: "45.00",
    credits: 999999,
    name: "Studio Pack",
  },
};

// Supabase 서비스 롤 키로 admin 클라이언트
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE");
}
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

async function addCredits(userId: string, credits: number) {
  // wallets 테이블 구조: user_id (uuid), balance (int4), unlimited (bool) 라고 가정
  const { data, error } = await supabaseAdmin
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found
    console.error("[paypal] select wallet error", error);
    throw error;
  }

  const current = data?.balance ?? 0;
  const newBalance = current + credits;

  const { error: upsertError } = await supabaseAdmin.from("wallets").upsert(
    {
      user_id: userId,
      balance: newBalance,
      updated_at: new Date().toISOString(),
      unlimited: false,
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    console.error("[paypal] upsert wallet error", upsertError);
    throw upsertError;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = (req as any).body || {};
    const orderId = body.orderId as string | undefined;
    if (!orderId) {
      return res.status(400).json({ error: "orderId required" });
    }

    const accessToken = await getPayPalAccessToken();

    // 주문 캡처
    const captureRes = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureJson = await captureRes.json();

    if (!captureRes.ok) {
      console.error("[paypal] capture error", captureJson);
      return res
        .status(500)
        .json({ error: "Failed to capture order", detail: captureJson });
    }

    const status = captureJson.status;
    if (status !== "COMPLETED") {
      console.error("[paypal] unexpected status", status, captureJson);
      return res.status(400).json({ error: "Order not completed", status });
    }

    const tier =
      captureJson.purchase_units?.[0]?.custom_id ??
      captureJson.purchase_units?.[0]?.description;

    if (!tier || !PRICE_MAP[tier]) {
      console.error("[paypal] unknown tier", tier);
      return res.status(400).json({ error: "Unknown tier", tier });
    }

    const { credits } = PRICE_MAP[tier];

    // 실제로 유저 지갑에 크레딧 추가
    await addCredits(userId, credits);

    return res.status(200).json({
      ok: true,
      tier,
      creditsAdded: credits,
    });
  } catch (err: any) {
    console.error("[paypal/capture-order] unexpected error", err);
    return res
      .status(500)
      .json({ error: err?.message || "unknown_error" });
  }
}

