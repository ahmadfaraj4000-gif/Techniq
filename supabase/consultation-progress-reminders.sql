create table if not exists public.consultation_progress (
 id uuid primary key default gen_random_uuid(),
 consultation_id uuid not null references public.portal_consultations(id) on delete cascade,
 customer_id uuid not null references public.portal_customers(id) on delete cascade,
 notes text not null check(length(trim(notes))>0), created_at timestamptz not null default now()
);
alter table public.consultation_progress enable row level security;
revoke all on public.consultation_progress from public,anon,authenticated;
grant select,insert,update,delete on public.consultation_progress to authenticated;
drop policy if exists consultation_progress_admin on public.consultation_progress;
create policy consultation_progress_admin on public.consultation_progress for all to authenticated using (public.techniq_is_admin()) with check (public.techniq_is_admin() and exists(select 1 from public.portal_consultations c where c.id=consultation_progress.consultation_id and c.customer_id=consultation_progress.customer_id));
alter table public.notification_jobs drop constraint if exists notification_jobs_kind_check;
alter table public.notification_jobs add constraint notification_jobs_kind_check check(kind in ('consultation_push','consultation_email','consultation_intake_email','consultation_receipt_email','intake_push','product_push','product_push_delayed','product_thank_you','product_replenishment','consultation_reminder_push','consultation_daily_push'));
-- Called by the existing minute worker. Keys include the appointment time to
-- avoid duplicate notices and allow a later rescheduled appointment to alert.
create or replace function public.enqueue_consultation_reminders() returns integer language plpgsql security definer set search_path=public as $$
declare local_now timestamp := now() at time zone 'America/New_York'; local_day date := (now() at time zone 'America/New_York')::date; added integer := 0; inserted integer;
begin
 insert into public.notification_jobs(job_key,kind,order_ref)
 select 'consultation-reminder:'||c.id||':'||floor(extract(epoch from c.starts_at))::bigint,'consultation_reminder_push',c.id::text
 from public.portal_consultations c where c.status='scheduled' and c.starts_at>now() and c.starts_at<=now()+interval '15 minutes'
 on conflict(job_key) do nothing;
 get diagnostics inserted = row_count; added := added + inserted;
 if local_now::time >= time '08:00' and local_now::time < time '09:00' then
  insert into public.notification_jobs(job_key,kind,order_ref)
  values ('consultation-daily:'||local_day::text,'consultation_daily_push',local_day::text) on conflict(job_key) do nothing;
  get diagnostics inserted = row_count; added := added + inserted;
 end if;
 return added;
end $$;
revoke all on function public.enqueue_consultation_reminders() from public,anon,authenticated;
grant execute on function public.enqueue_consultation_reminders() to service_role;

-- Keep intake-to-customer links even if the customer later changes email.
alter table public.client_intake_forms add column if not exists customer_id uuid references public.portal_customers(id) on delete set null;
update public.client_intake_forms f set customer_id=c.id from public.portal_customers c where f.customer_id is null and lower(trim(f.email))=lower(trim(c.email));
create or replace function public.sync_intake_customer() returns trigger language plpgsql security definer set search_path=public as $$
declare customer uuid;
begin
 if new.email is not null and trim(new.email)<>'' then
  insert into public.portal_customers(name,email,phone) values(coalesce(nullif(trim(new.full_name),''),'Unnamed client'),lower(trim(new.email)),coalesce(trim(new.phone),'')) on conflict (lower(email)) do nothing;
  select id into customer from public.portal_customers where lower(email)=lower(trim(new.email));
 end if;
 update public.client_intake_forms set customer_id=customer where id=new.id;
 return new;
end $$;
revoke all on function public.sync_intake_customer() from public,anon,authenticated;
create or replace function public.list_daily_consultations(p_day date) returns table(starts_at timestamptz, customer_name text) language sql stable security definer set search_path=public as $$
 select c.starts_at,coalesce(p.name,'Unassigned') from public.portal_consultations c left join public.portal_customers p on p.id=c.customer_id
 where c.status='scheduled' and (c.starts_at at time zone 'America/New_York')::date=p_day order by c.starts_at
$$;
revoke all on function public.list_daily_consultations(date) from public,anon,authenticated;
grant execute on function public.list_daily_consultations(date) to service_role;

-- Progress belongs to the original customer; keep it attached if a consultation is edited.
create or replace function public.prevent_progress_customer_change() returns trigger language plpgsql set search_path=public as $$
begin
 if new.customer_id is distinct from old.customer_id and exists(select 1 from public.consultation_progress where consultation_id=old.id) then
  raise exception 'The customer cannot be changed after progress notes have been added.';
 end if;
 return new;
end $$;
drop trigger if exists prevent_progress_customer_change on public.portal_consultations;
create trigger prevent_progress_customer_change before update of customer_id on public.portal_consultations for each row execute function public.prevent_progress_customer_change();
