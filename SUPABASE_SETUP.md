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

## 6. 지갑/크레딧 테이블 및 RLS 설정

아래 SQL을 Supabase Dashboard → SQL Editor에 붙여넣고 실행합니다.  
유저별 지갑(`wallets`)과 거래 내역(`wallet_ledger`)을 만들고, 가입 시 자동 생성/크레딧 증감 함수 및 RLS 정책을 설정합니다.

```sql
-- wallets: 유저별 크레딧 잔액
create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 사후 로그 (거래 내역)
create table if not exists public.wallet_ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- 신규 가입시 지갑 자동 생성
create or replace function public.ensure_wallet_row()
returns trigger language plpgsql as $$
begin
  insert into public.wallets (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists ensure_wallet_on_signup on auth.users;
create trigger ensure_wallet_on_signup
after insert on auth.users
for each row execute function public.ensure_wallet_row();

-- 크레딧 차감(원자적)
create or replace function public.spend_credits(p_user uuid, p_amount int, p_reason text)
returns boolean language plpgsql security definer as $$
declare
  newbal integer;
begin
  if p_amount <= 0 then
    raise exception 'amount must be > 0';
  end if;

  update public.wallets
  set balance = balance - p_amount,
      updated_at = now()
  where user_id = p_user
    and balance >= p_amount
  returning balance into newbal;

  if not found then
    return false;
  end if;

  insert into public.wallet_ledger(user_id, delta, reason)
  values(p_user, -p_amount, p_reason);
  return true;
end; $$;

-- 크레딧 지급(관리자/웹훅)
create or replace function public.grant_credits(p_user uuid, p_amount int, p_reason text)
returns void language plpgsql security definer as $$
begin
  update public.wallets
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user;

  insert into public.wallet_ledger(user_id, delta, reason)
  values(p_user, p_amount, p_reason);
end; $$;

-- RLS 정책
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;

drop policy if exists sel_own_wallet on public.wallets;
create policy sel_own_wallet on public.wallets
  for select using (auth.uid() = user_id);

drop policy if exists sel_own_ledger on public.wallet_ledger;
create policy sel_own_ledger on public.wallet_ledger
  for select using (auth.uid() = user_id);
```

### 추가 보강 SQL (권장)

아래 스크립트를 순서대로 실행하면 음수 잔액 방지, 외부 이벤트 추적, Stripe 웹훅 멱등 처리를 위한 구조가 갖춰집니다.

```sql
-- 1) 잔액 음수 방지 (테이블 제약)
alter table public.wallets
  add constraint if not exists wallets_balance_nonnegative check (balance >= 0);

-- 2) 원장에 외부 이벤트 ID 기록용 컬럼/인덱스
alter table public.wallet_ledger add column if not exists ext_event_id text;
create index if not exists wallet_ledger_ext_event_idx
  on public.wallet_ledger (ext_event_id) where ext_event_id is not null;

-- 3) 크레딧 지급 RPC 확장 (외부 이벤트 ID 기록)
create or replace function public.grant_credits(
  p_user uuid,
  p_amount int,
  p_reason text,
  p_ext_event_id text default null
) returns boolean
language plpgsql
security definer
as $$
begin
  if p_amount <= 0 then
    raise exception 'amount must be > 0';
  end if;

  update public.wallets
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user;

  insert into public.wallet_ledger(user_id, delta, reason, ext_event_id)
  values(p_user, p_amount, p_reason, p_ext_event_id);

  return true;
end;
$$;

-- 4) Stripe 멱등성 기록 테이블 + 원자적 선점(Claim) 함수
create table if not exists public.webhook_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz default now()
);

create or replace function public.claim_webhook_event(
  p_event_id text,
  p_type text
) returns boolean
language plpgsql
security definer
as $$
begin
  insert into public.webhook_events(event_id, type)
  values (p_event_id, p_type)
  on conflict do nothing;

  return found;
end;
$$;
```

> **TIP:** `claim_webhook_event`가 `false`를 반환하면 이미 처리된 이벤트이므로 서버에서는 멱등 처리 후 바로 200 응답을 보내면 됩니다.

## 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요 (이미 .gitignore에 추가됨)
- Supabase가 설정되지 않으면 Mock 로그인으로 자동 전환됩니다








