import { create } from "zustand";

export type Defaults = {
  ar?: string | null;
  style?: string | null;
  stylize?: number | null;
  chaos?: number | null;
  q?: 0.5 | 1 | 2 | null;
  seed?: number | null;
  tile?: boolean | null;
  niji?: boolean | null;
  sref?: string | null;
  cref?: string | null;
  no?: string[] | null;
  stop?: number | null;
  repeat?: number | null;
  version?: string | null;
  stealth?: boolean | null;
  oref?: string | null;
  ow?: number | null;
  profile?: string | null;
  iw?: number | null;
  weird?: number | null;
  draft?: boolean | null;
  raw?: boolean | null;
};

type State = {
  defaults: Defaults;
  load: () => void;
  save: (next: Partial<Defaults>) => void;
  reset: () => void;
};

const KEY = "mj.defaults.v1";

const fallback: Defaults = {
  ar: null,
  style: null,
  stylize: 100,
  chaos: 0,
  q: 1,
  seed: null,
  tile: null,
  niji: null,
  sref: null,
  cref: null,
  no: null,
  stop: null,
  repeat: null,
  version: null,
  stealth: null,
  oref: null,
  ow: 100,
  profile: null,
  iw: 1,
  weird: null,
  draft: null,
  raw: null,
};

export const useDefaults = create<State>((set, get) => ({
  defaults: fallback,
  load: () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed: Defaults = JSON.parse(raw);
      set({ defaults: { ...fallback, ...parsed } });
    } catch {}
  },
  save: (next) => {
    const merged = { ...get().defaults, ...next };
    set({ defaults: merged });
    try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {}
  },
  reset: () => {
    set({ defaults: fallback });
    try { localStorage.removeItem(KEY); } catch {}
  },
}));

