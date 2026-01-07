// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PLACEHOLDER_URL, SUPABASE_PLACEHOLDER_ANON_KEY } from "../config/constants";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 런타임 가드: 값이 없으면 명확한 에러를 콘솔에 표시
if (!url || !anon) {
  // 프러덕션에서 콘솔 경고만 (문자열 일부 마스킹)
  const maskedUrl = typeof url === "string" ? url.replace(/(?<=https:\/\/).{3,}(?=\.supabase\.co)/, "****") : url;
  console.warn("[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Current:", { url: maskedUrl, anon: !!anon });
  console.warn("[Supabase] Using mock client. Supabase features will be disabled.");
}

// 환경 변수가 없을 때는 더미 클라이언트 생성 (앱이 크래시되지 않도록)
// 기본 설정 사용 (로컬과 프로덕션 모두에서 작동)
export const supabase = createClient(
  url || SUPABASE_PLACEHOLDER_URL,
  anon || SUPABASE_PLACEHOLDER_ANON_KEY
);

// Supabase가 설정되었는지 확인하는 헬퍼
export const isSupabaseConfigured = () => {
  return !!(url && anon && url !== SUPABASE_PLACEHOLDER_URL);
};

// Supabase URL 유효성 검사
export const validateSupabaseUrl = async (): Promise<{ valid: boolean; error?: string }> => {
  if (!url || url === SUPABASE_PLACEHOLDER_URL) {
    return { valid: false, error: "Supabase URL이 설정되지 않았습니다." };
  }

  try {
    // URL 형식 검증
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("supabase.co")) {
      return { valid: false, error: "Supabase URL 형식이 올바르지 않습니다." };
    }

    // 실제 연결 테스트 (선택적)
    // 네트워크 요청은 브라우저에서 CORS 문제가 있을 수 있으므로
    // 실제 OAuth 시도 시 에러를 확인하는 것이 더 나을 수 있습니다.
    return { valid: true };
  } catch (err) {
    return { valid: false, error: `Supabase URL이 유효하지 않습니다: ${url}` };
  }
};
