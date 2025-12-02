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

      // 1) 현재 로그인 세션에서 액세스 토큰 꺼내기
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 2) 우리 백엔드 PayPal 주문 생성 API 호출
      const res = await fetch("/api/paypal/create-order", {
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
        alert(json.error || "PayPal 주문 생성 중 오류가 발생했습니다.");
        return;
      }

      if (!json.approveUrl) {
        alert("PayPal 승인 URL이 없습니다.");
        return;
      }

      // 3) PayPal 결제 페이지로 이동
      window.location.href = json.approveUrl;
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "결제 준비 중 오류가 발생했습니다.");
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
