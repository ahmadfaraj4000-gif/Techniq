alter table public.portal_consultations add column if not exists focus text not null default '';
alter table public.portal_consultations add column if not exists current_products text not null default '';
-- Existing profile-level entries are retained in their original columns;
-- they are not copied into historical appointments as if recorded at that visit.
