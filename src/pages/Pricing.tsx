import { useState } from "react";

import { CREDIT_PRODUCTS, CreditPackId } from "../config/products";

import { useAuth } from "../store/useAuth";

import { useT } from "../i18n";
import { API_ENDPOINTS, ROUTES } from "../config/constants";

export default function Pricing() {

  const { t } = useT();

  const { user, token } = useAuth();

  const [loading, setLoading] = useState<string | null>(null);




  async function buy(productId: CreditPackId) {

    try {

      setLoading(productId);

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const res = await fetch(API_ENDPOINTS.STRIPE_CHECKOUT, {

        method: "POST",

        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

        body: JSON.stringify({

          tier: productId, // productId를 tier로 매핑

          successUrl: window.location.origin + ROUTES.SUCCESS,

          cancelUrl: window.location.origin + ROUTES.PRICING,

        }),

      });

      if (!res.ok) {
        // 에러 응답을 JSON으로 파싱 시도
        let errorMessage = `Server error (${res.status})`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // JSON 파싱 실패 시 텍스트로 시도
          try {
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // 파싱 실패 시 기본 메시지 사용
          }
        }
        throw new Error(errorMessage);
      }

      const { url } = await res.json();

      if (!url) {
        throw new Error("No checkout URL received");
      }

      window.location.href = url;

    } catch (e: any) {

      const errorMsg = e?.message || "Checkout failed";
      console.error("[Pricing] Checkout error:", e);
      alert(errorMsg);

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
