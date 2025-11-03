import React from "react";

import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import BannerTop from "./components/BannerTop";

import BannerBottom from "./components/BannerBottom";

import ErrorBoundary from "./components/system/ErrorBoundary";

// 실제 존재하는 페이지들만 import 하세요.

// 홈은 Builder로 대체해 안정성 확보

import PromptBuilderPage from "./pages/PromptBuilderPage";

import Templates from "./pages/Templates";

import SeedLab from "./pages/SeedLab";

import Favorites from "./pages/Favorites";

import Defaults from "./pages/Defaults";

import Billing from "./pages/Billing";

import Settings from "./pages/Settings";

import Profile from "./pages/Profile";

import Pricing from "./pages/Pricing";

import Login from "./pages/Login";

import Success from "./pages/Success";

import AdsTest from "./pages/AdsTest";

import CreditBadge from "./components/CreditBadge";

import BuyCreditsModal from "./components/BuyCreditsModal";

import { useAuth } from "./store/useAuth";

import { useT } from "./i18n";

import LocaleSelect from "./components/LocaleSelect";

import { supabase } from "./lib/supabase";

import { useEffect } from "react";

import { NavLink } from "react-router-dom";

declare global { interface Window { adsbygoogle: any[] } }

// 라우트 전환 시 광고 재요청 (정의 1회만)

function UseAdsOnRouteChange() {

  const { pathname } = useLocation();

  React.useEffect(() => {

    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}

  }, [pathname]);

  return null;

}

function AuthBadge() {
  const { user, signOut } = useAuth();
  if (!user) return <a href="/login" className="text-sm underline">Login</a>;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{user.email ?? user.name ?? "User"}</span>
      <button onClick={()=>signOut()} className="underline">Logout</button>
    </div>
  );
}

function Nav(){
  const { user, logout } = useAuth();
  const { t } = useT();
  const baseBtn = "inline-flex items-center rounded-lg border px-3 py-1.5 text-sm transition";
  const activeBtn = "bg-gray-100 border-gray-300 text-gray-900";
  const idleBtn = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

  const item = (to: string, label: string) => (
    <NavLink key={to} to={to} end className={({ isActive }) => `${baseBtn} ${isActive ? activeBtn : idleBtn}`}>
      {label}
    </NavLink>
  );

  return (
    <nav role="navigation" className="fixed top-16 left-0 right-0 z-40 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <NavLink to="/" end className={({ isActive }) => `${baseBtn} font-semibold ${isActive ? activeBtn : idleBtn}`}>
          {t("app")}
        </NavLink>
        <div className="flex flex-wrap items-center gap-2">
          {item("/templates", t("nav.templates"))}
          {item("/seedlab", t("nav.seed"))}
          {item("/favorites", t("nav.favorites"))}
          {item("/defaults", t("nav.defaults"))}
          <LocaleSelect />
          {item("/billing", t("nav.billing"))}
          {item("/settings", t("nav.settings"))}
          {item("/profile", t("nav.profile"))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CreditBadge />
          <BuyCreditsModal />
          <AuthBadge />
          {user ? (
            <button onClick={logout} className={`${baseBtn} ${idleBtn}`} title={t("nav.logout")}>
              {t("nav.logout")}
            </button>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `${baseBtn} ${isActive ? activeBtn : idleBtn}`}>
              {t("nav.login")}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

// Layout (정의 1회만)

function Layout() {

  const { pathname } = useLocation();

  const checkSession = useAuth((s) => s.checkSession);

  useEffect(() => {
    checkSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // 세션 변경 시 스토어 갱신
      useAuth.setState({
        user: session?.user ? { id: session.user.id, email: session.user.email ?? undefined, name: session.user.user_metadata?.name } : null
      });
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [checkSession]);

  return (

    <>

      <UseAdsOnRouteChange />

      <BannerTop pathname={pathname} />

      <Nav />

      <div className="min-h-[60vh] pt-20 pb-20">

        <Outlet />

      </div>

      <BannerBottom pathname={pathname} />

    </>

  );

}

export default function App() {

  return (

    <ErrorBoundary>

      <Routes>

        <Route element={<Layout />}>

          {/* 홈은 PromptBuilderPage로 매핑 */}

          <Route path="/" element={<PromptBuilderPage />} />

          <Route path="/builder" element={<PromptBuilderPage />} />

          <Route path="/templates" element={<Templates />} />

          <Route path="/seedlab" element={<SeedLab />} />

          <Route path="/favorites" element={<Favorites />} />

          <Route path="/defaults" element={<Defaults />} />

          <Route path="/billing" element={<Billing />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/pricing" element={<Pricing />} />

          <Route path="/ads-test" element={<AdsTest />} />

        </Route>



        {/* 광고 비노출/유틸 페이지 */}

        <Route path="/login" element={<Login />} />

        <Route path="/success" element={<Success />} />

        <Route path="*" element={<div style={{padding:24}}>페이지를 찾을 수 없습니다.</div>} />

      </Routes>

    </ErrorBoundary>

  );

}
