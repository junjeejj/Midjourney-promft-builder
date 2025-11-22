import { useState } from "react";

import { CREDIT_PRODUCTS, CreditPackId } from "../config/products";

import { useAuth } from "../store/useAuth";

import { useT } from "../i18n";
import { API_ENDPOINTS, ROUTES } from "../config/constants";

export default function Pricing() {

  const { t } = useT();

  const { user } = useAuth();

  const [loading, setLoading] = useState<string | null>(null);

  const userId = user?.id || (import.meta.env.VITE_DEMO_USER_ID || "demo-user");



  async function buy(productId: CreditPackId) {

    try {

      setLoading(productId);

      const res = await fetch(API_ENDPOINTS.STRIPE_CHECKOUT, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          productId,

          userId,

          successUrl: window.location.origin + ROUTES.SUCCESS,

          cancelUrl: window.location.origin + ROUTES.PRICING,

        }),

      });

      if (!res.ok) throw new Error(await res.text());

      const { url } = await res.json();

      window.location.href = url;

    } catch (e: any) {

      alert(e?.message || "Checkout failed");

    } finally {

      setLoading(null);

    }

  }



  return (

    <div className="mx-auto max-w-3xl p-6">

      <h1 className="text-2xl font-bold mb-6">{t("credits.buy")}</h1>

      <div className="grid md:grid-cols-3 gap-4">

        {Object.entries(CREDIT_PRODUCTS).map(([id, p]) => (

          <div key={id} className="border rounded-xl p-4">

            <div className="font-semibold">{p.name}</div>

            <div className="text-sm opacity-70">

              {p.is_unlimited ? "Unlimited" : `${p.credits} ${t("credits.label")}`}

            </div>

            <div className="text-xl mt-2">${(p.price_cents/100).toFixed(2)}</div>

            <button

              className="mt-4 px-3 py-2 rounded bg-black text-white w-full"

              disabled={loading === id}

              onClick={() => buy(id as CreditPackId)}

            >

              {loading === id ? "Redirecting..." : t("credits.purchase")}

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}
