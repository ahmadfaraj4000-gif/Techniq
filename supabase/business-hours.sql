create or replace function public.consultation_business_hours(s timestamptz,e timestamptz) returns boolean language sql immutable as $$ select (s at time zone 'America/New_York')::date=(e at time zone 'America/New_York')::date and (s at time zone 'America/New_York')::time >= time '08:00' and (e at time zone 'America/New_York')::time <= time '18:00' and e>s $$;
do $$ declare f record; definition text; begin
for f in select oid from pg_proc where pronamespace='public'::regnamespace and proname in ('reserve_consultation','reserve_consultation_v2','list_consultation_slots') loop
 definition:=pg_get_functiondef(f.oid);
 if position('consultation_business_hours' in definition)=0 then
 definition:=replace(definition,'where id=p_slot and enabled','where id=p_slot and public.consultation_business_hours(starts_at,ends_at) and enabled');
 definition:=replace(definition,'and a.enabled','and public.consultation_business_hours(a.starts_at,a.ends_at) and a.enabled');
 execute definition;
 end if;
end loop; end $$;
