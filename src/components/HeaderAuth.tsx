import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { ROUTES } from "../config/constants";
import { getLang } from "../lib/lang";
import { SITE_TEXT } from "../config/siteText";

export default function HeaderAuth() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = React.useState(false);
  const lang = getLang();
  const t = SITE_TEXT[lang];

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) {
    return (
      <Link
        to={ROUTES.LOGIN}
        className="rounded-full px-3 py-1 text-gray-700 transition hover:bg-gray-100"
      >
        {t.auth.login}
      </Link>
    );
  }

  const avatarUrl = user.avatarUrl ?? undefined;
  const fallbackInitial = user.displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-9 w-9 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm transition hover:shadow"
        aria-label={lang === "ko" ? "사용자 메뉴 열기" : "Open user menu"}
      >
        {avatarUrl && !imgError ? (
          <img 
            src={avatarUrl} 
            alt={user.displayName ?? t.auth.user} 
            className="h-full w-full object-cover"
            onError={() => {
              setImgError(true);
            }}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
            {fallbackInitial}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-gray-100 bg-white p-2 text-sm shadow-lg">
          <Link
            to={ROUTES.PROFILE}
            className="block rounded-lg px-3 py-2 text-left text-gray-700 transition hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            {t.auth.viewProfile}
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-red-500 transition hover:bg-red-50"
          >
            {t.auth.logout}
          </button>
        </div>
      )}
    </div>
  );
}

