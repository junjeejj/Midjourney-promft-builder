// src/components/UserInfo.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useWalletStore } from "../store/useWalletStore";
import HeaderAuth from "./HeaderAuth";
import { ROUTES, TIMEOUTS } from "../config/constants";

export default function UserInfo() {
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
    <div className="border-b pb-4 mb-4 space-y-3">
      {/* 로그인/사용자 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeaderAuth />
          {user?.id && (
            <span className="text-sm text-gray-600">
              {user.displayName || user.name || "사용자"}
            </span>
          )}
        </div>
      </div>

      {/* 크레딧 정보 및 구매 버튼 */}
      {user?.id && (
        <div className="space-y-2">
          <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
            <span className="text-gray-600">크레딧: </span>
            <span className="font-semibold text-gray-900">{balance}</span>
          </div>
          <Link
            to={ROUTES.PRICING}
            className="block w-full text-center rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            크레딧 구매
          </Link>
        </div>
      )}

      {!user?.id && (
        <Link
          to={ROUTES.LOGIN}
          className="block w-full text-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          로그인
        </Link>
      )}
    </div>
  );
}



