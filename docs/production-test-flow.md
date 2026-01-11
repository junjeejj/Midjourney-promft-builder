# 실서버 테스트 플로우 가이드

## 개요

실서버(`https://www.midjourneybuilder.com`)에서 다음 4가지 기능을 테스트합니다:

1. **PayPal 결제** - `/api/paypal/create-order`, `/api/paypal/capture-order`
2. **크레딧 충전** - PayPal 결제 완료 후 자동 처리
3. **크레딧 차감** - `/api/credits/spend`
4. **자동 프롬프트 생성** - `/api/generate-prompt`

모든 API는 **Vercel 서버리스 함수**로 배포되며, **Supabase DB**와 연결되어 있습니다.

---

## 1. PayPal 결제 테스트

### 1.1 주문 생성 (create-order)

**프론트엔드 플로우:**
1. `https://www.midjourneybuilder.com/pricing` 접속
2. 로그인 확인 (필수)
3. 원하는 패키지 선택:
   - Starter Pack ($5.00) - 1,000 크레딧
   - Pro Pack ($14.00) - 5,000 크레딧
   - Studio Pack ($45.00) - 무제한

**API 호출:**
```bash
POST https://www.midjourneybuilder.com/api/paypal/create-order
Authorization: Bearer <Supabase JWT Token>
Content-Type: application/json

{
  "tier": "starter"  // 또는 "pro", "studio"
}
```

**예상 응답:**
```json
{
  "approveUrl": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "orderId": "ORDER_ID"
}
```

**확인 사항:**
- ✅ 올바른 tier로 주문 생성됨
- ✅ approveUrl이 반환됨
- ✅ PayPal 리다이렉트 정상 작동

---

### 1.2 결제 캡처 (capture-order)

**프론트엔드 플로우:**
1. PayPal 결제 페이지에서 결제 완료
2. `https://www.midjourneybuilder.com/paypal-success?token=ORDER_ID&tier=starter`로 리다이렉트
3. 자동으로 `/api/paypal/capture-order` 호출

**API 호출:**
```bash
POST https://www.midjourneybuilder.com/api/paypal/capture-order
Authorization: Bearer <Supabase JWT Token>
Content-Type: application/json

{
  "orderId": "ORDER_ID",
  "tier": "starter"  // 힌트 (custom_id가 우선)
}
```

**예상 응답:**
```json
{
  "ok": true,
  "tier": "starter",
  "creditsAdded": 1000,
  "unlimited": false
}
```

**확인 사항:**
- ✅ PayPal 주문 캡처 성공
- ✅ 올바른 tier로 크레딧 추가됨
- ✅ Supabase `wallets` 테이블에 반영됨
- ✅ Studio 패키지인 경우 `unlimited: true` 설정됨

---

## 2. 크레딧 충전 확인

### 2.1 크레딧 잔액 조회

**API 호출:**
```bash
GET https://www.midjourneybuilder.com/api/credits/balance
Authorization: Bearer <Supabase JWT Token>
```

**예상 응답:**
```json
{
  "balance": 1000,
  "unlimited": false
}
```

**확인 사항:**
- ✅ PayPal 결제 후 크레딧이 정확히 추가됨
- ✅ Studio 패키지는 `unlimited: true`
- ✅ 프론트엔드에서 잔액이 업데이트됨

---

## 3. 크레딧 차감 테스트

### 3.1 크레딧 사용

**API 호출:**
```bash
POST https://www.midjourneybuilder.com/api/credits/spend
Authorization: Bearer <Supabase JWT Token>
Content-Type: application/json

{
  "amount": 1,
  "reason": "prompt"
}
```

**예상 응답 (성공):**
```json
{
  "ok": true,
  "balance": 999
}
```

**예상 응답 (크레딧 부족):**
```json
{
  "ok": false,
  "message": "NOT_ENOUGH_CREDITS",
  "balance": 0
}
```

**확인 사항:**
- ✅ 크레딧이 정확히 차감됨
- ✅ 잔액이 업데이트됨
- ✅ 무제한 계정은 차감 없이 통과
- ✅ 크레딧 부족 시 402 에러 반환
- ✅ 레이트 리밋 적용됨

---

## 4. 자동 프롬프트 생성 테스트

### 4.1 프롬프트 생성 및 크레딧 차감

**프론트엔드 플로우:**
1. `https://www.midjourneybuilder.com/builder` 접속
2. 주제(subject) 입력
3. "Generate Prompt" 버튼 클릭

**API 호출:**
```bash
POST https://www.midjourneybuilder.com/api/generate-prompt
Authorization: Bearer <Supabase JWT Token>
Content-Type: application/json

{
  "subject": "고양이가 우주에 있는 모습",
  "selectionSummary": "style: mj_v6, aspect: 16:9",
  "previewPrompt": "a cat in space"
}
```

**예상 응답:**
```json
{
  "prompt": "a majestic cat floating in the vast cosmos, surrounded by swirling galaxies and twinkling stars, cinematic lighting, photorealistic, 16:9 aspect ratio --style raw --v 6"
}
```

**확인 사항:**
- ✅ OpenAI API 호출 성공
- ✅ 프롬프트가 생성됨
- ✅ 크레딧이 1개 차감됨 (무제한 계정 제외)
- ✅ 크레딧 부족 시 에러 반환

---

## 전체 테스트 플로우

### 시나리오 1: 정상 결제 및 사용

1. ✅ 로그인
2. ✅ Starter Pack 구매 ($5.00 → 1,000 크레딧)
3. ✅ 크레딧 잔액 확인 (1,000)
4. ✅ 프롬프트 생성 (크레딧 1개 차감)
5. ✅ 크레딧 잔액 확인 (999)
6. ✅ 프롬프트 999번 더 생성 가능 확인

### 시나리오 2: Studio Pack 무제한 테스트

1. ✅ Studio Pack 구매 ($45.00 → 무제한)
2. ✅ 크레딧 잔액 확인 (`unlimited: true`)
3. ✅ 프롬프트 생성 (크레딧 차감 없음)
4. ✅ 여러 번 생성해도 크레딧 차감 없음 확인

### 시나리오 3: 크레딧 부족 테스트

1. ✅ 크레딧이 1개만 남은 상태
2. ✅ 프롬프트 생성 성공 (크레딧 1개 차감)
3. ✅ 크레딧 0개 상태
4. ✅ 프롬프트 생성 시도 → 402 에러

---

## 디버깅 팁

### Vercel 로그 확인
```bash
# Vercel Dashboard → 해당 프로젝트 → Deployments → Functions 로그
```

### Supabase DB 확인
```sql
-- 크레딧 잔액 확인
SELECT user_id, balance, unlimited, updated_at
FROM wallets
WHERE user_id = '<YOUR_USER_ID>'
ORDER BY updated_at DESC;

-- 크레딧 사용 내역 (ledger가 있다면)
SELECT * FROM wallet_ledger
WHERE user_id = '<YOUR_USER_ID>'
ORDER BY created_at DESC
LIMIT 10;
```

### 브라우저 콘솔 확인
- Network 탭에서 API 요청/응답 확인
- Console 탭에서 에러 메시지 확인

---

## 체크리스트

배포 전:
- [ ] `api/paypal/capture-order.ts`의 개발용 임시 로직 제거됨
- [ ] 실제 tier 정보가 custom_id에서 추출됨
- [ ] Studio 패키지 무제한 플래그 설정됨
- [ ] 모든 환경 변수 설정됨 (Vercel)

테스트:
- [ ] PayPal Sandbox 계정 설정됨
- [ ] PayPal Live 모드 전환 준비됨 (실제 결제 전)
- [ ] Supabase 연결 확인됨
- [ ] OpenAI API 키 설정됨

---

## 환경 변수 확인

Vercel Dashboard → Environment Variables:

**필수:**
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` (sandbox 또는 live)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `OPENAI_API_KEY`

---

## 문제 해결

### PayPal 결제 실패
- PayPal 모드 확인 (sandbox vs live)
- PayPal 대시보드에서 주문 상태 확인
- Vercel 로그에서 에러 확인

### 크레딧이 추가되지 않음
- Supabase `wallets` 테이블 직접 확인
- `capture-order` API 응답 확인
- 트랜잭션 롤백 여부 확인

### 크레딧 차감이 안 됨
- 무제한 계정인지 확인 (`unlimited: true`)
- 레이트 리밋 확인
- Vercel 로그에서 에러 확인

---

## 다음 단계

1. 코드 커밋 및 푸시
2. Vercel 자동 배포 확인
3. 실서버에서 위 테스트 플로우 실행
4. 문제 발견 시 로그 확인 및 수정
5. 모든 테스트 통과 후 PayPal Live 모드 전환










