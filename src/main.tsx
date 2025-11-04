import React from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";



// 화면에 React 부팅 전 텍스트를 강제로 찍는다.

const rootEl = document.getElementById("root");

if (rootEl) {

  rootEl.innerHTML = '<div style="padding:24px;font:16px/1.4 sans-serif">[BOOT] pre-mount test…</div>';

  console.log("[BOOT] wrote pre-mount text");

} else {

  throw new Error("#root element not found");

}



try {

  console.log("[BOOT] React starting…");

  createRoot(rootEl!).render(

    <React.StrictMode>

      <BrowserRouter>

        <App />

      </BrowserRouter>

    </React.StrictMode>

  );

  console.log("[BOOT] React mounted");

} catch (err) {

  console.error("[BOOT] failed:", err);

}
