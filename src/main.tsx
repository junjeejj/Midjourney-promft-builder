import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import DevErrorBoundary from "./components/DevErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DevErrorBoundary>
  </React.StrictMode>
);


