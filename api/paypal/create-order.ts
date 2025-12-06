// api/paypal/create-order.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Supabase JWT에서 userId 뽑는 함수
 * (예전에 stripe/checkout.ts 에 썼던 거랑 동일한 구조)
 */
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

// sandbox / live 전환용
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

// 우리 서비스의 상품 가격 (USD)
const PRICE_MAP: Record<
  string,
  { value: string; credits: number; name: string }
> = {
  starter: {
    value: "5.00", // Starter Pack – $5
    credits: 1000, // 크레딧 값은 네가 원하는대로
    name: "Starter Pack",
  },
  pro: {
    value: "14.00", // Pro Pack – $14
    credits: 5000,
    name: "Pro Pack",
  },
  studio: {
    value: "45.00", // Studio Pack – $45
    credits: 999999, // 예시 (무제한이면 따로 플래그를 두거나)
    name: "Studio Pack",
  },
};

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
    const tier = body.tier as string | undefined;

    if (!tier || !PRICE_MAP[tier]) {
      return res.status(400).json({ error: "invalid tier" });
    }

    const { value, name } = PRICE_MAP[tier];

    const origin =
      (req.headers.origin as string | undefined) ||
      process.env.SITE_URL ||
      "https://www.midjourneybuilder.com";

    // tier 정보를 쿼리로 같이 싣는다
    const returnUrl = `${origin}/paypal-success?tier=${encodeURIComponent(
      tier
    )}`;
    const cancelUrl = `${origin}/pricing`;

    const accessToken = await getPayPalAccessToken();

    // PayPal Order 생성
    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value,
            },
            custom_id: tier, // 나중에 어떤 패키지인지 알아내는 용도
            description: name,
          },
        ],
        application_context: {
          brand_name: "Midjourney Prompt Builder",
          user_action: "PAY_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const orderJson = await orderRes.json();

    if (!orderRes.ok) {
      console.error("[paypal] create order error", orderJson);
      return res
        .status(500)
        .json({ error: "Failed to create PayPal order", detail: orderJson });
    }

    const approveLink =
      orderJson.links?.find((l: any) => l.rel === "approve")?.href ?? null;

    if (!approveLink) {
      console.error("[paypal] approve link missing", orderJson);
      return res.status(500).json({ error: "approve_link_missing" });
    }

    // 프론트엔드에서 이 url로 redirect 하면 됨
    return res.status(200).json({
      approveUrl: approveLink,
      orderId: orderJson.id,
    });
  } catch (err: any) {
    console.error("[paypal/create-order] unexpected error", err);
    return res
      .status(500)
      .json({ error: err?.message || "unknown_error" });
  }
}



