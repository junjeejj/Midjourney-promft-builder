import { create } from "zustand";
import type { User } from "../types";
import { useWalletStore } from "./useWalletStore";
import { supabase } from "../lib/supabase";

type State = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithOAuth: (provider: "google" | "github") => Promise<void>;
  checkSession: () => Promise<void>;
};

const WELCOME_BONUS_KEY = "mj.welcome_bonus.v1";
const WELCOME_BONUS_AMOUNT = 20;

const hasReceivedWelcomeBonus = (userId: string): boolean => {
  try {
    const data = localStorage.getItem(WELCOME_BONUS_KEY);
    if (!data) return false;
    const users = JSON.parse(data);
    return Array.isArray(users) && users.includes(userId);
  } catch {
    return false;
  }
};

const markWelcomeBonusReceived = (userId: string): void => {
  try {
    const data = localStorage.getItem(WELCOME_BONUS_KEY);
    const users = data ? JSON.parse(data) : [];
    if (!users.includes(userId)) {
      users.push(userId);
      localStorage.setItem(WELCOME_BONUS_KEY, JSON.stringify(users));
    }
  } catch {}
};

// Supabase가 설정되지 않았을 때 fallback으로 Mock 사용
const useSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const useAuth = create<State>((set, get) => ({
  user: null,
  loading: true,
  
  checkSession: async () => {
    if (!useSupabase) {
      set({ loading: false });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || undefined,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || undefined,
        };
        set({ user, loading: false });
        
        // 환영 보너스 체크
        if (!hasReceivedWelcomeBonus(user.id)) {
          useWalletStore.getState().addCredits(WELCOME_BONUS_AMOUNT);
          markWelcomeBonusReceived(user.id);
        }
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("세션 확인 오류:", error);
      set({ user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    if (!useSupabase) {
      // Mock login (Supabase 미설정 시)
      const userId = `user_${email}`;
      const user = { id: userId, email, name: email.split("@")[0] };
      set({ user });
      
      if (!hasReceivedWelcomeBonus(userId)) {
        useWalletStore.getState().addCredits(WELCOME_BONUS_AMOUNT);
        markWelcomeBonusReceived(userId);
      }
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || undefined,
          name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || undefined,
        };
        set({ user });
        
        // 환영 보너스 체크
        if (!hasReceivedWelcomeBonus(user.id)) {
          useWalletStore.getState().addCredits(WELCOME_BONUS_AMOUNT);
          markWelcomeBonusReceived(user.id);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "로그인에 실패했습니다.");
    }
  },

  signup: async (email: string, password: string, name?: string) => {
    if (!useSupabase) {
      // Mock signup
      const userId = `user_${email}`;
      const user = { id: userId, email, name: name || email.split("@")[0] };
      set({ user });
      
      if (!hasReceivedWelcomeBonus(userId)) {
        useWalletStore.getState().addCredits(WELCOME_BONUS_AMOUNT);
        markWelcomeBonusReceived(userId);
      }
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split("@")[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || undefined,
          name: data.user.user_metadata?.name || email.split("@")[0] || undefined,
        };
        set({ user });
        
        // 환영 보너스 지급
        if (!hasReceivedWelcomeBonus(user.id)) {
          useWalletStore.getState().addCredits(WELCOME_BONUS_AMOUNT);
          markWelcomeBonusReceived(user.id);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "회원가입에 실패했습니다.");
    }
  },

  logout: async () => {
    if (useSupabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("로그아웃 오류:", error);
      }
    }
    set({ user: null });
  },

  loginWithOAuth: async (provider: "google" | "github") => {
    if (!useSupabase) {
      // Mock OAuth
      const userId = `user_${provider}_${Date.now()}`;
      const user = { id: userId, email: `${provider}@example.com`, name: provider };
      set({ user });
      
      if (!hasReceivedWelcomeBonus(userId)) {
        useWalletStore.getState().addCredits(WELCOME_BONUS_AMOUNT);
        markWelcomeBonusReceived(userId);
      }
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || "OAuth 로그인에 실패했습니다.");
    }
  },
}));

// 앱 시작 시 세션 확인
if (typeof window !== "undefined") {
  useAuth.getState().checkSession();
  
  // Supabase 인증 상태 변경 감지
  if (useSupabase) {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || undefined,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || undefined,
        };
        useAuth.setState({ user });
      } else {
        useAuth.setState({ user: null });
      }
    });
  }
}
