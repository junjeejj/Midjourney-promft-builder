import React from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import BannerTop from "./components/BannerTop";
import BannerBottom from "./components/BannerBottom";
import TopNav from "./components/TopNav";
import ErrorBoundary from "./components/system/ErrorBoundary";

// 실제 페이지들 (프로젝트에 있는 페이지로 유지)
import Builder from "./pages/Builder";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Templates from "./pages/Templates";
import SeedLab from "./pages/SeedLab";
import Favorites from "./pages/Favorites";
import Defaults from "./pages/Defaults";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// 라우트 변경 때 AdSense 리프레시 (광고 자원 재요청)
function UseAdsOnRouteChange() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [pathname]);
  return null;
}

// 공통 레이아웃: 상/하단 배너 + 여백
function Layout() {
  const { pathname } = useLocation();
  const topRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const update = () => {
      const hTop = topRef.current?.getBoundingClientRect().height ?? 0;
      const hBottom = bottomRef.current?.getBoundingClientRect().height ?? 0;
      const bannerHeight = Math.ceil(Math.max(hTop, hBottom));
      if (bannerHeight > 0) {
        document.documentElement.style.setProperty("--bannerH", `${bannerHeight}px`);
      }
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    if (topRef.current) resizeObserver.observe(topRef.current);
    if (bottomRef.current) resizeObserver.observe(bottomRef.current);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <UseAdsOnRouteChange />
      {/* Top Banner: 고정 */}
      <div ref={topRef} className="fixed inset-x-0 top-0 z-40 bg-white/95 shadow-sm">
        <div className="mx-auto max-w-6xl px-3 py-2">
          <BannerTop pathname={pathname} />
        </div>
      </div>
      {/* 본문: 배너 높이만큼 여백을 주는 래퍼 */}
      <div className="app-shell">
        <div className="sticky-after-banner">
          <TopNav pathname={pathname} />
        </div>
        <Outlet />
      </div>
      {/* Bottom Banner: 고정 */}
      <div ref={bottomRef} className="fixed inset-x-0 bottom-0 z-40 bg-white/95 shadow-[0_-1px_6px_rgba(0,0,0,.06)]">
        <div className="mx-auto max-w-6xl px-3 py-2">
          <BannerBottom pathname={pathname} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          {/* 홈을 빌더로 연결 */}
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Builder />
              </ErrorBoundary>
            }
          />
          <Route
            path="/builder"
            element={
              <ErrorBoundary>
                <Builder />
              </ErrorBoundary>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/seed" element={<SeedLab />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/defaults" element={<Defaults />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* 광고 비노출 권장 라우트 */}
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<div style={{ padding: 24 }}>결제가 완료되었습니다.</div>} />
        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </ErrorBoundary>
  );
}
