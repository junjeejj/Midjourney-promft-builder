import { create } from "zustand";



type WalletState = {

  balance: number;

  loading: boolean;

  fetchBalance: (token: string) => Promise<void>;

  spend: (amount: number, token: string, reason?: string) => Promise<{ ok: boolean; balance?: number }>;

  setBalance: (value: number) => void;

};



export const useWalletStore = create<WalletState>((set) => ({

  balance: 0,

  loading: false,

  async fetchBalance(token: string) {

    set({ loading: true });

    try {

      const { API_ENDPOINTS } = await import("../config/constants");

      const r = await fetch(API_ENDPOINTS.CREDITS_BALANCE, {

        headers: { Authorization: `Bearer ${token}` },

      });

      const j = await r.json();

      if (r.ok) {

        set({ balance: j.balance ?? 0 });

      } else {

        console.warn("[Wallet] balance fetch error", j);

      }

    } catch (err) {

      console.error("[Wallet] balance fetch failed", err);

    } finally {

      set({ loading: false });

    }

  },

  async spend(amount, token, reason = "prompt") {

    try {

      const { API_ENDPOINTS } = await import("../config/constants");

      console.log("[Wallet] spending credits", { amount, reason, endpoint: API_ENDPOINTS.CREDITS_SPEND });

      const r = await fetch(API_ENDPOINTS.CREDITS_SPEND, {

        method: "POST",

        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },

        body: JSON.stringify({ amount, reason }),

      });

      const j = await r.json();

      console.log("[Wallet] spend response", { status: r.status, ok: r.ok, body: j });

      if (!r.ok) {

        console.error("[Wallet] spend API error", { status: r.status, error: j });

        return { ok: false, error: j.error || j.message || "Unknown error" };

      }

      if (typeof j.balance === "number") {

        set({ balance: j.balance });

        console.log("[Wallet] balance updated to", j.balance);

      } else if (amount) {

        // 폴백: API에서 balance를 반환하지 않으면 클라이언트에서 차감

        set((s) => ({ balance: Math.max(0, s.balance - amount) }));

        console.log("[Wallet] balance updated (fallback)");

      }

      return { ok: true, balance: j.balance };

    } catch (err) {

      console.error("[Wallet] spend failed", err);

      return { ok: false, error: err instanceof Error ? err.message : "Network error" };

    }

  },

  setBalance(value) {

    set({ balance: value });

  },

}));
