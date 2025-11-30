# Vercel 완전 재배포 가이드

## 방법 1: Vercel 프로젝트 삭제 후 재배포 (권장)

### 1단계: Vercel 프로젝트 삭제
1. Vercel Dashboard (https://vercel.com/dashboard) 접속
2. 프로젝트 선택: `midjourney-promft-builder` 또는 해당 프로젝트
3. **Settings** 탭 클릭
4. 맨 아래로 스크롤
5. **"Delete Project"** 버튼 클릭
6. 확인 메시지에 프로젝트 이름 입력하여 삭제 확인

### 2단계: 새로 배포
1. Vercel Dashboard에서 **"Add New..."** → **"Project"** 클릭
2. GitHub 저장소 선택: `junjeejj/Midjourney-promft-builder`
3. 브랜치 선택: `2025-11-17-c4jr-193d6` (또는 `main`)
4. **프로젝트 설정**:
   - Framework Preset: Vite
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables** 설정 (필요한 경우):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - 기타 필요한 환경 변수들
6. **"Deploy"** 클릭

### 3단계: 도메인 연결 (기존 도메인 사용 시)
1. 배포 완료 후 **Settings** → **Domains** 탭
2. 기존 도메인 추가: `www.midjourneybuilder.com`
3. DNS 설정 확인

---

## 방법 2: 빌드 캐시만 완전히 클리어 (더 빠름)

### 1단계: Vercel CLI로 재배포
```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리에서
vercel --prod --force
```

### 2단계: 또는 Vercel Dashboard에서
1. **Deployments** 탭
2. 최신 배포에서 **"..."** 메뉴 클릭
3. **"Redeploy"** 선택
4. **"Use existing Build Cache" 체크 해제**
5. **"Redeploy"** 클릭

---

## 방법 3: 완전히 새로운 프로젝트로 배포

### 1단계: 로컬에서 빌드 테스트
```bash
npm run build
```

빌드가 성공하는지 확인

### 2단계: Git에 푸시
```bash
git add .
git commit -m "clean: prepare for fresh Vercel deployment"
git push
```

### 3단계: Vercel에서 새 프로젝트 생성
- 위의 "방법 1" 참고

---

## 주의사항

⚠️ **프로젝트 삭제 전 확인사항:**
- 환경 변수 백업 (Settings → Environment Variables에서 복사)
- 도메인 설정 확인
- 기존 배포 URL 기록

✅ **삭제 후 재배포 시:**
- 모든 환경 변수를 다시 설정해야 함
- 도메인을 다시 연결해야 함
- 첫 배포는 약간 더 오래 걸릴 수 있음

---

## 추천 방법

**가장 빠른 방법**: 방법 2 (빌드 캐시만 클리어)
- 프로젝트 삭제 없이 해결 가능
- 환경 변수 유지
- 도메인 설정 유지

**가장 확실한 방법**: 방법 1 (완전 재배포)
- 모든 캐시 완전히 제거
- 깨끗한 상태에서 시작
- 환경 변수와 도메인 재설정 필요



