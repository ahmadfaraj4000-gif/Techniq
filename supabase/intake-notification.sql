alter table public.notification_jobs drop constraint if exists notification_jobs_kind_check;
alter table public.notification_jobs add constraint notification_jobs_kind_check check(kind in ('consultation_push','consultation_email','consultation_intake_email','consultation_receipt_email','intake_push','product_push','product_push_delayed','product_thank_you','product_replenishment'));
create or replace function public.enqueue_intake_notification() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.notification_jobs(job_key,kind,order_ref) values ('intake-push:'||new.id,'intake_push',new.id::text) on conflict do nothing;
 return new;
end $$;
revoke all on function public.enqueue_intake_notification() from public,anon,authenticated;
create trigger intake_notification after insert on public.client_intake_forms for each row execute function public.enqueue_intake_notification();
