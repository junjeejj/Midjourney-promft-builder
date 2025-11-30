// api/stripe/checkout.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

// 헤더에서 JWT 토큰을 직접 파싱해서 userId(sub) 가져오기
function getUserIdFromAuthHeader(req: VercelRequest): string | null {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || Array.isArray(auth)) return null;

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return null;

  const token = parts[1];
  const pieces = token.split(".");
  if (pieces.length !== 3) return null;

  try {
    const payloadJson = (Buffer as any).from(pieces[1], "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const sub = payload.sub as string | undefined;
    return sub || null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1) 메소드 체크
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2) 인증 (Supabase JWT를 직접 파싱)
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 3) 바디 파라미터
    const body = (req.body || {}) as { tier?: string; mode?: string };
    const tier = body.tier;
    const mode = body.mode ?? "payment";

    if (!tier) {
      return res.status(400).json({ error: "tier required" });
    }
    if (mode !== "payment" && mode !== "subscription") {
      return res.status(400).json({ error: "invalid mode" });
    }

    // 4) 환경변수 체크
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[checkout] Missing STRIPE_SECRET_KEY");
      return res.status(500).json({ error: "missing STRIPE_SECRET_KEY env" });
    }

    const priceMap: Record<string, string | undefined> = {
      starter: process.env.STRIPE_PRICE_STARTER,
      pro: process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRICE_STARTER,
      studio: process.env.STRIPE_PRICE_STUDIO || process.env.STRIPE_PRICE_STARTER,
    };

    const price = priceMap[tier];
    if (!price) {
      console.error("[checkout] Missing price for tier", tier, priceMap);
      return res
        .status(500)
        .json({ error: `missing Stripe price for tier ${tier}` });
    }

    // 5) Stripe 클라이언트 (요청 안에서 생성)
    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20" as any,
    });

    // 6) 리다이렉트 URL 구성
    const originHeader = req.headers.origin as string | undefined;
    const origin =
      originHeader || process.env.SITE_URL || "https://www.midjourneybuilder.com";

    const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/pricing`;

    // 7) Checkout 세션 생성
    const session = await stripe.checkout.sessions.create({
      mode: mode as "payment" | "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        tier,
      },
      ...(mode === "subscription"
        ? {
            subscription_data: {
              metadata: { userId, tier },
            },
          }
        : {}),
    });

    // 8) 프론트로 URL 반환
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] unexpected error", err);
    return res.status(500).json({ error: err?.message || "unknown_error" });
  }
}
