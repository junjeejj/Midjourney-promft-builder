// src/pages/Login.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";
import { supabase } from "../lib/supabase";
import { OAUTH_PROVIDERS, TIMEOUTS, ROUTES } from "../config/constants";

export default function Login() {
  const { signInWithPassword, signUp, signInWithProvider, signOut, user, checkSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const oauthProcessingRef = useRef(false);

  // OAuth 콜백 처리 및 로그인 상태 확인
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const currentUrl = new URL(window.location.href);
      const hasCode = currentUrl.searchParams.has("code");
      const hasError = currentUrl.searchParams.has("error");

      // OAuth 에러 처리
      if (hasError) {
        const errorDesc = currentUrl.searchParams.get("error_description") || 
                         currentUrl.searchParams.get("error") || 
                         "OAuth 로그인 중 오류가 발생했습니다.";
        setMsg(errorDesc);
        // URL 정리
        const cleaned = new URL(window.location.href);
        ["code", "state", "error", "error_code", "error_description"].forEach((k) =>
          cleaned.searchParams.delete(k)
        );
        window.history.replaceState({}, document.title, cleaned.toString());
        return;
      }

      // OAuth 콜백으로 돌아온 경우
      if (hasCode && !oauthProcessingRef.current) {
        oauthProcessingRef.current = true;
        setMsg("로그인 처리 중...");
        
        try {
          // Supabase가 자동으로 세션을 처리했는지 확인
          let { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          // 세션이 없으면 코드를 세션으로 교환
          if (!sessionData.session) {
            const code = currentUrl.searchParams.get("code");
            if (code) {
              // Supabase는 전체 URL을 전달받아야 함
              const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
              if (error) {
                console.error("[Login] Exchange error:", error);
                setMsg(error.message || "OAuth 코드 교환에 실패했습니다.");
                oauthProcessingRef.current = false;
                return;
              }
              sessionData = data;
            }
          }

          if (sessionData?.session) {
            // 세션이 있으면 상태 동기화
            await checkSession();
            setMsg("로그인 완료! 메인 화면으로 이동합니다.");
            
            // URL 정리
            const cleaned = new URL(window.location.href);
            ["code", "state", "error", "error_code", "error_description"].forEach((k) =>
              cleaned.searchParams.delete(k)
            );
            window.history.replaceState({}, document.title, cleaned.toString());
            
            setTimeout(() => {
              navigate(ROUTES.HOME);
              oauthProcessingRef.current = false;
            }, TIMEOUTS.LOGIN_REDIRECT);
          } else {
            setMsg("세션을 생성할 수 없습니다. 다시 시도해주세요.");
            oauthProcessingRef.current = false;
          }
        } catch (err: any) {
          console.error("[Login] OAuth callback error:", err);
          setMsg(err?.message || "OAuth 처리 중 오류가 발생했습니다.");
          oauthProcessingRef.current = false;
        }
      } else if (!hasCode) {
        // 일반 페이지 최초 진입 시 현재 세션만 확인
        checkSession();
      }
    };

    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // onAuthStateChange 이벤트 구독 (OAuth 콜백 처리 - 폴백)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUrl = new URL(window.location.href);
      const hasCode = currentUrl.searchParams.has("code");
      
      // OAuth 콜백으로 돌아온 경우에만 처리 (이미 처리 중이 아닐 때만)
      if (event === "SIGNED_IN" && session && hasCode && !oauthProcessingRef.current) {
        oauthProcessingRef.current = true;
        await checkSession();
        setMsg("로그인 완료! 메인 화면으로 이동합니다.");
        
        // URL 정리
        const cleaned = new URL(window.location.href);
        ["code", "state", "error", "error_code", "error_description"].forEach((k) =>
          cleaned.searchParams.delete(k)
        );
        window.history.replaceState({}, document.title, cleaned.toString());
        
        setTimeout(() => {
          navigate(ROUTES.HOME);
          oauthProcessingRef.current = false;
        }, TIMEOUTS.LOGIN_REDIRECT);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession, navigate]);

  // 로그인 성공 시 리다이렉트 (폴백)
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate(ROUTES.HOME);
      }, TIMEOUTS.USER_REDIRECT);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  async function doLogin() {
    try { setMsg(null); await signInWithPassword(email, pw); setMsg("로그인 성공"); }
    catch (e: any) { setMsg(e?.message || "로그인 실패"); }
  }
  async function doSignup() {
    try { setMsg(null); await signUp(email, pw); setMsg("회원가입 성공. 이메일 확인 필요할 수 있음"); }
    catch (e: any) { setMsg(e?.message || "회원가입 실패"); }
  }
  async function doProvider(p: string) {
    try { 
      setMsg(null); 
      await signInWithProvider(p); 
      setMsg("리다이렉트 중…"); 
    }
    catch (e: any) { 
      console.error("OAuth error:", e);
      setMsg(e?.message || "OAuth 로그인에 실패했습니다. 다시 시도해주세요."); 
    }
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
          {OAUTH_PROVIDERS.map(p=>(
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

