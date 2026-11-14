-- A separate job per delivery avoids one provider failure hiding the other.
create table if not exists public.notification_jobs (
 id uuid primary key default gen_random_uuid(), job_key text not null unique,
 kind text not null check(kind in ('consultation_push','consultation_email','product_push','product_push_delayed','product_thank_you','product_replenishment')),
 order_ref text not null, due_at timestamptz not null default now(),
 state text not null default 'pending' check(state in ('pending','processing','sent','failed','unknown')),
 attempts integer not null default 0, last_error text, locked_at timestamptz, sent_at timestamptz, created_at timestamptz not null default now()
);
alter table public.notification_jobs enable row level security;
drop policy if exists notification_jobs_admin_read on public.notification_jobs;
create policy notification_jobs_admin_read on public.notification_jobs for select to authenticated using (public.techniq_is_admin());
revoke all on public.notification_jobs from public,anon,authenticated;
grant select on public.notification_jobs to authenticated;
create or replace function public.claim_notification_jobs(p_limit integer default 10)
returns setof public.notification_jobs language sql security definer set search_path=public as $$
 update public.notification_jobs set state='processing',locked_at=now(),attempts=attempts+1
 where id in (select id from public.notification_jobs where state='pending' and due_at<=now() order by due_at for update skip locked limit least(greatest(p_limit,1),20)) returning *
$$;
revoke all on function public.claim_notification_jobs(integer) from public,anon,authenticated;
grant execute on function public.claim_notification_jobs(integer) to service_role;
-- Network timeouts can mean a provider accepted the request. Mark them unknown for
-- human reconciliation rather than automatically producing duplicate messages.
create or replace function public.flag_stale_notification_jobs() returns integer language plpgsql security definer set search_path=public as $$
declare n integer; begin update public.notification_jobs set state='unknown',last_error='Delivery result unknown; review before retrying' where state='processing' and locked_at<now()-interval '10 minutes'; get diagnostics n=row_count; return n; end $$;
revoke all on function public.flag_stale_notification_jobs() from public,anon,authenticated;
grant execute on function public.flag_stale_notification_jobs() to service_role;
create or replace function public.enqueue_consultation_notification() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.event_type='consultation_paid' then
  insert into public.notification_jobs(job_key,kind,order_ref) values ('consultation-push:'||new.order_id,'consultation_push',new.order_id::text) on conflict do nothing;
 end if;
 return new;
end $$;
revoke all on function public.enqueue_consultation_notification() from public,anon,authenticated;
drop trigger if exists integration_events_enqueue_notification on public.integration_events;
create trigger integration_events_enqueue_notification after insert on public.integration_events for each row execute function public.enqueue_consultation_notification();
