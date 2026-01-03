import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getLang, setLang } from "../lib/lang";
import { NAV_ITEMS, SITE_TEXT } from "../config/siteText";

export default function SiteHeader() {
  const loc = useLocation();
  const lang = getLang();
  const t = SITE_TEXT[lang];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/builder" className="flex items-baseline gap-2">
          <div className="text-xl font-bold">{t.siteName}</div>
          <div className="text-sm text-gray-500">{t.brandLine}</div>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {NAV_ITEMS.map((it) => {
            const active = loc.pathname === it.to || (it.to !== "/" && loc.pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={[
                  "px-3 py-2 rounded-xl text-sm border transition",
                  active ? "bg-gray-900 text-white border-gray-900" : "bg-white hover:bg-gray-50",
                ].join(" ")}
              >
                {t.nav[it.key]}
              </Link>
            );
          })}
          <button
            className="px-3 py-2 rounded-xl text-sm border bg-white hover:bg-gray-50 transition"
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            title="Language"
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <div className="font-medium text-gray-900">{lang === "ko" ? "안내" : "Notice"}</div>
        <p className="mt-1 leading-relaxed">{t.disclaimerLong}</p>
      </div>
    </div>
  );
}

