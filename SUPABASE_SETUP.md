# Supabase 인증 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입/로그인
2. 새 프로젝트 생성
3. 프로젝트 URL과 Anon Key 확인:
   - Settings → API
   - Project URL 복사
   - anon/public key 복사

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음을 추가하세요:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

예시:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. OAuth 설정 (선택사항)

### Google OAuth
1. Supabase Dashboard → Authentication → Providers
2. Google 활성화
3. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
4. Redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Client ID와 Client Secret을 Supabase에 입력

### GitHub OAuth
1. Supabase Dashboard → Authentication → Providers
2. GitHub 활성화
3. GitHub에서 OAuth App 생성
4. Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Client ID와 Client Secret을 Supabase에 입력

## 4. 패키지 설치

```bash
npm install
```

## 5. 테스트

1. 개발 서버 실행: `npm run dev`
2. 로그인/회원가입 페이지에서 테스트
3. Supabase Dashboard → Authentication → Users에서 사용자 확인

## 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요 (이미 .gitignore에 추가됨)
- Supabase가 설정되지 않으면 Mock 로그인으로 자동 전환됩니다







