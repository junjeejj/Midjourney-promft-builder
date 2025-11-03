import type { VercelRequest, VercelResponse } from "@vercel/node";

import Stripe from "stripe";

import { CREDIT_PRODUCTS } from "../config/products";



// ★ 중요: Vercel serverless에서 raw body 필요 설정은 프레임워크별 상이하지만,

// Node handler에서 직접 버퍼를 읽을 수 없으므로 body 파서가 비활성화된 환경을 전제로 함.

// (Vercel 최신 Node Runtime은 기본 raw body 가능)

// 문제가 되면 vercel.json에서 "functions": {"api/stripe/webhook.ts": {"maxDuration": 10}} 등만 지정해도 동작.



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });



export const config = { api: { bodyParser: false } } as any;



function buffer(req: any): Promise<Buffer> {

  return new Promise((resolve, reject) => {

    const chunks: Buffer[] = [];

    req.on("data", (c: any) => chunks.push(Buffer.from(c)));

    req.on("end", () => resolve(Buffer.concat(chunks)));

    req.on("error", reject);

  });

}



// TODO: 여기에 실제 DB(Supabase 등) write 로직으로 교체

async function creditUser(userId: string, credits: number, orderId: string) {

  // 예시: ledger insert + user.balance 증분

  console.log("CREDIT LEDGER +", { userId, credits, orderId });

}



export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "POST") return res.status(405).send("Method not allowed");



  const sig = req.headers["stripe-signature"];

  if (!sig) return res.status(400).send("Missing signature");



  try {

    const buf = await buffer(req);

    const event = stripe.webhooks.constructEvent(buf, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string);



    if (event.type === "checkout.session.completed") {

      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;

      const productId = session.metadata?.productId as keyof typeof CREDIT_PRODUCTS | undefined;

      const creditsMeta = session.metadata?.credits ? parseInt(session.metadata.credits, 10) : 0;



      // Price ID 매칭 기반으로 product 식별(보안)

      let credits = creditsMeta;

      if (!credits && session.line_items) {

        // (선택) line_items expand를 사용하면 가격 ID로 역매칭 가능

      }



      if (userId && (productId || credits)) {

        const add = credits || (productId ? CREDIT_PRODUCTS[productId].credits : 0);

        await creditUser(userId, add, session.id);

      }

    }



    return res.status(200).send("ok");

  } catch (err: any) {

    console.error("Webhook error", err?.message);

    return res.status(400).send(`Webhook Error: ${err?.message}`);

  }

}
