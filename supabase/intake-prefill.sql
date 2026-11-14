alter table public.consultation_orders add column if not exists dob date;
alter table public.consultation_orders add column if not exists intake_token uuid not null default gen_random_uuid();
create unique index if not exists consultation_intake_token_idx on public.consultation_orders(intake_token);
