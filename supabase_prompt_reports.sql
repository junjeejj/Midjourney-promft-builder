create table if not exists public.prompt_reports (
  id bigserial primary key,
  prompt text not null,
  reason text not null,
  page_path text,
  flagged_labels text[],
  created_at timestamptz not null default now()
);







