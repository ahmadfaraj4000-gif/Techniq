alter table public.notification_jobs drop constraint if exists notification_jobs_kind_check;
alter table public.notification_jobs add constraint notification_jobs_kind_check check(kind in ('consultation_push','consultation_email','consultation_intake_email','consultation_receipt_email','product_push','product_push_delayed','product_thank_you','product_replenishment'));
create or replace function public.enqueue_consultation_receipt() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='paid' and old.status is distinct from 'paid' then
  insert into public.notification_jobs(job_key,kind,order_ref) values ('consultation-receipt:'||new.id,'consultation_receipt_email',new.id::text) on conflict do nothing;
 end if;
 return new;
end $$;
revoke all on function public.enqueue_consultation_receipt() from public,anon,authenticated;
create trigger consultation_paid_receipt after update of status on public.consultation_orders for each row execute function public.enqueue_consultation_receipt();
