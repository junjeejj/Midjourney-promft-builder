import React from "react";

import { Routes, Route, Outlet, useLocation } from "react-router-dom";



import BannerTop from "./components/BannerTop";

import BannerBottom from "./components/BannerBottom";

import ErrorBoundary from "./components/system/ErrorBoundary";



// 실제 존재하는 페이지들만 import

import Builder from "./pages/Builder";

import Pricing from "./pages/Pricing";

import Login from "./pages/Login";



declare global { interface Window { adsbygoogle: any[] } }



// 라우트 변경시 광고 리프레시(있어도 렌더 방해 X)

function UseAdsOnRouteChange() {

  const { pathname } = useLocation();

  React.useEffect(() => {

    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}

  }, [pathname]);

  return null;

}



function Layout() {

  const { pathname } = useLocation();

  return (

    <>

      <UseAdsOnRouteChange />

      <BannerTop pathname={pathname} />

      <div className="pt-14 pb-16">

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

          {/* 홈을 Builder로 매핑 */}

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



        {/* 유틸 페이지(광고 비노출 가능) */}

        <Route path="/login" element={<Login />} />

        <Route path="/success" element={<div style={{padding:24}}>결제가 완료되었습니다.</div>} />

        <Route path="*" element={<div style={{padding:24}}>페이지를 찾을 수 없습니다.</div>} />

      </Routes>

    </ErrorBoundary>

  );

}
