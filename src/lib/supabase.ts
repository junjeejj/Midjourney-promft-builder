// Supabase 클라이언트 설정

import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 가져오거나, 없으면 기본값 사용
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hxcfkrtmrtjvrpjeinac.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4Y3Fma3RybXRqdnJwamVpbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTY5MzUsImV4cCI6MjA3NzQ3MjkzNX0.D89GHyqRa4L1hUWPw-l60UR6pd4qzxjDp_ZsuBDcoMs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

