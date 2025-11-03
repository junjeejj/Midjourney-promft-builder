// src/store/useAuth.ts

import { create } from "zustand";

export const OAUTH_PROVIDERS = ["google", "github"] as const;

export type OAuthProvider = typeof OAUTH_PROVIDERS[number];

export type DemoUser = {

  id: string;

  email?: string;

  displayName?: string;

  name?: string;            // 과거 코드 호환

  provider?: string;

};

export type AuthState = {

  user: DemoUser | null;

  // 기존 메서드들…

  login?: (email: string, password: string) => Promise<void>;          // 과거 alias

  logout?: () => Promise<void>;

  signup?: (email: string, password: string) => Promise<void>;

  loginWithOAuth?: (provider: string) => Promise<void>;

  signInWithPassword?: (email: string, password: string) => Promise<void>;

  signUp?: (email: string, password: string) => Promise<void>;

  signOut?: () => Promise<void>;

  signInWithProvider?: (provider: string) => Promise<void>;

  // ▼ OAuthButtons 호환 위해 추가

  oauth?: { providers: string[] };

  loginDemo?: () => Promise<void> | void;

};

export const useAuth = create<AuthState>((set, get) => ({

  user: null,

  oauth: { providers: Array.from(OAUTH_PROVIDERS) },

  loginDemo: async () => {

    set({ user: { id: "demo", displayName: "Demo User", name: "Demo User" } });

  },

  logout: async () => {

    await get().signOut?.();

    set({ user: null });

  },

  login: async (email, password) => await get().signInWithPassword?.(email, password),

  signup: async (email, password) => await get().signUp?.(email, password),

  loginWithOAuth: async (provider: string) => {

    await get().signInWithProvider?.(provider);

    // 데모 동작

    set({ user: { id: `oauth-${provider}`, name: `${provider.toUpperCase()} User`, provider } });

  },

  signInWithPassword: async (email, password) => {

    // TODO: 실제 로그인 구현

    set({ user: { id: "user", email, displayName: email.split("@")[0], name: email.split("@")[0] } });

  },

  signUp: async (email, password) => {

    // TODO: 실제 회원가입 구현

    set({ user: { id: "user", email, displayName: email.split("@")[0], name: email.split("@")[0] } });

  },

  signOut: async () => {

    set({ user: null });

  },

  signInWithProvider: async (provider: string) => {

    // TODO: 실제 OAuth 연동 (redirect 시작)

    // 지금은 데모로 즉시 로그인 처리

    set({ user: { id: `oauth-${provider}`, displayName: `${provider.toUpperCase()} User`, name: `${provider.toUpperCase()} User`, provider } });

  },

}));