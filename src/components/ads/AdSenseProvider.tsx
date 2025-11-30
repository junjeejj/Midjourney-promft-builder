// src/components/ads/AdSenseProvider.tsx

import { ReactNode, useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface Props {
  children: ReactNode;
}

/**
 * 최소 AdSense Provider
 * - children 렌더링만 하고, adsbygoogle.push 에서 에러 나면 무시
 */
export default function AdSenseProvider({ children }: Props) {
  useEffect(() => {
    try {
      // 전역 adsbygoogle 배열 초기화
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 스크립트 없으면 그냥 조용히 무시
    }
  }, []);

  return <>{children}</>;
}
