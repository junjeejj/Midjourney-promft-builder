import { create } from "zustand";
import type { Wallet } from "../types";

type State = {
  wallet: Wallet;
  addCredits: (amount: number) => void;
  consumeCredits: (amount: number) => boolean;
};

const KEY = "mj.wallet.v1";
const defaultWallet: Wallet = { credits: 100, lastUpdated: Date.now() };

export const useWalletStore = create<State>((set, get) => ({
  wallet: defaultWallet,
  addCredits: (amount) => {
    const current = get().wallet;
    const updated = { credits: current.credits + amount, lastUpdated: Date.now() };
    set({ wallet: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  },
  consumeCredits: (amount) => {
    const current = get().wallet;
    if (current.credits < amount) return false;
    const updated = { credits: current.credits - amount, lastUpdated: Date.now() };
    set({ wallet: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
    return true;
  },
}));

// Load on init
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      useWalletStore.setState({ wallet: JSON.parse(stored) });
    }
  } catch {}
}




