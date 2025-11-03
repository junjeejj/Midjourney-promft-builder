import { create } from "zustand";

// ⬅ 기존 v1을 v2로 올려서, 예전에 저장된 'ko' 기본값 영향 제거

const KEY = "locale.v2";

const initial = ((): "en"|"ko" => {

  try {

    const saved = localStorage.getItem(KEY);

    if (saved === "en" || saved === "ko") return saved as any;

    // ✅ 기본을 영어로

    return "en";

  } catch {

    return "en";

  }

})();

export const useLocale = create<{

  locale: "en"|"ko";

  setLocale: (l:"en"|"ko")=>void;

}>((set)=>({

  locale: initial,

  setLocale(l){

    try { localStorage.setItem(KEY, l); } catch {}

    set({ locale: l });

  },

}));