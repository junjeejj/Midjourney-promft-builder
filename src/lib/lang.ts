import type { Lang } from "../config/siteText";
import { useLocale } from "../store/useLocale";

const KEY = "lang";
const LOCALE_KEY = "locale.v2";

export function getLang(): Lang {
  // 먼저 lang 키 확인
  const saved = (localStorage.getItem(KEY) || "").toLowerCase();
  if (saved === "ko" || saved === "en") {
    // locale.v2도 동기화
    try {
      localStorage.setItem(LOCALE_KEY, saved);
    } catch {}
    return saved;
  }
  // locale.v2 확인
  const localeSaved = (localStorage.getItem(LOCALE_KEY) || "").toLowerCase();
  if (localeSaved === "ko" || localeSaved === "en") {
    // lang도 동기화
    try {
      localStorage.setItem(KEY, localeSaved);
    } catch {}
    return localeSaved;
  }
  // 둘 다 없으면 브라우저 언어로 결정
  const nav = (navigator.language || "ko").toLowerCase();
  const defaultLang = nav.startsWith("ko") ? "ko" : "en";
  try {
    localStorage.setItem(KEY, defaultLang);
    localStorage.setItem(LOCALE_KEY, defaultLang);
  } catch {}
  return defaultLang;
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
    localStorage.setItem(LOCALE_KEY, lang);
    // useLocale store도 업데이트
    useLocale.getState().setLocale(lang);
  } catch {}
  window.location.reload();
}

