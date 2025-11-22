// 환경 변수 및 상수 설정

// Supabase 설정
export const SUPABASE_PLACEHOLDER_URL = "https://placeholder.supabase.co";
export const SUPABASE_PLACEHOLDER_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder";

// OAuth 설정
export const OAUTH_REDIRECT_PATH = import.meta.env.VITE_OAUTH_REDIRECT_PATH || "/login";
export const OAUTH_PROVIDERS = (import.meta.env.VITE_OAUTH_PROVIDERS?.split(",") || ["google"]).filter(Boolean) as readonly string[];

// API 설정
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export const API_ENDPOINTS = {
  STRIPE_CHECKOUT: `${API_BASE_URL}/stripe/checkout`,
  CREDITS_BALANCE: `${API_BASE_URL}/credits/balance`,
  CREDITS_SPEND: `${API_BASE_URL}/credits/spend`,
  GENERATE_PROMPT: `${API_BASE_URL}/generate-prompt`,
} as const;

// 타임아웃 설정 (밀리초)
export const TIMEOUTS = {
  OAUTH_CALLBACK: 1000,
  LOGIN_REDIRECT: 1000,
  USER_REDIRECT: 2000,
  COPY_FEEDBACK: 1200, // 복사 완료 피드백 표시 시간
  COPY_FEEDBACK_LONG: 2000, // 긴 복사 완료 피드백 표시 시간
  SESSION_CHECK_DELAY: 1000, // 세션 체크 지연 시간
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: "/",
  BUILDER: "/builder",
  LOGIN: "/login",
  PRICING: "/pricing",
  PROFILE: "/profile",
  SUCCESS: "/success",
  TEMPLATES: "/templates",
  SEED: "/seed",
  FAVORITES: "/favorites",
  DEFAULTS: "/defaults",
  BILLING: "/billing",
  SETTINGS: "/settings",
} as const;

// 데모 사용자 설정
export const DEMO_USER_ENABLED = import.meta.env.VITE_DEMO_USER_ENABLED === "true";
export const DEMO_USER = {
  id: import.meta.env.VITE_DEMO_USER_ID || "demo",
  displayName: import.meta.env.VITE_DEMO_USER_NAME || "Demo User",
  name: import.meta.env.VITE_DEMO_USER_NAME || "Demo User",
  email: import.meta.env.VITE_DEMO_USER_EMAIL || "demo@example.com",
  avatarUrl: null,
  token: import.meta.env.VITE_DEMO_USER_TOKEN || "demo-token",
} as const;

// 개발 서버 포트 (vite.config.ts에서 직접 process.env 사용)

