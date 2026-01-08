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

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,

  oauth: { providers: Array.from(OAUTH_PROVIDERS) },

  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const s = data.session;
    const avatarUrl = s?.user?.user_metadata?.avatar_url ?? s?.user?.user_metadata?.picture ?? s?.user?.user_metadata?.avatar ?? null;
    set({
      user: s?.user ? { 
        id: s.user.id, 
        email: s.user.email ?? undefined, 
        name: s.user.user_metadata?.name,
        displayName: s.user.user_metadata?.name,
        avatarUrl
      } : null,
      token: s?.access_token ?? null,
    });
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    const u = data.user;
    const session = (await supabase.auth.getSession()).data.session;
    const avatarUrl = u?.user_metadata?.avatar_url ?? u?.user_metadata?.picture ?? u?.user_metadata?.avatar ?? null;
    set({
      user: u ? { 
        id: u.id, 
        email: u.email ?? undefined, 
        name: u.user_metadata?.name,
        displayName: u.user_metadata?.name,
        avatarUrl
      } : null,
      token: session?.access_token ?? null,
    });
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    set({ user: null, token: null });
  },

  async signInWithProvider(provider) {
    // provider: 'google' 등. redirectTo는 현재 사이트로.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { redirectTo: `${window.location.origin}/login` }
    });
    if (error) throw new Error(error.message);
    // OAuth는 리다이렉트 플로우라 여기서 set은 생략
  },

  async checkSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) return;
    const s = data.session;
    const avatarUrl = s?.user?.user_metadata?.avatar_url ?? s?.user?.user_metadata?.picture ?? s?.user?.user_metadata?.avatar ?? null;
    set({
      user: s?.user ? { 
        id: s.user.id, 
        email: s.user.email ?? undefined, 
        name: s.user.user_metadata?.name,
        displayName: s.user.user_metadata?.name,
        avatarUrl
      } : null,
      token: s?.access_token ?? null,
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
      user: { id: "demo", displayName: "Demo User", name: "Demo User", email: "demo@example.com" },
      token: "demo-token",
    });
  },

}));

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  // 앱 처음 로드될 때, 현재 세션 한 번 가져와서 전역 상태에 넣기
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) return;
    const s = data.session;
    const avatarUrl = s?.user?.user_metadata?.avatar_url ?? s?.user?.user_metadata?.picture ?? s?.user?.user_metadata?.avatar ?? null;
    useAuth.setState({
      user: s?.user ? { 
        id: s.user.id, 
        email: s.user.email ?? undefined, 
        name: s.user.user_metadata?.name,
        displayName: s.user.user_metadata?.name,
        avatarUrl
      } : null,
      token: s?.access_token ?? null,
    });
  });

  // 세션이 변할 때마다 상태 즉시 반영
  supabase.auth.onAuthStateChange((event, session) => {
    const avatarUrl = session?.user?.user_metadata?.avatar_url ?? session?.user?.user_metadata?.picture ?? session?.user?.user_metadata?.avatar ?? null;
    useAuth.setState({
      user: session?.user ? { 
        id: session.user.id, 
        email: session.user.email ?? undefined, 
        name: session.user.user_metadata?.name,
        displayName: session.user.user_metadata?.name,
        avatarUrl
      } : null,
      token: session?.access_token ?? null,
    });
  });
}

export default useAuth;
