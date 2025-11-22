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
      const r = await fetch(API_ENDPOINTS.CREDITS_SPEND, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, reason }),
      });
      const j = await r.json();
      if (!r.ok) {
        return { ok: false };
      }
      if (typeof j.balance === "number") {
        set({ balance: j.balance });
      } else if (amount) {
        set((s) => ({ balance: Math.max(0, s.balance - amount) }));
      }
      return { ok: true, balance: j.balance };
    } catch (err) {
      console.error("[Wallet] spend failed", err);
      return { ok: false };
    }
  },
  setBalance(value) {
    set({ balance: value });
  },
}));

