import React from "react";
import { useAuth } from "../store/useAuth";

export default function HeaderAuth() {
  const { user, signInWithProvider, signOut } = useAuth();

  if (!user) {
    return (
      <button
        className="rounded-full px-3 py-1 text-gray-700 transition hover:bg-gray-100"
        onClick={() => signInWithProvider("google")}
      >
        Google로 로그인
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span>{user.email ?? user.displayName ?? "사용자"}</span>
      <button
        onClick={() => signOut()}
        className="rounded-full px-2 py-1 text-red-500 transition hover:bg-red-50"
      >
        로그아웃
      </button>
    </div>
  );
}

