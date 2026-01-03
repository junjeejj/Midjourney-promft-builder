import { isAdAllowedPath } from "../lib/adsPolicy";
import { getLang } from "../lib/lang";
import { SITE_TEXT } from "../config/siteText";
import { useEffect, useRef } from "react";

export default function BannerBottom({ pathname }: { pathname: string }) {
  const kakaoAdRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 카카오 애드핏 스크립트 로드 확인 및 광고 초기화
    const initKakaoAd = () => {
      if (kakaoAdRef.current && (window as any).kakao?.ad) {
        (window as any).kakao.ad.fit(kakaoAdRef.current);
      }
    };

    // 스크립트가 이미 로드되어 있으면 바로 초기화
    if ((window as any).kakao?.ad) {
      initKakaoAd();
    } else {
      // 스크립트 로드 대기
      const checkInterval = setInterval(() => {
        if ((window as any).kakao?.ad) {
          clearInterval(checkInterval);
          initKakaoAd();
        }
      }, 100);

      // 5초 후 타임아웃
      setTimeout(() => clearInterval(checkInterval), 5000);
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
          ref={kakaoAdRef}
          className="kakao_ad_area" 
          style={{ display: "none" }}
          data-ad-unit="DAN-qqwPV9r6HhzrmeuX"
          data-ad-width="320"
          data-ad-height="50"
        ></ins>
      </div>
    </div>
  );
}
