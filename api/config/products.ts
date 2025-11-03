export type CreditPackId = "starter" | "pro" | "studio";

export const CREDIT_PRODUCTS: Record<CreditPackId, {

  name: string;

  credits: number;

  stripe_price_id?: string; // Stripe 대시보드 생성 후 채움

  price_cents: number;      // 서버 가격 검증용(보안)

  currency: "usd" | "krw";

}> = {

  starter: { name: "Starter Pack", credits: 1000, price_cents: 900, currency: "usd" },

  pro:     { name: "Pro Pack",     credits: 5000, price_cents: 2900, currency: "usd" },

  studio:  { name: "Studio Pack",  credits: 20000, price_cents: 9900, currency: "usd" },

};
