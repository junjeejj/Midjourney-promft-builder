import { useState } from "react";

import { CREDIT_PRODUCTS, CreditPackId } from "../config/products";

import { useAuth } from "../store/useAuth";

import { useT } from "../i18n";
import { API_ENDPOINTS, ROUTES } from "../config/constants";
import { supabase } from "../lib/supabase";

export default function Pricing() {

  const { t } = useT();

  const { user, token } = useAuth();

  const [loading, setLoading] = useState<string | null>(null);




  async function buy(productId: CreditPackId) {
    try {
      setLoading(productId);

      // 1) useAuth에서 가져온 token 사용, 없으면 세션에서 가져오기
      let accessToken = token;
      
      if (!accessToken) {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        accessToken = data.session?.access_token ?? null;
      }

      if (!accessToken) {
        alert(t("pricing.loginRequired"));
        window.location.href = ROUTES.LOGIN;
        return;
      }

      // 2) 우리 백엔드 PayPal 주문 생성 API 호출
      const res = await fetch(API_ENDPOINTS.PAYPAL_CREATE_ORDER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tier: productId }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("paypal create-order error", json);
        alert(json.error || t("pricing.paypalOrderError"));
        return;
      }

      if (!json.approveUrl) {
        alert(t("pricing.paypalUrlError"));
        return;
      }

      // 3) PayPal 결제 페이지로 이동
      window.location.href = json.approveUrl;
    } catch (err: any) {
      console.error("[Pricing] buy error:", err);
      alert(err?.message || t("pricing.paymentError"));
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

              {p.is_unlimited ? t("credits.unlimited") : `${p.credits} ${t("credits.label")}`}

            </div>

            <div className="text-xl mt-2">${(p.price_cents/100).toFixed(2)}</div>

            <button

              className="mt-4 px-3 py-2 rounded bg-black text-white w-full"

              disabled={loading === id}

              onClick={() => buy(id as CreditPackId)}

            >

              {loading === id ? t("pricing.redirecting") : t("credits.purchase")}

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}
