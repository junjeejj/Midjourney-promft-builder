import { useLocation } from "react-router-dom";
import { isAdAllowedPath } from "../lib/adsPolicy";
import AdSlot from "./ads/AdSlot";

export default function BannerTop() {
  const { pathname } = useLocation();
  if (!isAdAllowedPath(pathname)) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-6xl px-3 py-2">
        <AdSlot slot="여기에_상단슬롯ID" style={{ minHeight: 60 }} />
      </div>
    </div>
  );
}