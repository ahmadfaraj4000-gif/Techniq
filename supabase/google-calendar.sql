-- Durable, service-only Calendar work queue; no OAuth credentials enter tables.
alter table public.portal_consultations add column if not exists calendar_sync_error text;
alter table public.portal_consultations add column if not exists calendar_synced_at timestamptz;
create table if not exists public.google_calendar_jobs (
 consultation_id uuid primary key references public.portal_consultations(id) on delete cascade,
 version bigint not null default 1, state text not null default 'pending',
 available_at timestamptz not null default now(), attempts int not null default 0,
 last_error text
);
create index if not exists calendar_jobs_due_idx on public.google_calendar_jobs(available_at) where state in ('pending','processing');
alter table public.google_calendar_jobs enable row level security;
revoke all on public.google_calendar_jobs from anon,authenticated;
create or replace function public.queue_consultation_calendar() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if tg_op='INSERT' or new.starts_at is distinct from old.starts_at or new.status is distinct from old.status then
  insert into google_calendar_jobs(consultation_id) values(new.id)
  on conflict(consultation_id) do update set version=google_calendar_jobs.version+1,state='pending',available_at=now(),attempts=0,last_error=null;
 end if;
 return new;
end $$;
revoke all on function public.queue_consultation_calendar() from public;
drop trigger if exists consultation_calendar_queue on public.portal_consultations;
create trigger consultation_calendar_queue after insert or update of starts_at,status on public.portal_consultations for each row execute function public.queue_consultation_calendar();
create or replace function public.claim_calendar_jobs() returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;
begin
 with chosen as (select consultation_id from google_calendar_jobs where state in ('pending','processing') and available_at<=now() order by available_at limit 5 for update skip locked),
 claimed as (update google_calendar_jobs j set state='processing',available_at=now()+interval '3 minutes',attempts=attempts+1 from chosen x where x.consultation_id=j.consultation_id returning j.*)
 select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'version',j.version,'attempts',j.attempts,'starts_at',c.starts_at,'status',c.status,'meeting_url',c.meeting_url,'name',p.name,'duration_minutes',coalesce(extract(epoch from(o.ends_at-o.starts_at))/60,30))), '[]'::jsonb) into result from claimed j join portal_consultations c on c.id=j.consultation_id left join portal_customers p on p.id=c.customer_id left join consultation_orders o on o.consultation_id=c.id;
 return result;
end $$;
create or replace function public.finish_calendar_job(p_id uuid,p_version bigint,p_url text default null,p_error text default null) returns void language plpgsql security definer set search_path=public as $$
begin
 perform 1 from google_calendar_jobs where consultation_id=p_id and version=p_version for update;
 if not found then return; end if;
 update google_calendar_jobs set state=case when p_error is null then 'done' else 'pending' end,last_error=p_error,available_at=now()+interval '5 minutes' where consultation_id=p_id;
 update portal_consultations set meeting_url=case when p_url is not null and coalesce(meeting_url,'')='' then p_url else meeting_url end,calendar_sync_error=p_error,calendar_synced_at=case when p_error is null then now() else calendar_synced_at end where id=p_id;
end $$;
revoke all on function public.claim_calendar_jobs(),public.finish_calendar_job(uuid,bigint,text,text) from public,anon,authenticated;
grant execute on function public.claim_calendar_jobs(),public.finish_calendar_job(uuid,bigint,text,text) to service_role;
insert into public.google_calendar_jobs(consultation_id) select id from public.portal_consultations where status='scheduled' and starts_at>now() on conflict do nothing;
