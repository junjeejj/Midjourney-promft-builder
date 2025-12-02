// api/stripe/webhook.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";

import Stripe from "stripe";

import { createClient } from "@supabase/supabase-js";

export const config = {

  api: {

    bodyParser: false, // Stripe 시그니처 검증을 위해 raw body 필요

  },

};

// Stripe 클라이언트

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

  apiVersion: "2024-06-20",

});

// Supabase 서비스 롤 클라이언트

const supabase = createClient(

  process.env.SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE!,

  {

    auth: { persistSession: false },

  }

);

// 크레딧 테이블 규칙 (Starter 기준만 정확하면 됨)

const CREDITS_PER_TIER: Record<string, number> = {

  starter: 1000,

  pro: 5000,

  // studio 는 무제한이니까 balance 대신 unlimited 플래그만 세팅

};

function readBuffer(req: VercelRequest): Promise<Buffer> {

  return new Promise((resolve, reject) => {

    const chunks: Buffer[] = [];

    req.on("data", (chunk) =>

      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)

    );

    req.on("end", () => resolve(Buffer.concat(chunks)));

    req.on("error", reject);

  });

}

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "POST") {

    res.setHeader("Allow", "POST");

    return res.status(405).send("Method not allowed");

  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {

    console.error("[webhook] missing STRIPE_WEBHOOK_SECRET");

    return res.status(500).send("Webhook secret not configured");

  }

  let event: Stripe.Event;

  try {

    const sig = req.headers["stripe-signature"] as string;

    const buf = await readBuffer(req);

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

  } catch (err: any) {

    console.error("[webhook] signature verify failed", err?.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);

  }

  try {

    if (event.type === "checkout.session.completed") {

      const session = event.data.object as Stripe.Checkout.Session;

      const metadata = session.metadata || {};

      const userId = metadata.userId as string | undefined;

      const tier = metadata.tier as string | undefined;

      console.log("[webhook] checkout.session.completed", { userId, tier });

      if (!userId || !tier) {

        console.error("[webhook] missing metadata");

        return res.json({ received: true });

      }

      const now = new Date().toISOString();

      // 무제한 플랜

      if (tier === "studio") {

        const { error } = await supabase

          .from("wallets")

          .upsert(

            {

              user_id: userId,

              unlimited: true,

              updated_at: now,

            },

            { onConflict: "user_id" }

          );

        if (error) {

          console.error("[webhook] upsert studio wallet error", error);

          return res.status(500).send("Wallet update failed");

        }

      } else {

        const creditsToAdd = CREDITS_PER_TIER[tier] ?? 0;

        if (!creditsToAdd) {

          console.error("[webhook] unknown tier", tier);

          return res.json({ received: true });

        }

        // 기존 지갑 조회

        const { data: existing, error: selectError } = await supabase

          .from("wallets")

          .select("balance, unlimited")

          .eq("user_id", userId)

          .maybeSingle();

        if (selectError && (selectError as any).code !== "PGRST116") {

          console.error("[webhook] select wallet error", selectError);

          return res.status(500).send("Wallet load failed");

        }

        const newBalance = (existing?.balance ?? 0) + creditsToAdd;

        const unlimited = existing?.unlimited ?? false;

        const { error: upsertError } = await supabase

          .from("wallets")

          .upsert(

            {

              user_id: userId,

              balance: newBalance,

              unlimited,

              updated_at: now,

            },

            { onConflict: "user_id" }

          );

        if (upsertError) {

          console.error("[webhook] upsert wallet error", upsertError);

          return res.status(500).send("Wallet update failed");

        }

      }

    }

    // Stripe 에는 200만 잘 돌려주면 됨

    return res.json({ received: true });

  } catch (err: any) {

    console.error("[webhook] handler error", err);

    return res.status(500).send("Internal error");

  }

}
