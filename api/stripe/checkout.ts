import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { tier, userId } = req.body || {};
    if (!tier || !userId) return res.status(400).json({ error: "tier, userId required" });

    const priceMap: Record<string, string> = {
      starter: process.env.STRIPE_PRICE_STARTER!,
      pro: process.env.STRIPE_PRICE_PRO!,
      studio: process.env.STRIPE_PRICE_STUDIO!,
    };

    const price = priceMap[tier];
    if (!price) return res.status(400).json({ error: "invalid tier" });

    const origin = req.headers.origin || "";
    const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/billing`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId, tier },
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
