import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getUserFromAuthHeader } from "../_auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const auth = await getUserFromAuthHeader(req);
    if (!auth) return res.status(401).json({ error: "Unauthorized" });

    const { tier, mode = "payment" } = req.body || {};
    if (!tier) return res.status(400).json({ error: "tier required" });
    if (mode !== "payment" && mode !== "subscription") {
      return res.status(400).json({ error: "invalid mode" });
    }

    const priceMap: Record<string, string | undefined> = {
      starter: process.env.STRIPE_PRICE_STARTER,
      pro: process.env.STRIPE_PRICE_PRO,
      studio: process.env.STRIPE_PRICE_STUDIO,
    };

    const price = priceMap[tier];
    if (!price) return res.status(400).json({ error: "invalid tier" });

    const origin = req.headers.origin || process.env.SITE_URL || "https://example.com";
    const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/billing`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: auth.userId, tier },
      ...(mode === "subscription"
        ? {
            subscription_data: {
              metadata: { userId: auth.userId, tier },
            },
          }
        : {}),
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
