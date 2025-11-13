// src/store/useAuth.ts
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export type DemoUser = {
  id: string;
  email?: string;
  displayName?: string;
  name?: string; // 구버전 호환
  avatarUrl?: string | null;
};

export const OAUTH_PROVIDERS = ["google"] as const;

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
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { 
        redirectTo: `${window.location.origin}/login`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
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
    if (error) return;
    const session = data.session;
    set({
      user: mapUser(session),
      token: session?.access_token ?? null,
    });
  },

  // 구버전 호환 별칭
  login: async (email, pw) => get().signInWithPassword(email, pw),
  signup: async (email, pw) => get().signUp(email, pw),
  logout: async () => get().signOut(),
  loginWithOAuth: async (p) => get().signInWithProvider(p),

  // 데모 로그인(선택)
  loginDemo: async () => {
    set({
      user: {
        id: "demo",
        displayName: "Demo User",
        name: "Demo User",
        email: "demo@example.com",
        avatarUrl: null,
      },
      token: "demo-token",
    });
  },
}));

if (isBrowser) {
  const currentUrl = new URL(window.location.href);
  const hasCodeParam = currentUrl.searchParams.has("code");
  const hasAccessTokenFragment = currentUrl.hash.includes("access_token=");

  if (hasCodeParam) {
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch (err) {
        console.error("[Supabase] OAuth exchange failed", err);
      } finally {
        const cleanedUrl = new URL(window.location.href);
        ["code", "state"].forEach((key) => cleanedUrl.searchParams.delete(key));
        window.history.replaceState({}, document.title, cleanedUrl.toString());
      }
    })();
  } else if (hasAccessTokenFragment) {
    // implicit flow: Supabase JS hydrates from the hash on client init.
    setTimeout(() => {
      const cleanedUrl = new URL(window.location.href);
      cleanedUrl.hash = "";
      window.history.replaceState({}, document.title, cleanedUrl.toString());
    }, 0);
  }

  supabase.auth.getSession().then(({ data }) => {
    const session = data.session;
    useAuth.setState({
      user: mapUser(session),
      token: session?.access_token ?? null,
    });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuth.setState({
      user: mapUser(session),
      token: session?.access_token ?? null,
    });
  });
}

export default useAuth;
