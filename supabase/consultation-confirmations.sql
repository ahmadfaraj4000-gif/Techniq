-- Each verified order owns its consultation so confirmations cannot be sent
-- to a different customer's appointment.
alter table public.consultation_orders add column if not exists consultation_id uuid references public.portal_consultations(id);
create unique index if not exists consultation_order_consultation_idx on public.consultation_orders(consultation_id) where consultation_id is not null;
create or replace function public.finalize_consultation_payment(p_order text,p_payment text,p_amount bigint,p_currency text)
returns text language plpgsql security definer set search_path=public as $$
declare o public.consultation_orders; customer uuid; consultation uuid;
begin
 select * into o from public.consultation_orders where square_order_id=p_order for update;
 if not found then return 'unknown_order'; end if;
 if o.status='paid' then
  if o.square_payment_id=p_payment then return 'already_paid'; end if;
  insert into public.integration_events(event_key,event_type,order_id,state,last_error) values ('payment-review:'||p_payment,'payment_review',o.id,'failed','Additional payment requires manual review') on conflict do nothing;
  return 'needs_attention';
 end if;
 if o.status not in ('awaiting_payment','creating_checkout') or o.amount_cents<>p_amount or p_currency<>'USD' then
  update public.consultation_orders set status='needs_attention' where id=o.id;
  insert into public.integration_events(event_key,event_type,order_id,state,last_error) values ('payment-review:'||p_payment,'payment_review',o.id,'failed','Payment requires manual review') on conflict do nothing;
  return 'needs_attention';
 end if;
 insert into public.portal_customers(name,email,phone) values(o.name,o.email,o.phone) on conflict (lower(email)) do update set updated_at=now() returning id into customer;
 insert into public.portal_consultations(customer_id,starts_at,status) values(customer,o.starts_at,'scheduled') returning id into consultation;
 update public.consultation_orders set status='paid',square_payment_id=p_payment,paid_at=now(),consultation_id=consultation where id=o.id;
 insert into public.integration_events(event_key,event_type,order_id) values ('consultation-paid:'||o.id,'consultation_paid',o.id) on conflict do nothing;
 return 'paid';
end $$;
revoke all on function public.finalize_consultation_payment(text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.finalize_consultation_payment(text,text,bigint,text) to service_role;
create or replace function public.enqueue_consultation_confirmation() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='scheduled' and new.meeting_url ~ '^https://meet[.]google[.]com/[a-zA-Z0-9-]+([/?#].*)?$' then
  insert into public.notification_jobs(job_key,kind,order_ref)
  select 'consultation-email:'||id,'consultation_email',id::text from public.consultation_orders where consultation_id=new.id and status='paid' on conflict do nothing;
 end if;
 return new;
end $$;
revoke all on function public.enqueue_consultation_confirmation() from public,anon,authenticated;
drop trigger if exists portal_consultation_confirmation on public.portal_consultations;
create trigger portal_consultation_confirmation after update of meeting_url on public.portal_consultations for each row execute function public.enqueue_consultation_confirmation();
