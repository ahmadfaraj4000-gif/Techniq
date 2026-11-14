alter table public.portal_consultations add column if not exists focus text not null default '';
alter table public.portal_consultations add column if not exists current_products text not null default '';
-- Existing profile-level entries are retained in their original columns;
-- they are not copied into historical appointments as if recorded at that visit.

-- Progress is loaded only when a consultation is opened.
create or replace function public.portal_customer_details(p_id uuid) returns jsonb language sql stable security invoker set search_path=public as $$
select jsonb_build_object('customer',(select to_jsonb(c) from portal_customers c where id=p_id),'intakes',coalesce((select jsonb_agg(x) from (select id,customer_id,created_at,reviewed_at from client_intake_forms where customer_id=p_id order by created_at desc) x),'[]'),'consultations',coalesce((select jsonb_agg(x) from (select id,customer_id,starts_at,status from portal_consultations where customer_id=p_id order by starts_at desc) x),'[]'),'visits',coalesce((select jsonb_agg(v order by visit_date desc) from portal_visits v where customer_id=p_id),'[]'),'progress','[]'::jsonb) $$;
