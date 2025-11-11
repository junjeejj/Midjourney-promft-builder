import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import getRawBody from "raw-body";
import { adminSupabase } from "../_supabase";

export const config = { api: { bodyParser: false } } as any;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const raw = await getRawBody(req);
    const event = stripe.webhooks.constructEvent(raw, sig, secret);
    const supa = adminSupabase();

    const { data: claimed, error: claimErr } = await supa.rpc("claim_webhook_event", {
      p_event_id: event.id,
      p_type: event.type,
    });
    if (claimErr) throw claimErr;
    if (!claimed) {
      return res.status(200).json({ ok: true, idempotent: true });
    }

    const creditGrant: Record<string, number> = {
      starter: 1000,
      pro: 5000,
      studio: 999_999_999,
    };

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = (session.metadata?.userId as string) || null;
      const tier = (session.metadata?.tier as string) || "starter";

      if (userId) {
        await supa.rpc("grant_credits", {
          p_user: userId,
          p_amount: creditGrant[tier] ?? 0,
          p_reason: `stripe:${event.type}:${tier}`,
          p_ext_event_id: event.id,
        });
      }
    } else if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        const tier = subscription.metadata?.tier ?? "starter";

        if (userId) {
          await supa.rpc("grant_credits", {
            p_user: userId,
            p_amount: creditGrant[tier] ?? 0,
            p_reason: `stripe:${event.type}:${tier}`,
            p_ext_event_id: event.id,
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
