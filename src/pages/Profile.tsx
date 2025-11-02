import React, { useState } from "react";
import { useAuth } from "../store/useAuth";

export default function Profile() {
  const {
    user,
    login,
    signup,
    logout,
    loginWithOAuth,
    signInWithPassword,
    signUp,
    signOut,
    signInWithProvider,
    loading,
  } = useAuth() as any;
  
  // 별칭 래퍼 4개
  const doLogin = login ?? signInWithPassword;
  const doSignup = signup ?? signUp;
  const doLogout = logout ?? signOut;
  const doLoginWithOAuth = loginWithOAuth ?? signInWithProvider;
  
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  
  // 사용자 표시 이름 안전하게 처리
  const displayName = user?.name ?? user?.email ?? "";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingAuth(true);

    try {
      if (isSignup) {
        await doSignup(email, password);
      } else {
        await doLogin(email, password);
      }
      // 성공 시 폼 초기화
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    try {
      await doLoginWithOAuth(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth 로그인에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">내 정보</h1>
        <div className="border rounded-lg p-6">
          <div className="mb-2">이메일: {user.email}</div>
          <div className="mb-4">이름: {displayName}</div>
          <button 
            onClick={doLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{isSignup ? "회원가입" : "로그인"}</h1>
      <div className="border rounded-lg p-6 max-w-md">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setIsSignup(false);
              setError(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg ${
              !isSignup ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setIsSignup(true);
              setError(null);
            }}
            className={`flex-1 px-4 py-2 rounded-lg ${
              isSignup ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="이름 (선택사항)"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="이메일"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="비밀번호 (최소 6자)"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingAuth}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loadingAuth ? "처리 중..." : isSignup ? "회원가입" : "로그인"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 text-center mb-3">또는</p>
          <div className="space-y-2">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Google로 로그인
            </button>
            <button
              onClick={() => handleOAuth("github")}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              GitHub로 로그인
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          회원가입 시 환영 보너스로 20 크레딧을 받습니다.
        </p>
      </div>
    </div>
  );
}
