# 환경 변수 정리

프로젝트를 실행하거나 Vercel에 배포할 때 아래 환경 변수를 설정하세요.

## Supabase
- `SUPABASE_URL` (서버 사이드)
- `SUPABASE_ANON_KEY` (서버 사이드)
- `SUPABASE_SERVICE_ROLE` (서버 사이드)
- `VITE_SUPABASE_URL` (클라이언트 사이드)
- `VITE_SUPABASE_ANON_KEY` (클라이언트 사이드)

## Stripe
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_STUDIO`
- `SITE_URL` (선택, Vercel에서 `req.headers.origin`이 비어 있을 때 URL 폴백으로 사용)
- `ADMIN_API_KEY` (선택, `/api/credits/grant` 보호용)

## Rate Limit (선택)
- `RATE_LIMIT_BACKEND` (`memory`, `vercel_kv`, `upstash` 등 전환 스위치)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (Upstash Redis 사용 시)
- `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN` (Vercel KV 사용 시)

## OpenAI
- `OPENAI_API_KEY`

## OAuth 설정 (선택)
- `VITE_OAUTH_REDIRECT_PATH`: OAuth 콜백 후 리디렉션 경로 (기본값: `/login`)
- `VITE_OAUTH_PROVIDERS`: OAuth 제공자 목록, 쉼표로 구분 (기본값: `google`)
  - 예: `VITE_OAUTH_PROVIDERS=google,github`

## API 설정 (선택)
- `VITE_API_BASE_URL`: API 기본 URL (기본값: `/api`)

## 데모 사용자 설정 (선택)
- `VITE_DEMO_USER_ENABLED`: 데모 사용자 활성화 여부 (기본값: `false`)
- `VITE_DEMO_USER_ID`: 데모 사용자 ID (기본값: `demo`)
- `VITE_DEMO_USER_NAME`: 데모 사용자 이름 (기본값: `Demo User`)
- `VITE_DEMO_USER_EMAIL`: 데모 사용자 이메일 (기본값: `demo@example.com`)
- `VITE_DEMO_USER_TOKEN`: 데모 사용자 토큰 (기본값: `demo-token`)

## 개발 서버 설정 (선택)
- `VITE_DEV_PORT`: 개발 서버 포트 (기본값: `5173`)

> 참고: `.env` 파일은 버전 관리 대상이 아니므로, 예시 값이 필요하면 이 문서를 참고해 직접 생성해 주세요.


