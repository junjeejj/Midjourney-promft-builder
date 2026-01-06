import { isAdAllowedPath } from "../lib/adsPolicy";
import { getLang } from "../lib/lang";
import { SITE_TEXT } from "../config/siteText";
import { useEffect, useRef } from "react";
import { requestAdFill } from "./ads/AdSenseProvider";

export default function BannerBottom({ pathname }: { pathname: string }) {
  const adSenseRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // AdSense 광고 초기화
    if (adSenseRef.current) {
      requestAdFill();
    }
  }, [pathname]);

  if (!isAdAllowedPath(pathname)) return null;

  const lang = getLang();
  const t = SITE_TEXT[lang];

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="text-[11px] text-gray-500 select-none">{t.adLabel}</div>
      <div className="flex justify-end min-h-[50px] flex-1">
        <ins 
          ref={adSenseRef}
          className="adsbygoogle block"
          style={{ display: "block", minHeight: 50 }}
          data-ad-client="ca-pub-2243395970141516"
          data-ad-slot=""
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
