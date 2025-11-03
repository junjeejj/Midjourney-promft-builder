import type { VercelRequest, VercelResponse } from "@vercel/node";

import Stripe from "stripe";

import { CREDIT_PRODUCTS } from "../config/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

export default async function handler(req: VercelRequest, res: VercelResponse) {

  try {

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });



    const { productId, userId, successUrl, cancelUrl } = req.body || {};

    if (!productId || !userId) return res.status(400).json({ error: "productId and userId required" });



    const product = CREDIT_PRODUCTS[productId as keyof typeof CREDIT_PRODUCTS];

    if (!product) return res.status(400).json({ error: "invalid productId" });



    // Stripe Price ID가 준비되기 전 임시: amount 직접 지정(단, 커스텀 결제형일 때)

    // Price ID가 있으면 아래 line_items를 price 기반으로 교체

    const lineItems = product.stripe_price_id

      ? [{ price: product.stripe_price_id, quantity: 1 }]

      : [{

          price_data: {

            currency: product.currency,

            product_data: { name: product.name },

            unit_amount: product.price_cents, // 서버에서 신뢰하는 가격

          },

          quantity: 1,

        }];



    const session = await stripe.checkout.sessions.create({

      mode: "payment",

      payment_method_types: ["card"],

      line_items: lineItems,

      success_url: successUrl || `${req.headers.origin || ""}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: cancelUrl || `${req.headers.origin || ""}/pricing`,

      metadata: {

        userId: String(userId),

        productId: String(productId),

        credits: String(product.credits),

        is_unlimited: product.is_unlimited ? "1" : "0",   // ★ 추가

      },

    });



    return res.status(200).json({ url: session.url });

  } catch (err: any) {

    return res.status(500).json({ error: err?.message || "Internal error" });

  }

}
