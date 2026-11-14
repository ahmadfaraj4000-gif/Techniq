-- Bring intake clients into the portal without treating intake consent as marketing consent.
insert into public.portal_customers(name,email,phone)
select distinct on (lower(trim(email))) coalesce(nullif(trim(full_name),''),'Unnamed client'),lower(trim(email)),coalesce(trim(phone),'')
from public.client_intake_forms where email is not null and trim(email) <> ''
order by lower(trim(email)),created_at desc
on conflict (lower(email)) do nothing;
create or replace function public.sync_intake_customer() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.email is not null and trim(new.email)<>'' then
  insert into public.portal_customers(name,email,phone) values(coalesce(nullif(trim(new.full_name),''),'Unnamed client'),lower(trim(new.email)),coalesce(trim(new.phone),'')) on conflict (lower(email)) do nothing;
 end if;
 return new;
end $$;
revoke all on function public.sync_intake_customer() from public,anon,authenticated;
drop trigger if exists sync_intake_customer on public.client_intake_forms;
create trigger sync_intake_customer after insert on public.client_intake_forms for each row execute function public.sync_intake_customer();
-- Item details are linked to registered Square orders and counted only after verified payment.
create table if not exists public.storefront_order_items (id bigint generated always as identity primary key,square_order_id text not null references public.storefront_checkout_orders(square_order_id),product_name text not null,variant text not null,quantity integer not null check(quantity>0),unit_amount_cents integer not null check(unit_amount_cents>0));
alter table public.storefront_order_items enable row level security;
revoke all on public.storefront_order_items from public,anon,authenticated;
grant select on public.storefront_order_items to authenticated;
drop policy if exists storefront_items_admin_read on public.storefront_order_items;
create policy storefront_items_admin_read on public.storefront_order_items for select to authenticated using (public.techniq_is_admin());
