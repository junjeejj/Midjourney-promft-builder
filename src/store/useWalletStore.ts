import { create } from "zustand";

type WalletState = {
  balance: number;
  loading: boolean;
  fetchBalance: (userId: string) => Promise<void>;
  spend: (userId: string, amount: number, token: string, reason?: string) => Promise<boolean>;
};

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  loading: false,
  fetchBalance: async (userId: string) => {
    set({ loading: true });
    try {
      const r = await fetch(`/api/credits/balance?userId=${userId}`);
      const j = await r.json();
      set({ balance: j.balance ?? 0 });
    } finally {
      set({ loading: false });
    }
  },
  spend: async (userId, amount, token, reason = "prompt") => {
    const r = await fetch(`/api/credits/spend`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, amount, reason }),
    });
    if (r.ok) {
      set((s) => ({ balance: Math.max(0, s.balance - amount) }));
      return true;
    }
    return false;
  },
}));

