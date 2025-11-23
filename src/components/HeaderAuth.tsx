import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { ROUTES } from "../config/constants";

export default function HeaderAuth() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

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
        로그인
      </Link>
    );
  }

  const avatarUrl = user.avatarUrl ?? undefined;
  const fallbackInitial = user.displayName?.[0]?.toUpperCase() ?? "U";
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-9 w-9 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm transition hover:shadow"
        aria-label="사용자 메뉴 열기"
      >
        {avatarUrl && !imgError ? (
          <img 
            src={avatarUrl} 
            alt={user.displayName ?? "사용자"} 
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
            내 정보 보기
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-red-500 transition hover:bg-red-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

