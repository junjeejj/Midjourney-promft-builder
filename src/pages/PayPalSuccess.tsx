// src/pages/PayPalSuccess.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PayPalSuccessPage = () => {
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const orderId = query.get("token"); // PayPal 이 return_url?token=... 으로 돌려보냄
      const tier = query.get("tier"); // 우리가 쿼리에 실어 보낸 tier
      if (!orderId) {
        alert("orderId 가 없습니다.");
        navigate("/pricing");
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        alert("세션 정보를 가져오지 못했습니다.");
        navigate("/pricing");
        return;
      }

      const accessToken = data.session?.access_token;
      if (!accessToken) {
        alert("다시 로그인 해 주세요.");
        navigate("/pricing");
        return;
      }

      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orderId, tier }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("capture error", json);
        alert("결제 승인 처리 중 오류가 발생했습니다.");
        navigate("/pricing");
        return;
      }

      // 성공 시 크레딧 반영은 백엔드에서 이미 완료됨
      alert("결제가 완료되었습니다. 크레딧이 충전되었습니다!");
      navigate("/"); // 혹은 "/pricing" 등 원하는 페이지
    };

    run();
  }, [query, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>결제를 처리하는 중입니다…</h2>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
};

export default PayPalSuccessPage;



