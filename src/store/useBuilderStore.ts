import { create } from "zustand";
import type { Slots, MJParams } from "../types";
import { buildPrompt, applyDefaultsToParams, type Params } from "../lib/promptAssembler";

type State = {
  currentStep: number;
  slots: Slots;
  params: Params;
  setStep: (n: number) => void;
  updateSlots: (next: Partial<Slots>) => void;
  updateParams: (next: Partial<Params>) => void;
  setSlots: (next: Partial<Slots>) => void;
  setParams: (next: Partial<Params>) => void;
  applyTemplate: (slots: Slots, params: MJParams) => void;
  reset: () => void;
  getPrompt: () => string;
};

const defaultSlots: Slots = {};
const defaultParams: Params = {};

export const useBuilderStore = create<State>((set, get) => ({
  currentStep: 0,
  slots: defaultSlots,
  params: defaultParams,
  setStep: (n) => set({ currentStep: n }),
  updateSlots: (next) => set({ slots: { ...get().slots, ...next } }),
  updateParams: (next) => set({ params: { ...get().params, ...next } }),
  setSlots: (next) => set({ slots: { ...get().slots, ...next } }),
  setParams: (next) => set({ params: { ...get().params, ...next } }),
  applyTemplate: (slots, params) => {
    const merged = applyDefaultsToParams(params as Params, {}, undefined);
    set({ slots, params: merged });
  },
  reset: () => set({ slots: defaultSlots, params: defaultParams, currentStep: 0 }),
  getPrompt: () => buildPrompt(get().slots, get().params),
}));






