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
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    try {
      await doLoginWithOAuth(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth login failed.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{isSignup ? "Sign up" : "Log in"}</h1>
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
              Log in
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
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Name (optional)"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Password (min 6 characters)"
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
              {loadingAuth ? "Processing..." : isSignup ? "Sign up" : "Log in"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">or</p>
            <div className="space-y-2">
              <button
                onClick={() => handleOAuth("google")}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Continue with GOOGLE
              </button>
              <button
                onClick={() => handleOAuth("github")}
                className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Continue with GITHUB
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Sign up bonus: 20 credits on registration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="border rounded-lg p-6">
        <div className="mb-2">Email: {user.email}</div>
        <div className="mb-4">Name: {displayName}</div>
        <button 
          onClick={doLogout} 
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Log out
        </button>
      </div>
    </div>
  );
}