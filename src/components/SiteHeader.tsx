import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getLang, setLang } from "../lib/lang";
import { NAV_ITEMS, SITE_TEXT } from "../config/siteText";
import { useAuth } from "../store/useAuth";
import { useWalletStore } from "../store/useWalletStore";
import HeaderAuth from "./HeaderAuth";
import { ROUTES, TIMEOUTS } from "../config/constants";

export default function SiteHeader() {
  const loc = useLocation();
  const lang = getLang();
  const t = SITE_TEXT[lang];
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
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/builder" className="flex items-baseline gap-2">
          <div className="text-xl font-bold">{t.siteName}</div>
          <div className="text-sm text-gray-500">{t.brandLine}</div>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {NAV_ITEMS.map((it) => {
            const active = loc.pathname === it.to || (it.to !== "/" && loc.pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={[
                  "px-3 py-2 rounded-xl text-sm border transition",
                  active ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50",
                ].join(" ")}
              >
                {t.nav[it.key]}
              </Link>
            );
          })}
          {user?.id && (
            <div className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
              {t.credits.colon}<span className="font-medium text-gray-900">{balance}</span>
            </div>
          )}
          <Link
            to={ROUTES.PRICING}
            className="rounded-full border border-black px-3 py-1 font-medium text-black transition hover:bg-black hover:text-white"
          >
            {t.credits.buy}
          </Link>
          <HeaderAuth />
          <span className="text-xs text-gray-500">{t.language.label}</span>
          <button
            className="px-3 py-2 rounded-xl text-sm border bg-white hover:bg-gray-50 transition"
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            title={lang === "ko" ? "Switch to English" : "한국어로 전환"}
          >
            {t.language.switchTo}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <div className="font-medium text-gray-900">{lang === "ko" ? "안내" : "Notice"}</div>
        <p className="mt-1 leading-relaxed">{t.disclaimerLong}</p>
      </div>
    </div>
  );
}
