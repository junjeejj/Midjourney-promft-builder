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
  oauth: { providers: string[] };
  loginDemo?: () => Promise<void>;
};

const mapUser = (
  session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]
) =>
  session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? undefined,
        name: session.user.user_metadata?.name,
        displayName: session.user.user_metadata?.name,
        avatarUrl:
          session.user.user_metadata?.avatar_url ??
          session.user.user_metadata?.picture ??
          session.user.user_metadata?.avatar ??
          null,
      }
    : null;

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
    // OAuth 콜백 후 리디렉션 URL 구성
    const redirectTo = `${window.location.origin}${OAUTH_REDIRECT_PATH}`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { 
        redirectTo: redirectTo,
      },
    });
    if (error) {
      console.error("[Auth] OAuth sign in error:", error);
      throw new Error(error.message || "OAuth 로그인에 실패했습니다.");
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
    // 세션 체크 후 디버그 로그
    if (mappedUser) {
      console.log("[Auth] Session found:", mappedUser.email || mappedUser.id);
    } else {
      console.log("[Auth] No active session");
    }
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

    if (mappedUser) {
      console.log("[Auth] Initial session loaded:", mappedUser.email || mappedUser.id);
    } else {
      console.log("[Auth] No initial session");
    }
  });

  // 2) 세션이 변할 때마다 상태 즉시 반영
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("[Auth] Auth state changed:", event, session?.user?.email || "no user");
    const mappedUser = mapUser(session);
    useAuth.setState({
      user: mappedUser,
      token: session?.access_token ?? null,
    });
  });
}

export default useAuth;
