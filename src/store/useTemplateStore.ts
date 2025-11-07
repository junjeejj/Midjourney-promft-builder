import { create } from "zustand";
import type { TemplateItem, Slots, MJParams } from "../types";

type State = {
  templates: TemplateItem[];
  load: () => void;
  save: (t: Omit<TemplateItem, "id" | "createdAt">) => void;
  update: (id: string, t: Partial<TemplateItem>) => void;
  delete: (id: string) => void;
  toggleFavorite: (id: string) => void;
  importJSON: (json: string) => boolean;
  exportJSON: () => string;
};

const KEY = "mj.templates.v1";

export const useTemplateStore = create<State>((set, get) => ({
  templates: [],
  load: () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) set({ templates: JSON.parse(raw) });
    } catch {}
  },
  save: (t) => {
    const newT: TemplateItem = {
      ...t,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    const updated = [...get().templates, newT];
    set({ templates: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  },
  update: (id, t) => {
    const updated = get().templates.map((x) => (x.id === id ? { ...x, ...t } : x));
    set({ templates: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  },
  delete: (id) => {
    const updated = get().templates.filter((x) => x.id !== id);
    set({ templates: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  },
  toggleFavorite: (id) => {
    const updated = get().templates.map((x) =>
      x.id === id ? { ...x, isFavorite: !x.isFavorite } : x
    );
    set({ templates: updated });
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  },
  importJSON: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        set({ templates: parsed });
        localStorage.setItem(KEY, json);
        return true;
      }
    } catch {}
    return false;
  },
  exportJSON: () => JSON.stringify(get().templates),
}));








