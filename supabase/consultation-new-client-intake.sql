-- Apply after consultation-confirmations.sql and notification-jobs.sql, before deploying updated functions.
alter table public.consultation_orders add column if not exists client_type text;
alter table public.consultation_orders drop constraint if exists consultation_orders_client_type_check;
alter table public.consultation_orders add constraint consultation_orders_client_type_check check (client_type in ('new','returning'));
alter table public.notification_jobs drop constraint if exists notification_jobs_kind_check;
alter table public.notification_jobs add constraint notification_jobs_kind_check check(kind in ('consultation_push','consultation_email','consultation_intake_email','product_push','product_push_delayed','product_thank_you','product_replenishment'));
create or replace function public.enqueue_new_client_intake() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='paid' and old.status is distinct from 'paid' and new.client_type='new' then
  insert into public.notification_jobs(job_key,kind,order_ref) values ('consultation-intake:'||new.id,'consultation_intake_email',new.id::text) on conflict do nothing;
 end if;
 return new;
end $$;
revoke all on function public.enqueue_new_client_intake() from public,anon,authenticated;
drop trigger if exists consultation_new_client_intake on public.consultation_orders;
create trigger consultation_new_client_intake after update of status on public.consultation_orders for each row execute function public.enqueue_new_client_intake();
-- Reserve the slot and record client status in one transaction.
create or replace function public.reserve_consultation_v2(p_slot uuid,p_name text,p_email text,p_phone text,p_client_type text)
returns public.consultation_orders language plpgsql security definer set search_path=public as $$
declare s public.portal_availability; result public.consultation_orders; cents integer;
begin
 if p_client_type not in ('new','returning') or p_client_type is null then raise exception 'Invalid client status'; end if;
 select * into s from public.portal_availability where id=p_slot and enabled and starts_at>now() for update;
 if not found then raise exception 'This time is unavailable'; end if;
 select round(consultation_price*100)::integer into cents from public.portal_settings where id=true;
 if cents is null or cents<100 then raise exception 'Online booking is not configured'; end if;
 if length(trim(p_name)) not between 1 and 120 or length(trim(p_email)) not between 3 and 254 or length(coalesce(p_phone,''))>40 then raise exception 'Invalid contact information'; end if;
 insert into public.consultation_orders(availability_id,name,email,phone,starts_at,ends_at,amount_cents,client_type)
 values(s.id,trim(p_name),lower(trim(p_email)),coalesce(trim(p_phone),''),s.starts_at,s.ends_at,cents,p_client_type) returning * into result;
 return result;
end $$;
revoke all on function public.reserve_consultation_v2(uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_consultation_v2(uuid,text,text,text,text) to service_role;
