// src/lib/adsPolicy.ts
export const AD_ALLOWED_PATHS = [
  "/",              // 랜딩이 충분한 콘텐츠/가이드가 있을 때만 유지
  "/builder",       // 실제 기능/가이드/결과가 있는 핵심 페이지
  "/templates",     // 템플릿 목록/설명 등 콘텐츠가 있을 때
  // 필요 시 여기에 실 콘텐츠 페이지 추가
];

export function isAdAllowedPath(pathname: string) {
  // 명시적으로 허용된 페이지만 true
  return AD_ALLOWED_PATHS.includes(pathname);
}

