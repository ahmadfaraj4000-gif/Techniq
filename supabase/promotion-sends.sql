create table if not exists public.promotion_sends (
 id uuid primary key, promotion_id uuid references public.portal_promotions(id), recipient_count integer not null check(recipient_count>0),
 state text not null check(state in ('preparing','sending','sent','unknown')), brevo_campaign_id bigint, created_at timestamptz not null default now()
);
alter table public.promotion_sends enable row level security;
revoke all on public.promotion_sends from public,anon,authenticated;
grant select on public.promotion_sends to authenticated;
create policy promotion_sends_admin_read on public.promotion_sends for select to authenticated using (public.techniq_is_admin());
