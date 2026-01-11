// src/store/useAuth.ts

import { create } from "zustand";

import { supabase } from "../lib/supabase";

import { OAUTH_PROVIDERS, OAUTH_REDIRECT_PATH, DEMO_USER_ENABLED, DEMO_USER } from "../config/constants";



export type DemoUser = {

  id: string;

  email?: string;

  displayName?: string;

  name?: string; // 구버전 호환

  avatarUrl?: string | null;

};



export type AuthState = {

  user: DemoUser | null;

  token: string | null;

  oauth: {

    providers: string[];

  };

  // 메인 API

  signInWithPassword: (email: string, password: string) => Promise<void>;

  signUp: (email: string, password: string) => Promise<void>;

  signOut: () => Promise<void>;

  signInWithProvider: (provider: string) => Promise<void>;

  checkSession: () => Promise<void>;

  // 구버전 호환 별칭 (App/Profile 등에서 호출)

  login?: (email: string, password: string) => Promise<void>;

  signup?: (email: string, password: string) => Promise<void>;

  logout?: () => Promise<void>;

  loginWithOAuth?: (provider: string) => Promise<void>;

  // UI 보조

  loginDemo?: () => Promise<void>;

};



const mapUser = (

  session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]

) => {

  if (!session?.user) return null;

  

  const avatarUrl =

    session.user.user_metadata?.avatar_url ??

    session.user.user_metadata?.picture ??

    session.user.user_metadata?.avatar ??

    session.user.user_metadata?.photoURL ?? // Google OAuth 추가 필드

    null;

  

  return {

    id: session.user.id,

    email: session.user.email ?? undefined,

    name: session.user.user_metadata?.name,

    displayName: session.user.user_metadata?.name,

    avatarUrl,

  };

};



const isBrowser = typeof window !== "undefined";



export const useAuth = create<AuthState>((set, get) => ({

  user: null,

  token: null,



  oauth: { providers: Array.from(OAUTH_PROVIDERS) },



  async signInWithPassword(email, password) {

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);

    const session = data.session;

    // 세션을 다시 가져와서 최신 상태 보장
    const { data: sessionData } = await supabase.auth.getSession();
    const latestSession = sessionData.session || session;

    set({

      user: mapUser(latestSession),

      token: latestSession?.access_token ?? null,

    });

  },



  async signUp(email, password) {

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw new Error(error.message);

    // 회원가입 후 세션을 명시적으로 가져오기
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    set({

      user: mapUser(session),

      token: session?.access_token ?? null,

    });

  },



  async signOut() {

    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);

    set({ user: null, token: null });

    // 로그아웃 시 wallet balance 초기화
    const { useWalletStore } = await import("./useWalletStore");
    useWalletStore.getState().reset();

    // 로그아웃 이벤트 발생
    if (isBrowser) {
      window.dispatchEvent(new CustomEvent("auth:signed-out"));
    }

  },



  async signInWithProvider(provider) {

    // OAuth 콜백 후 리디렉션 URL 구성

    const redirectTo = `${window.location.origin}${OAUTH_REDIRECT_PATH}`;

    

    // OAuth provider 타입 정의
    type OAuthProvider = "google" | "github" | "discord" | "facebook" | "twitter" | "azure" | "bitbucket" | "gitlab" | "keycloak" | "linkedin" | "notion" | "twitch" | "slack" | "spotify" | "workos" | "zoom";
    
    const { data, error } = await supabase.auth.signInWithOAuth({

      provider: provider as OAuthProvider,

      options: { 

        redirectTo: redirectTo,

      },

    });

    if (error) {

      console.error("[Auth] OAuth sign in error:", error);

      // 동적 import로 i18n 사용
      const { getLang } = await import("../lib/lang");
      const { SITE_TEXT } = await import("../config/siteText");
      const lang = getLang();
      throw new Error(error.message || SITE_TEXT[lang].login.oauthFailedMessage);

    }

    // OAuth는 리다이렉트되므로 여기서는 에러만 체크

  },



  async checkSession() {

    const { data, error } = await supabase.auth.getSession();

    if (error) {

      console.error("[Auth] Session check error:", error);

      return;

    }

    const session = data.session;

    const mappedUser = mapUser(session);

    set({

      user: mappedUser,

      token: session?.access_token ?? null,

    });

  },



  // 구버전 호환 별칭

  login: async (email, pw) => get().signInWithPassword(email, pw),

  signup: async (email, pw) => get().signUp(email, pw),

  logout: async () => get().signOut(),

  loginWithOAuth: async (p) => get().signInWithProvider(p),



  // 데모 로그인(선택)

  loginDemo: DEMO_USER_ENABLED ? async () => {

    set({

      user: {

        id: DEMO_USER.id,

        displayName: DEMO_USER.displayName,

        name: DEMO_USER.name,

        email: DEMO_USER.email,

        avatarUrl: DEMO_USER.avatarUrl,

      },

      token: DEMO_USER.token,

    });

  } : undefined,

}));



if (isBrowser) {

  // 1) 앱 처음 로드될 때, 현재 세션 한 번 가져와서 전역 상태에 넣기

  supabase.auth.getSession().then(({ data, error }) => {

    if (error) {

      console.error("[Auth] Initial session load error:", error);

      return;

    }



    const session = data.session;

    const mappedUser = mapUser(session);

    useAuth.setState({

      user: mappedUser,

      token: session?.access_token ?? null,

    });

  });



  // 2) 세션이 변할 때마다 상태 즉시 반영
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("[Auth] Auth state changed:", event, session?.user?.id);
    
    const mappedUser = mapUser(session);
    const newToken = session?.access_token ?? null;

    useAuth.setState({

      user: mappedUser,

      token: newToken,

    });

    // 로그인 성공 시 이벤트 발생 (컴포넌트에서 wallet balance를 가져올 수 있도록)
    // 중복 호출 방지를 위해 한 번만 이벤트 발생
    if (event === "SIGNED_IN" && newToken && mappedUser) {
      // 상태 업데이트가 완료된 후 이벤트 발생 (debounce)
      const eventKey = `auth:signed-in:${mappedUser.id}`;
      // 타입 안전한 이벤트 플래그 관리
      const eventFlags = (window as typeof window & { __authEventFlags?: Record<string, boolean> }).__authEventFlags || {};
      if (!eventFlags[eventKey]) {
        eventFlags[eventKey] = true;
        (window as typeof window & { __authEventFlags?: Record<string, boolean> }).__authEventFlags = eventFlags;
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("auth:signed-in", { 
            detail: { user: mappedUser, token: newToken } 
          }));
          // 1초 후 플래그 제거하여 다음 로그인 시 다시 이벤트 발생 가능하도록
          setTimeout(() => {
            const flags = (window as typeof window & { __authEventFlags?: Record<string, boolean> }).__authEventFlags;
            if (flags) {
              delete flags[eventKey];
            }
          }, 1000);
        }, 100);
      }
    }

    // 로그아웃 시 이벤트 발생
    if (event === "SIGNED_OUT") {
      window.dispatchEvent(new CustomEvent("auth:signed-out"));
    }
  });

}



// Default export로 제공 (하위 호환성)
export default useAuth;