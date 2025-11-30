import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import getRawBody from "raw-body";
import { adminSupabase } from "../_supabase";

export const config = { api: { bodyParser: false } } as any;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" as any });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const raw = await getRawBody(req);
    const event = stripe.webhooks.constructEvent(raw, sig, secret);
    const supa = adminSupabase();

    // 공통 가드: Stripe 이벤트 중복 처리 방지
    const eventId = event.id;
    const { data: seen } = await supa
      .from("stripe_events")
      .insert({ id: eventId })
      .select("id")
      .single()
      .catch(() => ({ data: null })); // unique 충돌 시 이미 처리됨
    if (!seen) return res.status(200).json({ ok: true, skipped: "DUPLICATE_EVENT" });

    const { CREDIT_PRODUCTS } = await import("../config/products");

    if (event.type === "checkout.session.completed" || event.type === "invoice.paid") {
      let session: Stripe.Checkout.Session | Stripe.Invoice;
      let packId: keyof typeof CREDIT_PRODUCTS | undefined;
      let userId: string | undefined;

      if (event.type === "checkout.session.completed") {
        session = event.data.object as Stripe.Checkout.Session;
        packId = session.metadata?.packId as keyof typeof CREDIT_PRODUCTS | undefined;
        userId = session.client_reference_id || session.metadata?.userId;
      } else {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        if (!subscriptionId) return res.status(200).json({ ok: true, skipped: "NO_SUBSCRIPTION" });
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        packId = subscription.metadata?.packId as keyof typeof CREDIT_PRODUCTS | undefined;
        userId = subscription.metadata?.userId;
      }

      if (!packId || !userId) return res.status(200).json({ ok: true, skipped: "MISSING_IDS" });
      
      const product = CREDIT_PRODUCTS[packId];
      if (!product) return res.status(200).json({ ok: true, skipped: "INVALID_PACK" });

      if (product.is_unlimited) {
        await supa.from("wallets").update({ unlimited: true }).eq("user_id", userId);
      } else {
        await supa.rpc("grant_credits", { 
          p_user: userId, 
          p_amount: product.credits, 
          p_reason: event.type === "checkout.session.completed" ? "stripe_checkout" : "stripe_invoice_paid" 
        });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true, received: true });
  } catch (err: any) {
    return res.status(400).json({ 
      ok: false, 
      error: { code: "WEBHOOK_ERROR", message: String(err?.message || err) } 
    });
  }
}
