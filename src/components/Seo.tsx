import { useEffect } from "react";
import { getLang } from "../lib/lang";
import { SITE_TEXT } from "../config/siteText";

type Props = {
  title?: string;        // 페이지 타이틀(짧게)
  description?: string;  // 페이지 설명
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  } else {
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  }
}

export default function Seo({ title, description }: Props) {
  useEffect(() => {
    const lang = getLang();
    const base = SITE_TEXT[lang].seo;
    const fullTitle = title ? `${title} | ${SITE_TEXT[lang].siteName}` : base.defaultTitle;
    const desc = description || base.defaultDescription;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: desc });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: base.keywords });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: desc });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: desc });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
  }, [title, description]);

  return null;
}







