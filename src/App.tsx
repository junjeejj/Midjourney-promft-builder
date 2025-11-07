import React from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import BannerTop from "./components/BannerTop";
import BannerBottom from "./components/BannerBottom";
import ErrorBoundary from "./components/system/ErrorBoundary";

// 실제 페이지들 (프로젝트에 있는 페이지로 유지)
import Builder from "./pages/Builder";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";

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
  const bannerH = "clamp(56px, 7vw, 90px)";
  return (
    <>
      <UseAdsOnRouteChange />
      {/* Top Banner: 고정 */}
      <div className="fixed inset-x-0 top-0 z-40 bg-white/95 shadow-sm">
        <div className="mx-auto max-w-6xl px-3 py-2">
          <BannerTop pathname={pathname} />
        </div>
      </div>
      {/* 본문: 광고 높이만큼 여백을 줘서 겹치지 않게 */}
      <div
        className="min-h-screen"
        style={{ paddingTop: bannerH, paddingBottom: bannerH }}
      >
        <Outlet />
      </div>
      {/* Bottom Banner: 고정 */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 shadow-[0_-1px_6px_rgba(0,0,0,.06)]">
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
