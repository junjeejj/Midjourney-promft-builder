# 배포 후 3분 체크리스트

1. `/api/health` 호출로 필수 환경 변수/버전 확인 (200 OK 기대)
2. 실 사용자 토큰으로 `balance`/`generate-prompt`/`stripe checkout` 간단 호출
3. Stripe CLI로 `checkout.session.completed` 1회 발송해 웹훅 정상 동작 확인
4. 현재 `RATE_LIMIT_BACKEND` 값과 설정(Upstash/Vercel KV 등) 기록

---

# 후속 점검·테스트·모니터링 팩

## 1) 스모크 테스트(배포 직후 3분 내)

```bash
# 1) Health
curl -sS https://<your-app>/api/health | jq .

# 2) 인증 토큰(실 유저) 확보 후 환경 변수에 주입
export TOKEN="<supabase_user_access_token>"

# 3) 잔액 조회(지갑 미생성 시 0)
curl -sS -H "Authorization: Bearer $TOKEN" https://<your-app>/api/credits/balance | jq .

# 4) 자동 프롬프트(차감·실패 롤백 확인)
curl -sS -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"subject":"테스트 주제","params":{"style":"mj_v6"}}' \
  https://<your-app>/api/generate-prompt | jq .

# 5) Checkout 세션(로그인 필수)
curl -sS -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"tier":"starter","mode":"payment"}' \
  https://<your-app>/api/stripe/checkout | jq .
```

> 기대 결과: `balance` 200/0 또는 숫자, `generate-prompt` 200/`{prompt, balance}`, checkout 200/`{url: ...}`

---

## 2) Webhook 멱등성 검증(실전 리플레이 시나리오)

```bash
# Stripe CLI 연결
stripe listen --forward-to https://<your-app>/api/stripe/webhook

# 첫 번째 이벤트
stripe trigger checkout.session.completed

# 동일 이벤트 재전송(Stripe CLI로 동일 ID 리플레이는 어려워서 invoice.paid 2회로 유사 검증)
stripe trigger invoice.paid
stripe trigger invoice.paid
```

**확인 포인트**

- 첫 번째 `invoice.paid`만 지급, 두 번째는 응답 본문에 `{ idempotent: true }` 또는 동일 의미 필드 노출
- `wallet_ledger.ext_event_id`에 Stripe `event.id` 기록

---

## 3) 경쟁 상태 회귀 테스트(동시 차감)

> 같은 유저 토큰으로 10개의 차감 요청을 거의 동시에 날려 **음수/중복 차감**이 없는지 확인합니다.

```bash
# 1크레딧 차감 10회 동시
seq 10 | xargs -I{} -P10 curl -sS -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":1,"reason":"race_test"}' \
  https://<your-app>/api/credits/spend > /dev/null

# 최종 잔액 확인
curl -sS -H "Authorization: Bearer $TOKEN" https://<your-app>/api/credits/balance | jq .
```

**기대 결과**

- 보유 잔액보다 많은 차감은 **일부만 성공**, 나머지는 402/`NOT_ENOUGH_CREDITS`
- 음수 잔액/중복 차감 없음

---

## 4) 관찰성(Observability) 빠른 구축

**로그 표준 키**

- 모든 API 응답 로그에: `route`, `status`, `requestId`, `userId(있으면)`, `elapsedMs`, `reason(optional)`

**권장 알림(임곗값 예시)**

- `api/stripe/webhook` 4xx/5xx 비율 > 1% (5분 이동창)
- `NOT_ENOUGH_CREDITS` 비율 급증(유입 대비) → 크레딧 소진 패턴 이상치
- `claim_webhook_event` 실패(예외) 발생 시 알림

---

## 5) 보안 재확인 체크리스트(짧게)

- [ ] `/api/credits/grant` **외부 차단**(admin 키 + 원본 제한 or 내부 전용)
- [ ] 로그에 토큰/카드 정보/Stripe 시크릿 **미출력**
- [ ] RLS: `wallets`, `wallet_ledger` **owner-only select**
- [ ] ENV rotate 계획 문서화(Stripe/Supabase 키 유출 가정)

---

## 6) 데이터베이스 점검 쿼리(운영 북마크)

```sql
-- 최근 100건 지급/차감
select created_at, user_id, delta, reason, ext_event_id
from wallet_ledger
order by created_at desc
limit 100;

-- 멱등 이벤트 중복 여부(있으면 설계 상 정상: 하나만 존재해야 함)
select event_id, type, count(*) c
from webhook_events
group by 1,2
having count(*) > 1;

-- 유저별 최신 5건 추이
select w.user_id, w.balance,
  (select json_agg(row_to_json(l))
   from (select created_at, delta, reason
         from wallet_ledger l
         where l.user_id = w.user_id
         order by created_at desc limit 5) l) last_moves
from wallets w
order by w.updated_at desc
limit 50;
```

---

## 7) 운영 팁(실무에서 유용한 한 줄들)

- **CORS/Origin**: 결제/웹훅 외 API는 `Authorization` 헤더 허용 확인. 프록시 뒤면 `SITE_URL` 정확히 지정.
- **광고 레이아웃**: 예외 경로(로그인/결제 완료 페이지 등)에서 상·하단 배너 숨김 시 `--bannerH` 0 처리 여부 확인.
- **레이트리밋**: 프로덕션은 **외부 스토리지 기반(Upstash/Vercel KV)** 으로 운영, Map 버전은 로컬 전용.

---

## 8) 남은 선택 과제(짧은 로드맵)

1. Upstash/Vercel KV로 **전역 레이트리밋** 전환
2. `billing.ts`에 **금액/그랜트 상수 단일화**(SSOT) → API/Webhook 동시 참조
3. Webhook/Generate에 **requestId 상호전달** → 장애 재현 속도 향상

---

> 위 내용을 배포 체크리스트에 포함시키고, CI/CD 후크로 최소한의 헬스·API 체크를 자동화하면 운영 안정성이 크게 향상됩니다.

---

## 최종 운영 체크(짧고 굵게)

1. **키/시크릿 롤링 플레이북**
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE` 롤링 절차를 3단계로 명시: 새 키 발급 → Vercel 업데이트 → `/api/health` 및 Stripe CLI 검증 → 구키 폐기.

2. **AdSense 정책 & 예외 경로**
   - 광고 금지 페이지(결제 완료/로그인/설정 등)에서 상·하단 광고 비활성 + `--bannerH` 0 처리 확인.
   - 개인정보 페이지는 광고와 사용자 데이터가 섞이지 않도록 최종 점검.

3. **오류 샘플링·알림**
   - `api/stripe/webhook`, `api/generate-prompt` 4xx/5xx 및 `NOT_ENOUGH_CREDITS` 비율 알림 설정.
   - 로그 공통 필드(`route`, `requestId`, `userId`, `elapsedMs`) 준수 여부 확인.

4. **멱등/원장 리포트 단축 링크**
   - 최근 24h `webhook_events` 히트맵, `wallet_ledger.ext_event_id` 조회 뷰를 대시보드에 북마크.

5. **레이트리밋: 스위치 레버**
   - `RATE_LIMIT_BACKEND=memory|kv|upstash` 환경 변수를 도입해 외부 스토리지 전환을 원클릭으로 준비.

6. **RLS 재확인(마지막 한 줄)**
   - Supabase SQL Editor에서 `wallets`, `wallet_ledger` 읽기 정책이 `using (auth.uid() = user_id)`인지 최종 확인.

---

> `.env` 템플릿에 `RATE_LIMIT_BACKEND`, `UPSTASH_REDIS_*`(또는 Vercel KV) 항목을 미리 추가해 두고, 실제 전환은 필요 시 적용하세요.


