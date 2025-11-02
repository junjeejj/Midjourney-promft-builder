import { create } from "zustand";
import { supabase } from "../lib/supabase";

// App.tsx / Profile.tsx 호환용: name 접근이 있어 optional로 둠
interface DemoUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: DemoUser | null;
  loading: boolean;
  error: string | null;

  // 주 구현(스텁)
  signInWithProvider: (provider?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;

  // ✅ 기존 코드 호환용 별칭들
  loginWithOAuth: (provider?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 데모 빌드용 스텁 (실제 인증 동작 없음)
export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  // ===== 주 구현(스텁) =====
  signInWithProvider: async (_provider?: string) => {
    set({ error: "auth not implemented in demo build" });
  },

  signInWithPassword: async (_email: string, _password: string) => {
    set({ error: "password login not implemented in demo build" });
  },

  signUp: async (_email: string, _password: string) => {
    set({ error: "sign up not implemented in demo build" });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  checkSession: async () => {
    set({ loading: true });
    try {
      const { data } = await supabase.auth.getSession();
      const sessionUser =
        data && (data as any).session && (data as any).session.user
          ? (data as any).session.user
          : null;

      if (sessionUser) {
        set({
          user: {
            id: sessionUser.id || "",
            email: sessionUser.email || "",
            name: sessionUser.name || undefined,
          },
          loading: false,
          error: null,
        });
      } else {
        set({ user: null, loading: false, error: null });
      }
    } catch (_err: any) {
      set({
        user: null,
        loading: false,
        error: "session check failed in demo mode",
      });
    }
  },

  // ===== ✅ 기존 코드 호환용 별칭 구현 =====
  loginWithOAuth: async (provider?: string) => {
    return get().signInWithProvider(provider);
  },
  login: async (email: string, password: string) => {
    return get().signInWithPassword(email, password);
  },
  signup: async (email: string, password: string) => {
    return get().signUp(email, password);
  },
  logout: async () => {
    return get().signOut();
  },
}));
