alter table public.portal_availability add column if not exists recurring boolean not null default false;
create table if not exists public.portal_weekly_schedule(id boolean primary key default true check(id),enabled boolean not null default false,slots jsonb not null default '[]',updated_at timestamptz not null default now());
alter table public.portal_weekly_schedule enable row level security;
create policy weekly_admin on public.portal_weekly_schedule for all to authenticated using(public.techniq_is_admin()) with check(public.techniq_is_admin());
grant select on public.portal_weekly_schedule to authenticated;
insert into public.portal_weekly_schedule(id) values(true) on conflict do nothing;
create or replace function public.materialize_weekly_availability() returns integer language plpgsql security definer set search_path=public as $$
declare cfg public.portal_weekly_schedule; day date; slot jsonb; t timestamptz; n integer:=0; begin
perform pg_advisory_xact_lock(742091);
select * into cfg from portal_weekly_schedule where id;
if not cfg.enabled then return 0;end if;
for day in select generate_series((now() at time zone 'America/New_York')::date,(now() at time zone 'America/New_York')::date+90,interval '1 day')::date loop
for slot in select value from jsonb_array_elements(cfg.slots) where (value->>'day')::int=extract(dow from day)::int loop
 t:=(day::timestamp+make_interval(mins=>(slot->>'minute')::int)) at time zone 'America/New_York';
 if t<=now() then continue;end if;
 update portal_availability a set enabled=true where a.recurring and a.starts_at=t and not exists(select 1 from consultation_orders o where o.availability_id=a.id and o.status in ('paid','awaiting_payment','creating_checkout','needs_attention'));
 if not exists(select 1 from portal_availability where starts_at<t+interval '30 minutes' and ends_at>t) then
 insert into portal_availability(starts_at,ends_at,enabled,recurring) values(t,t+interval '30 minutes',true,true);n:=n+1;
 end if;
end loop;end loop;return n;end $$;
create or replace function public.set_weekly_schedule(p_slots jsonb,p_enabled boolean) returns integer language plpgsql security definer set search_path=public as $$ begin
if not public.techniq_is_admin() then raise exception 'Unauthorized';end if;
if jsonb_typeof(p_slots)<>'array' or jsonb_array_length(p_slots)>140 then raise exception 'Invalid weekly schedule';end if;
if exists(select 1 from jsonb_array_elements(p_slots) s where (s->>'day')::int not between 0 and 6 or (s->>'minute')::int not between 480 and 1050 or (s->>'minute')::int%30<>0 or not(s ? 'day' and s ? 'minute')) then raise exception 'Invalid business hours';end if;
perform pg_advisory_xact_lock(742091);
update portal_weekly_schedule set slots=p_slots,enabled=p_enabled,updated_at=now() where id;
update portal_availability a set enabled=false where recurring and starts_at>now() and not exists(select 1 from consultation_orders o where o.availability_id=a.id and o.status in ('paid','awaiting_payment','creating_checkout','needs_attention'));
return materialize_weekly_availability();end $$;
revoke all on function public.set_weekly_schedule(jsonb,boolean),public.materialize_weekly_availability() from public,anon,authenticated;
grant execute on function public.set_weekly_schedule(jsonb,boolean) to authenticated;
-- Explicit individual-week edits remain exceptions to the repeating schedule.
do $$ declare definition text;begin
select pg_get_functiondef('public.publish_availability(jsonb)'::regprocedure) into definition;
definition:=replace(definition,'set enabled=(item->>''enabled'')::boolean','set recurring=false,enabled=(item->>''enabled'')::boolean');execute definition;
end $$;
select cron.schedule('techniq-weekly-availability','5 5 * * *','select public.materialize_weekly_availability()');
