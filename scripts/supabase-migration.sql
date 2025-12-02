-- Stripe 이벤트 중복 처리 방지
create table if not exists public.stripe_events (
  id text primary key,
  received_at timestamptz not null default now()
);

-- 무제한 플래그
alter table public.wallets
  add column if not exists unlimited boolean not null default false;

-- 원장(없으면 생성)
create table if not exists public.credit_ledger (
  id bigserial primary key,
  user_id uuid not null,
  delta integer not null,
  reason text,
  created_at timestamptz not null default now()
);

-- 지급
create or replace function public.grant_credits(p_user uuid, p_amount integer, p_reason text)
returns void language plpgsql as $$
begin
  update public.wallets set balance = coalesce(balance,0) + greatest(p_amount,0)
  where user_id = p_user;
  insert into public.credit_ledger(user_id, delta, reason)
  values (p_user, greatest(p_amount,0), coalesce(p_reason,'grant'));
end; $$;

-- 차감
create or replace function public.spend_credits(p_user uuid, p_amount integer, p_reason text)
returns void language plpgsql as $$
declare cur_balance integer;
begin
  select balance into cur_balance from public.wallets where user_id = p_user for update;
  if cur_balance is null or cur_balance < p_amount then
    raise exception 'NOT_ENOUGH_CREDITS';
  end if;
  update public.wallets set balance = cur_balance - p_amount where user_id = p_user;
  insert into public.credit_ledger(user_id, delta, reason)
  values (p_user, -greatest(p_amount,0), coalesce(p_reason,'spend'));
end; $$;

-- RLS
alter table public.wallets enable row level security;
create policy if not exists wallets_select_own on public.wallets
for select using (auth.uid() = user_id);
create policy if not exists wallets_update_own on public.wallets
for update using (auth.uid() = user_id);

