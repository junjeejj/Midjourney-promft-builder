import React from "react";
import { Link } from "react-router-dom";
import { useWalletStore } from "../store/useWalletStore";
import { useAuth } from "../store/useAuth";
import HeaderAuth from "./HeaderAuth";
import { TIMEOUTS, ROUTES } from "../config/constants";

const primaryNav = [
  { label: "빌더", to: "/builder" },
  { label: "템플릿", to: "/templates" },
  { label: "시드", to: "/seed" },
  { label: "즐겨찾기", to: "/favorites" },
  { label: "기본값 설정", to: "/defaults" },
  { label: "결제", to: "/billing" },
  { label: "설정", to: "/settings" },
];

export default function TopNav({ pathname }: { pathname: string }) {
  const { user, token, checkSession } = useAuth();
  const { balance, fetchBalance } = useWalletStore();
  
  // Zustand store 함수들의 최신 참조를 유지
  const checkSessionRef = React.useRef(checkSession);
  const fetchBalanceRef = React.useRef(fetchBalance);
  
  React.useEffect(() => {
    checkSessionRef.current = checkSession;
    fetchBalanceRef.current = fetchBalance;
  }, [checkSession, fetchBalance]);

  React.useEffect(() => {
    // 초기 마운트 시 세션 체크
    checkSessionRef.current();
    
    // OAuth 콜백 감지를 위해 URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("code")) {
      // OAuth 콜백이 처리될 때까지 잠시 대기
      setTimeout(() => checkSessionRef.current(), TIMEOUTS.SESSION_CHECK_DELAY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // checkSession을 의존성에서 제거하여 무한 루프 방지

  React.useEffect(() => {
    if (user?.id && token) {
      fetchBalanceRef.current(token);
    }
  }, [user?.id, token]);

  return (
    <header className="bg-white/95 backdrop-blur border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-sm">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="text-base font-semibold text-gray-900">
            MJ 프롬프트 빌더
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {primaryNav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-3 py-1 transition ${
                    active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {user?.id && (
            <div className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              크레딧: <span className="font-medium text-gray-900">{balance}</span>
            </div>
          )}
          <Link
            to={ROUTES.PRICING}
            className="rounded-full border border-black px-3 py-1 font-medium text-black transition hover:bg-black hover:text-white"
          >
            크레딧 구매
          </Link>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}

