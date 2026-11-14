-- Track only payment links created by this storefront. No customer details are stored here.
create table if not exists public.storefront_checkout_orders (
 square_order_id text primary key,
 created_at timestamptz not null default now()
);
create table if not exists public.storefront_payments (
 square_payment_id text primary key,
 square_order_id text not null references public.storefront_checkout_orders(square_order_id),
 amount_cents bigint not null check (amount_cents > 0),
 currency text not null,
 paid_at timestamptz not null default now()
);
alter table public.storefront_checkout_orders enable row level security;
alter table public.storefront_payments enable row level security;
revoke all on public.storefront_checkout_orders,public.storefront_payments from public,anon,authenticated;
grant select on public.storefront_payments to authenticated;
drop policy if exists storefront_payments_admin_read on public.storefront_payments;
create policy storefront_payments_admin_read on public.storefront_payments for select to authenticated using (public.techniq_is_admin());
create or replace function public.record_storefront_payment(p_order text,p_payment text,p_amount bigint,p_currency text)
returns text language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from public.storefront_checkout_orders where square_order_id=p_order) then return 'unknown_order'; end if;
 if p_amount<=0 or p_currency<>'USD' then return 'invalid_payment'; end if;
 insert into public.storefront_payments(square_payment_id,square_order_id,amount_cents,currency)
 values(p_payment,p_order,p_amount,p_currency) on conflict do nothing;
 if not found then return 'already_recorded'; end if;
 insert into public.notification_jobs(job_key,kind,order_ref,due_at) values
 ('product-push:'||p_payment,'product_push',p_payment,now()),
 ('product-push-delayed:'||p_payment,'product_push_delayed',p_payment,now()+interval '3 hours');
 return 'recorded';
end $$;
revoke all on function public.record_storefront_payment(text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.record_storefront_payment(text,text,bigint,text) to service_role;
