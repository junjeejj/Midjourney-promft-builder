// src/pages/Login.tsx
import { useState, useEffect } from "react";
import useAuth from "../store/useAuth";
import { ROUTES, OAUTH_PROVIDERS } from "../config/constants";

export default function Login() {
  const { signInWithPassword, signUp, signInWithProvider, signOut, user, checkSession } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // OAuth 콜백 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("code")) {
      // OAuth 콜백으로 돌아온 경우 세션 확인
      checkSession();
      // URL 정리
      const cleaned = new URL(window.location.href);
      ["code", "state", "error", "error_code", "error_description"].forEach((k) =>
        cleaned.searchParams.delete(k)
      );
      window.history.replaceState({}, document.title, cleaned.toString());
    } else {
      // 일반 페이지 진입 시 세션 확인
      checkSession();
    }
  }, [checkSession]);

  // 로그인 성공 시 리다이렉트
  useEffect(() => {
    if (user && window.location.pathname === ROUTES.LOGIN) {
      window.location.href = ROUTES.HOME;
    }
  }, [user]);

  async function doLogin() {
    try { setMsg(null); await signInWithPassword(email, pw); setMsg("로그인 성공"); }
    catch (e: any) { setMsg(e?.message || "로그인 실패"); }
  }
  async function doSignup() {
    try { setMsg(null); await signUp(email, pw); setMsg("회원가입 성공. 이메일 확인 필요할 수 있음"); }
    catch (e: any) { setMsg(e?.message || "회원가입 실패"); }
  }
  async function doProvider(p: string) {
    try { setMsg(null); await signInWithProvider(p); setMsg("리다이렉트 중…"); }
    catch (e: any) { setMsg(e?.message || "OAuth 실패"); }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <div className="mb-3 text-sm opacity-70">세션: {user ? `${user.email ?? user.id}` : "(없음)"}</div>
      <div className="flex flex-col gap-2">
        <input className="border rounded px-3 py-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded border" onClick={doLogin}>이메일 로그인</button>
          <button className="px-3 py-2 rounded border" onClick={doSignup}>회원가입</button>
          <button className="px-3 py-2 rounded border" onClick={()=>signOut()}>로그아웃</button>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm mb-2">또는 OAuth:</div>
        <div className="flex gap-2">
          {(OAUTH_PROVIDERS ?? ["google"]).map((p: string) => (
            <button key={p} className="px-3 py-2 rounded border" onClick={()=>doProvider(p)}>
              Continue with {p}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 text-sm text-blue-600 cursor-pointer underline" onClick={()=>checkSession()}>세션 다시 확인</div>
      {msg && <div className="mt-4 text-sm text-rose-600">{msg}</div>}
    </div>
  );
}
