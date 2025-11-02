import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface DemoUser {
  id: string;
  email: string;
}

interface AuthState {
  user: DemoUser | null;
  loading: boolean;
  error: string | null;
  signInWithProvider: (provider?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// 데모 빌드용 스텁 (실제 인증 동작 없음)
export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

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
        data &&
        (data as any).session &&
        (data as any).session.user
          ? (data as any).session.user
          : null;

      if (sessionUser) {
        set({
          user: {
            id: sessionUser.id || "",
            email: sessionUser.email || "",
          },
          loading: false,
          error: null,
        });
      } else {
        set({ user: null, loading: false, error: null });
      }
    } catch (err: any) {
      set({
        user: null,
        loading: false,
        error: "session check failed in demo mode",
      });
    }
  },
}));
