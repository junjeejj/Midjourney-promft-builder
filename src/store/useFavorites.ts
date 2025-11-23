import { create } from "zustand";

type State = {
  favorites: string[];
  toggle: (keyword: string) => void;
  load: () => void;
};

const KEY = "mj.favorites.v1";

export const useFavorites = create<State>((set, get) => ({
  favorites: [],
  load: () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) set({ favorites: JSON.parse(raw) });
    } catch {}
  },
  toggle: (keyword) => {
    const current = get().favorites;
    const updated = current.includes(keyword)
      ? current.filter((k) => k !== keyword)
      : [...current, keyword];
    set({ favorites: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  },
}));














