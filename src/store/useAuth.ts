// src/store/useAuth.ts
import { create } from "zustand";
import { supabase } from "../lib/supabase";

export type DemoUser = {
  id: string;
  email?: string;
  displayName?: string;
  name?: string; // 구버전 호환
};

export const OAUTH_PROVIDERS = ["google"] as const;

export type AuthState = {
  user: DemoUser | null;

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

  oauth: { providers: Array.from(OAUTH_PROVIDERS) },

  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const s = data.session;
    set({ user: s?.user ? { id: s.user.id, email: s.user.email ?? undefined, name: s.user.user_metadata?.name } : null });
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    const u = data.user;
    set({ user: u ? { id: u.id, email: u.email ?? undefined, name: u.user_metadata?.name } : null });
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    set({ user: null });
  },

  async signInWithProvider(provider) {
    // provider: 'google' 등. redirectTo는 현재 사이트로.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { redirectTo: window.location.origin }
    });
    if (error) throw new Error(error.message);
    // OAuth는 리다이렉트 플로우라 여기서 set은 생략
  },

  async checkSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) return;
    const s = data.session;
    set({ user: s?.user ? { id: s.user.id, email: s.user.email ?? undefined, name: s.user.user_metadata?.name } : null });
  },

  // 구버전 호환 별칭
  login: async (email, pw) => get().signInWithPassword(email, pw),
  signup: async (email, pw) => get().signUp(email, pw),
  logout: async () => get().signOut(),
  loginWithOAuth: async (p) => get().signInWithProvider(p),

  // 데모 로그인(선택)
  loginDemo: async () => {
    set({ user: { id: "demo", displayName: "Demo User", name: "Demo User", email: "demo@example.com" } });
  },

}));

export default useAuth;
