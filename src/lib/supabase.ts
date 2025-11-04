// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

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
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anon || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder"
);

// Supabase가 설정되었는지 확인하는 헬퍼
export const isSupabaseConfigured = () => {
  return !!(url && anon && url !== "https://placeholder.supabase.co");
};
