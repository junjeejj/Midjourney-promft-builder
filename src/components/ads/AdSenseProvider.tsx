// src/components/ads/AdSenseProvider.tsx

import { ReactNode, useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface Props {
  children?: ReactNode;
}

/**
 * 전역 adsbygoogle 배열에 안전하게 push 하는 헬퍼
 */
export function requestAdFill() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // 광고 스크립트가 없으면 무시
  }
}

/**
 * AdSenseProvider 컴포넌트
 */
export function AdSenseProvider({ children }: Props) {
  useEffect(() => {
    requestAdFill();
  }, []);

  return <>{children}</>;
}

export default AdSenseProvider;
