import { create } from "zustand";



type WalletState = {

  balance: number;

  loading: boolean;

  error: string | null;

  fetchBalance: (token: string) => Promise<void>;

  spend: (amount: number, token: string, reason?: string) => Promise<{ ok: boolean; balance?: number }>;

  setBalance: (value: number) => void;

  reset: () => void;

};

// 중복 호출 방지를 위한 전역 변수
let fetchingBalance = false;
let lastFetchToken: string | null = null;
let lastFetchTime = 0;
const FETCH_DEBOUNCE_MS = 500; // 500ms 내 중복 호출 방지



export const useWalletStore = create<WalletState>((set, get) => ({

  balance: 0,

  loading: false,

  error: null,

  async fetchBalance(token: string) {

    // 중복 호출 방지: 같은 토큰으로 500ms 내에 호출되면 무시
    const now = Date.now();
    if (fetchingBalance && lastFetchToken === token && (now - lastFetchTime) < FETCH_DEBOUNCE_MS) {
      console.log("[Wallet] Duplicate fetchBalance call ignored");
      return;
    }

    fetchingBalance = true;
    lastFetchToken = token;
    lastFetchTime = now;

    set({ loading: true, error: null });

    try {

      const { API_ENDPOINTS } = await import("../config/constants");

      const r = await fetch(API_ENDPOINTS.CREDITS_BALANCE, {

        headers: { Authorization: `Bearer ${token}` },

      });

      const j = await r.json();

      if (r.ok) {

        set({ balance: j.balance ?? 0, error: null });

      } else {

        // 동적 import로 i18n 사용
        const { getLang } = await import("../lib/lang");
        const { SITE_TEXT } = await import("../config/siteText");
        const lang = getLang();
        const errorMsg = j.error || j.message || SITE_TEXT[lang].wallet.fetchError;
        console.warn("[Wallet] balance fetch error", j);
        set({ error: errorMsg });
        
        // 사용자에게 에러 표시 (조용히, 너무 자주 표시하지 않도록)
        if (j.error && !j.error.includes("401") && !j.error.includes("403")) {
          // 인증 에러가 아닌 경우에만 표시
          console.error("[Wallet] Balance fetch failed:", errorMsg);
        }

      }

    } catch (err) {

      // 동적 import로 i18n 사용
      const { getLang } = await import("../lib/lang");
      const { SITE_TEXT } = await import("../config/siteText");
      const lang = getLang();
      const errorMsg = err instanceof Error ? err.message : SITE_TEXT[lang].wallet.networkError;
      console.error("[Wallet] balance fetch failed", err);
      set({ error: errorMsg });

    } finally {

      set({ loading: false });
      fetchingBalance = false;

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

  reset() {

    set({ balance: 0, loading: false, error: null });
    fetchingBalance = false;
    lastFetchToken = null;
    lastFetchTime = 0;

  },

}));
