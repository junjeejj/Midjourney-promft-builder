// src/components/ads/AdSenseProvider.tsx

import { ReactNode, useEffect } from "react";

declare global {
  interface Window {
    // 다른 곳(App.tsx)과 타입이 같아야 함
    adsbygoogle?: any[];
  }
}

interface Props {
  children: ReactNode;
}

/**
 * 전역 adsbygoogle 배열에 안전하게 push 하는 헬퍼
 * - App.tsx / AdSlot.tsx 에서 import 해서 사용
 */
export function requestAdFill() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // 광고 스크립트가 없으면 그냥 조용히 무시
  }
}

/**
 * AdSenseProvider 컴포넌트
 * - 마운트될 때 한 번 광고 요청
 */
export function AdSenseProvider({ children }: Props) {
  useEffect(() => {
    requestAdFill();
  }, []);

  return <>{children}</>;
}

// default export 도 같이 제공 (혹시 어디선가 default 로 쓰고 있을 수도 있음)
export default AdSenseProvider;
