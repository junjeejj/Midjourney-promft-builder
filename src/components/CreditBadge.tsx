import { useEffect, useRef } from "react";
import { useWalletStore } from "../store/useWalletStore";
import { useAuth } from "../store/useAuth";
import { useT } from "../i18n";

export default function CreditBadge() {
  const { balance, fetchBalance, loading } = useWalletStore();
  const { token, user } = useAuth();
  const { t } = useT();
  const fetchBalanceRef = useRef(fetchBalance);

  // fetchBalance 함수의 최신 참조 유지
  useEffect(() => {
    fetchBalanceRef.current = fetchBalance;
  }, [fetchBalance]);

  // 로그인 상태가 변경되거나 token이 있을 때 잔액 가져오기
  useEffect(() => {
    if (user?.id && token) {
      fetchBalanceRef.current(token);
    }
  }, [user?.id, token]);

  // 로그인 이벤트 감지하여 wallet balance 가져오기
  useEffect(() => {
    let hasHandled = false;
    
    const handleSignedIn = (event: CustomEvent<{ user: any; token: string }>) => {
      // 중복 호출 방지: 같은 이벤트를 여러 번 처리하지 않도록
      if (hasHandled) return;
      if (event.detail.token) {
        hasHandled = true;
        fetchBalanceRef.current(event.detail.token);
        // 짧은 시간 후 플래그 리셋
        setTimeout(() => { hasHandled = false; }, 1000);
      }
    };

    const handleSignedOut = () => {
      // 로그아웃 시 balance는 useWalletStore의 reset()에서 처리됨
      hasHandled = false;
    };

    window.addEventListener("auth:signed-in", handleSignedIn as EventListener);
    window.addEventListener("auth:signed-out", handleSignedOut);
    return () => {
      window.removeEventListener("auth:signed-in", handleSignedIn as EventListener);
      window.removeEventListener("auth:signed-out", handleSignedOut);
    };
  }, []);

  return (
    <span className="rounded-lg border bg-white px-2 py-1 text-xs">
      {t("credits.label")}: <b>{loading ? "..." : (balance ?? 0)}</b>
    </span>
  );
}