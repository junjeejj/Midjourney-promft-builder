# 환경 변수 정리

프로젝트를 실행하거나 Vercel에 배포할 때 아래 환경 변수를 설정하세요.

## Supabase
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE`

클라이언트에서 사용하는 Vite 빌드는 기존대로 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`가 필요합니다.

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

> 참고: `.env` 파일은 버전 관리 대상이 아니므로, 예시 값이 필요하면 이 문서를 참고해 직접 생성해 주세요.


