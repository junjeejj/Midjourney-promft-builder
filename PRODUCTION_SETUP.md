# 프로덕션 배포 설정 가이드

## 프로덕션에서 OAuth 로그인이 작동하지 않는 문제 해결

### 1. Supabase 대시보드 설정 확인

**중요**: 프로덕션 도메인에서 OAuth가 작동하려면 Supabase 대시보드에서 다음을 설정해야 합니다.

#### Supabase Dashboard → Authentication → URL Configuration

1. **Site URL** 설정:
   ```
   https://www.midjourneybuilder.com
   ```

2. **Redirect URLs** 추가:
   ```
   https://www.midjourneybuilder.com/login
   http://localhost:5173/login
   ```

   (개발 환경과 프로덕션 환경 모두 포함)

### 2. Google Cloud Console 설정 확인

Google Cloud Console → OAuth 2.0 클라이언트 ID → 승인된 리디렉션 URI에 다음이 포함되어 있는지 확인:

```
https://hxcqfktrmtjvrpjeinac.supabase.co/auth/v1/callback
```

### 3. Vercel 환경 변수 설정

Vercel Dashboard → Project Settings → Environment Variables에서 다음을 확인:

**필수:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**선택 (기본값 있음):**
- `VITE_OAUTH_REDIRECT_PATH` (기본값: `/login`)
- `VITE_OAUTH_PROVIDERS` (기본값: `google`)
- `VITE_API_BASE_URL` (기본값: `/api`)

### 4. 배포 확인

1. 최신 코드가 배포되었는지 확인:
   - Vercel Dashboard → Deployments에서 최신 배포 확인
   - 빌드 로그에서 오류 확인

2. 브라우저 캐시 문제일 수 있음:
   - 프로덕션 사이트에서 Ctrl+Shift+R (하드 리프레시)
   - 또는 시크릿 모드에서 테스트

### 5. 문제 해결 체크리스트

- [ ] Supabase Site URL이 `https://www.midjourneybuilder.com`으로 설정됨
- [ ] Supabase Redirect URLs에 `https://www.midjourneybuilder.com/login` 포함됨
- [ ] Google Cloud Console의 리디렉션 URI에 Supabase callback URL 포함됨
- [ ] Vercel 환경 변수가 올바르게 설정됨
- [ ] 최신 코드가 배포됨
- [ ] 브라우저 콘솔에 에러가 없음

### 6. 디버깅

프로덕션에서 문제가 발생하면:

1. 브라우저 개발자 도구 → Console 탭에서 에러 확인
2. Network 탭에서 OAuth 리디렉션 요청 확인
3. Application 탭 → Cookies에서 Supabase 세션 쿠키 확인

### 7. 로컬 vs 프로덕션 차이점

- **로컬**: `http://localhost:5173/login`
- **프로덕션**: `https://www.midjourneybuilder.com/login`

두 환경 모두 Supabase Redirect URLs에 등록되어 있어야 합니다.


