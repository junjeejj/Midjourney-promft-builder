import React from "react";

import { Routes, Route, Outlet, useLocation } from "react-router-dom";



import BannerTop from "./components/BannerTop";

import BannerBottom from "./components/BannerBottom";

import ErrorBoundary from "./components/system/ErrorBoundary";



import SafeHome from "./pages/SafeHome";

import Builder from "./pages/Builder";

import Pricing from "./pages/Pricing";

import Login from "./pages/Login";

import AdsTest from "./pages/AdsTest";



declare global { interface Window { adsbygoogle: any[] } }



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

          <Route path="/" element={<SafeHome />} />

          <Route

            path="/builder"

            element={

              <ErrorBoundary>

                <Builder />

              </ErrorBoundary>

            }

          />

          <Route path="/pricing" element={<Pricing />} />

          <Route path="/ads-test" element={<AdsTest />} />

        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/success" element={<div style={{padding:24}}>결제가 완료되었습니다.</div>} />

        <Route path="*" element={<div style={{padding:24}}>페이지를 찾을 수 없습니다.</div>} />

      </Routes>

    </ErrorBoundary>

  );

}
