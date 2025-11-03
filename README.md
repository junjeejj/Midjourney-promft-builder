# Midjourney Prompt Builder

Midjourney 프롬프트 생성 도구입니다.

## 시작하기

```bash
npm install
npm run dev
```

## Supabase Auth 설정 (필수)

### 1. Vercel 환경변수 설정

Vercel → Project → Settings → Environment Variables

- `VITE_SUPABASE_URL` = (Supabase 프로젝트 URL, 예: https://xxxxx.supabase.co)
- `VITE_SUPABASE_ANON_KEY` = (Supabase anon public key)
- Environments: Preview + Production
- Save 후 Redeploy

### 2. Supabase Dashboard URL 설정

Supabase Dashboard → Authentication → URL Settings

- **Site URL:**
  ```
  https://midjourneybuilder.com
  ```

- **Additional Redirect URLs** (줄바꿈으로 여러 개 입력):
  ```
  https://www.midjourneybuilder.com
  https://midjourney-promft-builder.vercel.app
  http://localhost:5173
  ```

- **Allowed Sign-out URLs** (선택):
  위와 동일 URL들 추가

- 저장

### 3. (선택) Google OAuth 활성화

- Supabase → Authentication → Providers → Google → Enable
- Google Cloud Console에서 OAuth 2.0 Client ID/Secret 생성
  - **Authorized JavaScript origins:**
    ```
    https://midjourneybuilder.com
    https://www.midjourneybuilder.com
    https://midjourney-promft-builder.vercel.app
    http://localhost:5173
    ```
  - **Authorized redirect URIs:**
    (Supabase Provider 설정 화면에 표시되는 Google redirect URL 그대로 복사)
    예) `https://xxxxx.supabase.co/auth/v1/callback`
- 생성된 Client ID/Secret을 Supabase Provider 설정에 입력 후 Save

### 4. 앱 동작 확인

- 배포 후 `/profile` (또는 로그인 버튼 있는 페이지)에서 회원가입/로그인/로그아웃 테스트
- 새로고침 후 세션 유지 확인

## Troubleshooting

- **import.meta.env 타입 오류** → `tsconfig.json`에 `"types": ["vite/client"]` 포함 확인
- **OAuth 리다이렉트 에러** → Supabase URL Settings와 Google Console의 origins/redirect URI가 일치하는지 재확인
- **401/403** → Vercel 환경변수 저장 후 Redeploy 여부 확인

## 로컬 개발

```bash
# .env.local 파일 생성 (커밋 금지)
cp .env.example .env.local

# .env.local에 실제 값 입력
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
