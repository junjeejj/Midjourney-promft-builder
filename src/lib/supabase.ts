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
