// api/stripe/checkout.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";

import Stripe from "stripe";



/**

 * Authorization: Bearer <JWT>

 * 안에 들어 있는 supabase user id 를 꺼내는 간단한 헬퍼

 */

function getUserIdFromAuthHeader(req: VercelRequest): string | null {

  const authHeader = req.headers.authorization || req.headers.Authorization;

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



// ★ 여기에 Stripe에서 복사한 진짜 price ID 넣기

const STARTER_PRICE_ID = "price_1SYUy3DmMKf1UQTO4m0uVZa7";

// 필요하면 나중에 따로 빼서 쓰려고 남겨둠

const PRO_PRICE_ID = STARTER_PRICE_ID;

const STUDIO_PRICE_ID = STARTER_PRICE_ID;



export default async function handler(req: VercelRequest, res: VercelResponse) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({ error: "Method not allowed" });

    }



    // 환경변수 체크 (secret key만 필요)

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {

      console.error("[checkout] missing STRIPE_SECRET_KEY");

      return res.status(500).json({ error: "missing STRIPE_SECRET_KEY" });

    }



    const stripe = new Stripe(secretKey, {

      apiVersion: "2024-06-20",

    });



    const userId = getUserIdFromAuthHeader(req);

    if (!userId) {

      return res.status(401).json({ error: "Unauthorized" });

    }



    const body = (req as any).body || {};

    const tier = body.tier as string | undefined;

    const mode = (body.mode as string | undefined) || "payment";



    if (!tier) {

      return res.status(400).json({ error: "tier required" });

    }

    if (mode !== "payment" && mode !== "subscription") {

      return res.status(400).json({ error: "invalid mode" });

    }



    // ★ 환경변수 안 씀! 무조건 여기 하드코딩 값만 사용

    const priceMap: Record<string, string | undefined> = {

      starter: STARTER_PRICE_ID,

      pro: PRO_PRICE_ID,

      studio: STUDIO_PRICE_ID,

    };



    const price = priceMap[tier];

    if (!price) {

      console.error("[checkout] invalid tier", { tier });

      return res.status(400).json({ error: "invalid tier" });

    }



    console.log("[checkout] creating session", { tier, price });



    const origin =

      (req.headers.origin as string | undefined) ||

      process.env.SITE_URL ||

      "https://www.midjourneybuilder.com";



    const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${origin}/pricing`;



    const session = await stripe.checkout.sessions.create({

      mode,

      line_items: [{ price, quantity: 1 }],

      success_url: successUrl,

      cancel_url: cancelUrl,

      metadata: { userId, tier },

      ...(mode === "subscription"

        ? {

            subscription_data: {

              metadata: { userId, tier },

            },

          }

        : {}),

    });



    return res.status(200).json({ url: session.url });

  } catch (err: any) {

    console.error("[checkout] unexpected error", err);

    return res.status(500).json({

      error: err?.message || "unknown_error",

    });

  }

}
