import type { Lang } from "../config/siteText";

const KEY = "lang";

export function getLang(): Lang {
  const saved = (localStorage.getItem(KEY) || "").toLowerCase();
  if (saved === "ko" || saved === "en") return saved;
  const nav = (navigator.language || "ko").toLowerCase();
  return nav.startsWith("ko") ? "ko" : "en";
}

export function setLang(lang: Lang) {
  localStorage.setItem(KEY, lang);
  window.location.reload();
}

