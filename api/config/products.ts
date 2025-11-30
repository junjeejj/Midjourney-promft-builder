export type CreditPackId = "starter" | "pro" | "studio";

export const CREDIT_PRODUCTS: Record<CreditPackId, {

  name: string;

  credits: number;        // 무제한일 경우 0

  price_cents: number;

  currency: "usd" | "krw";

  stripe_price_id?: string; // Stripe 대시보드 생성 후 채움

  is_unlimited?: boolean; // ★ 추가: 무제한 플래그

}> = {

  starter: { name: "Starter Pack", credits: 1000,  price_cents: 900,  currency: "usd" },

  pro:     { name: "Pro Pack",     credits: 5000,  price_cents: 2900, currency: "usd" },

  studio:  { name: "Studio Pack",  credits: 0,     price_cents: 9900, currency: "usd", is_unlimited: true },

};
