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
    set({
      user: mapUser(session),
      token: session?.access_token ?? null,
    });
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    const session = (await supabase.auth.getSession()).data.session;
    set({
      user: mapUser(session),
      token: session?.access_token ?? null,
    });
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    set({ user: null, token: null });
  },

  async signInWithProvider(provider) {
    // Supabase URL 유효성 확인
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      throw new Error("Supabase가 설정되지 않았습니다. 환경 변수를 확인해주세요.");
    }

    // Supabase URL이 유효한 형식인지 확인
    try {
      new URL(supabaseUrl);
    } catch {
      throw new Error(`Supabase URL이 유효하지 않습니다: ${supabaseUrl}`);
    }

    // OAuth 콜백 후 리디렉션 URL 구성
    const redirectTo = `${window.location.origin}${OAUTH_REDIRECT_PATH}`;
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: { 
          redirectTo: redirectTo,
        },
      });
      
      if (error) {
        console.error("[Auth] OAuth sign in error:", error);
        
        // 네트워크 오류인 경우
        if (error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("Failed to fetch")) {
          throw new Error(`Supabase 서버에 연결할 수 없습니다. URL을 확인해주세요: ${supabaseUrl}`);
        }
        
        throw new Error(error.message || "OAuth 로그인에 실패했습니다.");
      }
      
      // OAuth는 리다이렉트되므로 여기서는 에러만 체크
      // data.url이 있으면 리다이렉트가 시작됨
      if (data?.url) {
        console.log("[Auth] OAuth redirect initiated to:", data.url);
      }
    } catch (err: any) {
      // 네트워크 오류 처리
      if (err?.message?.includes("Failed to fetch") || err?.message?.includes("network") || err?.code === "ERR_NETWORK") {
        throw new Error(`Supabase 서버(${supabaseUrl})에 연결할 수 없습니다. 프로젝트가 활성화되어 있는지 확인해주세요.`);
      }
      
      // 기존 에러 메시지가 있으면 그대로 사용
      if (err?.message) {
        throw err;
      }
      
      throw new Error("OAuth 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
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
    const mappedUser = mapUser(session);
    useAuth.setState({
      user: mappedUser,
      token: session?.access_token ?? null,
    });
  });
}

export default useAuth;
