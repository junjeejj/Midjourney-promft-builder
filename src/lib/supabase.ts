// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 런타임 가드: 값이 없으면 명확한 에러를 콘솔에 표시
if (!url || !anon) {
  // 프러덕션에서 콘솔 경고만 (문자열 일부 마스킹)
  const maskedUrl = typeof url === "string" ? url.replace(/(?<=https:\/\/).{3,}(?=\.supabase\.co)/, "****") : url;
  console.error("[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Current:", { url: maskedUrl, anon: !!anon });
}

export const supabase = createClient(url as string, anon as string);
