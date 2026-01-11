// src/pages/Login.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { ROUTES, OAUTH_PROVIDERS, TIMEOUTS } from "../config/constants";
import { getLang } from "../lib/lang";
import { SITE_TEXT } from "../config/siteText";

export default function Login() {
  const { signInWithPassword, signUp, signInWithProvider, signOut, user, token, checkSession } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const lang = getLang();
  const t = SITE_TEXT[lang];
  const checkSessionRef = useRef(checkSession);

  // checkSession 함수의 최신 참조 유지
  useEffect(() => {
    checkSessionRef.current = checkSession;
  }, [checkSession]);

  // OAuth 콜백 처리 및 초기 세션 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("code")) {
      // OAuth 콜백으로 돌아온 경우 세션 확인 (약간의 지연 후)
      setTimeout(() => {
        checkSessionRef.current();
        // URL 정리
        const cleaned = new URL(window.location.href);
        ["code", "state", "error", "error_code", "error_description"].forEach((k) =>
          cleaned.searchParams.delete(k)
        );
        window.history.replaceState({}, document.title, cleaned.toString());
      }, TIMEOUTS.SESSION_CHECK_DELAY);
    } else {
      // 일반 페이지 진입 시 세션 확인
      checkSessionRef.current();
    }
  }, []); // 의존성 배열 비워서 한 번만 실행

  // 로그인 성공 시 리다이렉트 (React Router 사용)
  useEffect(() => {
    if (user && token && window.location.pathname === ROUTES.LOGIN) {
      // 약간의 지연 후 리다이렉트하여 상태 업데이트가 완료되도록 함
      const timer = setTimeout(() => {
        navigate(ROUTES.HOME, { replace: true });
      }, TIMEOUTS.LOGIN_REDIRECT);
      return () => clearTimeout(timer);
    }
  }, [user, token, navigate]);

  async function doLogin() {
    try {
      setMsg(null);
      setIsLoading(true);
      await signInWithPassword(email, pw);
      // 로그인 성공 후 세션 재확인하여 상태 즉시 반영
      await checkSessionRef.current();
      setMsg(t.login.success);
    } catch (e: any) {
      setMsg(e?.message || t.login.failed);
    } finally {
      setIsLoading(false);
    }
  }

  async function doSignup() {
    try {
      setMsg(null);
      setIsLoading(true);
      await signUp(email, pw);
      // 회원가입 후 세션 재확인
      await checkSessionRef.current();
      setMsg(t.login.signupSuccess);
    } catch (e: any) {
      setMsg(e?.message || t.login.signupFailed);
    } finally {
      setIsLoading(false);
    }
  }

  async function doProvider(p: string) {
    try {
      setMsg(null);
      setIsLoading(true);
      await signInWithProvider(p);
      setMsg(t.login.oauthRedirect);
    } catch (e: any) {
      setMsg(e?.message || t.login.oauthFailed);
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">{t.login.title}</h1>
      <div className="mb-3 text-sm opacity-70">
        {t.login.sessionLabel}{user ? `${user.email ?? user.id}` : t.login.sessionNone}
        {token && <span className="ml-2 text-green-600">{t.login.loggedIn}</span>}
      </div>
      <div className="flex flex-col gap-2">
        <input 
          className="border rounded px-3 py-2" 
          placeholder={lang === "ko" ? "이메일" : "email"} 
          value={email} 
          onChange={e=>setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input 
          className="border rounded px-3 py-2" 
          placeholder={lang === "ko" ? "비밀번호" : "password"} 
          type="password" 
          value={pw} 
          onChange={e=>setPw(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <button 
            className="px-3 py-2 rounded border disabled:opacity-50" 
            onClick={doLogin}
            disabled={isLoading}
          >
            {isLoading ? t.login.processing : t.login.emailLogin}
          </button>
          <button 
            className="px-3 py-2 rounded border disabled:opacity-50" 
            onClick={doSignup}
            disabled={isLoading}
          >
            {t.login.signup}
          </button>
          <button 
            className="px-3 py-2 rounded border disabled:opacity-50" 
            onClick={()=>signOut()}
            disabled={isLoading}
          >
            {t.auth.logout}
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm mb-2">{t.login.orOAuth}</div>
        <div className="flex gap-2">
          {(OAUTH_PROVIDERS ?? ["google"]).map((p: string) => (
            <button 
              key={p} 
              className="px-3 py-2 rounded border disabled:opacity-50" 
              onClick={()=>doProvider(p)}
              disabled={isLoading}
            >
              {t.login.continueWith.replace("{provider}", p)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 text-sm text-blue-600 cursor-pointer underline" onClick={()=>checkSessionRef.current()}>
        {t.login.checkSession}
      </div>
      {msg && <div className="mt-4 text-sm text-rose-600">{msg}</div>}
    </div>
  );
}
