import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import getRawBody from "raw-body";
import { adminSupabase } from "../_supabase";

export const config = { api: { bodyParser: false } } as any;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const raw = await getRawBody(req);
    const event = stripe.webhooks.constructEvent(raw, sig, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = (session.metadata?.userId as string) || null;
      const tier = (session.metadata?.tier as string) || "starter";

      if (userId) {
        const creditGrant: Record<string, number> = {
          starter: 1000,
          pro: 5000,
          studio: 999_999_999,
        };

        const supa = adminSupabase();
        await supa.rpc("grant_credits", {
          p_user: userId,
          p_amount: creditGrant[tier] ?? 0,
          p_reason: `stripe:${tier}`,
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
