-- Paid consultation booking: deploy only with the accompanying Edge Functions.
-- Holds are never automatically released: an unpaid Square link can still be paid.
create table if not exists public.consultation_orders (
 id uuid primary key default gen_random_uuid(), availability_id uuid not null references public.portal_availability(id),
 name text not null, email text not null, phone text not null default '',
 starts_at timestamptz not null, ends_at timestamptz not null,
 amount_cents integer not null check (amount_cents > 0),
 status text not null default 'creating_checkout' check (status in ('creating_checkout','awaiting_payment','paid','checkout_failed','needs_attention')),
 square_order_id text unique, square_payment_id text unique, checkout_url text,
 created_at timestamptz not null default now(), paid_at timestamptz
);
create unique index if not exists consultation_one_active_slot on public.consultation_orders(availability_id)
 where status in ('creating_checkout','awaiting_payment','paid','needs_attention');
alter table public.consultation_orders enable row level security;
create policy consultation_orders_admin_read on public.consultation_orders for select to authenticated using (public.techniq_is_admin());
revoke all on public.consultation_orders from anon, authenticated;
grant select on public.consultation_orders to authenticated;
create or replace function public.reserve_consultation(p_slot uuid,p_name text,p_email text,p_phone text)
returns public.consultation_orders language plpgsql security definer set search_path=public as $$
declare s public.portal_availability; result public.consultation_orders; cents integer;
begin
 select * into s from public.portal_availability where id=p_slot and enabled and starts_at > now() for update;
 if not found then raise exception 'This time is unavailable'; end if;
 select round(consultation_price*100)::integer into cents from public.portal_settings where id=true;
 if cents is null or cents < 100 then raise exception 'Online booking is not configured'; end if;
 if length(trim(p_name)) not between 1 and 120 or length(trim(p_email)) not between 3 and 254 or length(coalesce(p_phone,'')) > 40 then raise exception 'Invalid contact information'; end if;
 insert into public.consultation_orders(availability_id,name,email,phone,starts_at,ends_at,amount_cents)
 values (s.id,trim(p_name),lower(trim(p_email)),coalesce(trim(p_phone),''),s.starts_at,s.ends_at,cents) returning * into result;
 return result;
end $$;
revoke all on function public.reserve_consultation(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.reserve_consultation(uuid,text,text,text) to service_role;
create or replace function public.list_consultation_slots()
returns table(id uuid, starts_at timestamptz, ends_at timestamptz, amount_cents integer)
language sql stable security definer set search_path=public as $$
 select a.id,a.starts_at,a.ends_at,round(s.consultation_price*100)::integer from public.portal_availability a cross join public.portal_settings s
 where s.id and s.consultation_price >= 1 and a.enabled and a.starts_at > now()
 and not exists(select 1 from public.consultation_orders o where o.availability_id=a.id and o.status in ('creating_checkout','awaiting_payment','paid','needs_attention'))
 order by a.starts_at limit 100
$$;
revoke all on function public.list_consultation_slots() from public, anon, authenticated;
grant execute on function public.list_consultation_slots() to service_role;
create table if not exists public.integration_events (
 id uuid primary key default gen_random_uuid(), event_key text not null unique, event_type text not null,
 order_id uuid references public.consultation_orders(id), state text not null default 'pending',
 attempts integer not null default 0, last_error text, created_at timestamptz not null default now()
);
alter table public.integration_events enable row level security;
create policy integration_events_admin_read on public.integration_events for select to authenticated using (public.techniq_is_admin());
revoke all on public.integration_events from anon, authenticated;
grant select on public.integration_events to authenticated;
create or replace function public.finalize_consultation_payment(p_order text,p_payment text,p_amount bigint,p_currency text)
returns text language plpgsql security definer set search_path=public as $$
declare o public.consultation_orders; customer uuid;
begin
 select * into o from public.consultation_orders where square_order_id=p_order for update;
 if not found then return 'unknown_order'; end if;
 if o.status='paid' then return 'already_paid'; end if;
 if o.status not in ('awaiting_payment','creating_checkout') or o.amount_cents<>p_amount or p_currency<>'USD' then
 update public.consultation_orders set status='needs_attention' where id=o.id;
 insert into public.integration_events(event_key,event_type,order_id,state,last_error) values ('payment-review:'||p_payment,'payment_review',o.id,'failed','Payment requires manual review') on conflict do nothing;
 return 'needs_attention'; end if;
 insert into public.portal_customers(name,email,phone) values(o.name,o.email,o.phone)
 on conflict (lower(email)) do update set updated_at=now() returning id into customer;
 insert into public.portal_consultations(customer_id,starts_at,status) values(customer,o.starts_at,'scheduled');
 update public.consultation_orders set status='paid',square_payment_id=p_payment,paid_at=now() where id=o.id;
 insert into public.integration_events(event_key,event_type,order_id) values ('consultation-paid:'||o.id,'consultation_paid',o.id) on conflict do nothing;
 return 'paid';
end $$;
revoke all on function public.finalize_consultation_payment(text,text,bigint,text) from public, anon, authenticated;
grant execute on function public.finalize_consultation_payment(text,text,bigint,text) to service_role;
