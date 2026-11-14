-- Run in the existing Supabase project after verifying the admin email below.
-- This migration does not alter the existing intake table or its policies.
create extension if not exists pgcrypto;
create or replace function public.techniq_is_admin() returns boolean
language sql stable as $$ select lower(coalesce(auth.jwt()->>'email','')) = 'techniqskinandbeautyllc@gmail.com' $$;

create table if not exists public.portal_customers (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  phone text not null default '', focus text not null default '', current_products text not null default '',
  marketing_consent boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists portal_customers_email_idx on public.portal_customers (lower(email));
create table if not exists public.portal_visits (
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.portal_customers(id) on delete cascade,
  visit_date date not null default current_date, notes text not null, created_at timestamptz not null default now()
);
create table if not exists public.portal_consultations (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.portal_customers(id) on delete set null,
  starts_at timestamptz not null, status text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  meeting_url text not null default '', notes text not null default '', created_at timestamptz not null default now()
);
create table if not exists public.portal_promotions (
  id uuid primary key default gen_random_uuid(), template text not null, heading text not null, body text not null,
  button_text text not null default '', button_url text not null default '', created_at timestamptz not null default now()
);
create table if not exists public.portal_settings (
  id boolean primary key default true check (id), consultation_price numeric(10,2) not null default 0 check (consultation_price >= 0),
  followup_days integer not null default 90 check (followup_days between 1 and 730)
);
insert into public.portal_settings(id) values (true) on conflict do nothing;

do $$ declare t text; begin
  foreach t in array array['portal_customers','portal_visits','portal_consultations','portal_promotions','portal_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists portal_admin on public.%I', t);
    execute format('create policy portal_admin on public.%I for all to authenticated using (public.techniq_is_admin()) with check (public.techniq_is_admin())', t);
  end loop;
end $$;

-- Explicit availability windows; the public booking flow is not yet enabled.
create table if not exists public.portal_availability (
  id uuid primary key default gen_random_uuid(), starts_at timestamptz not null,
  ends_at timestamptz not null, enabled boolean not null default true,
  created_at timestamptz not null default now(),
  constraint portal_availability_duration check (ends_at > starts_at),
  constraint portal_availability_no_overlap exclude using gist (tstzrange(starts_at, ends_at, '[)') with &&)
);
alter table public.portal_availability enable row level security;
drop policy if exists portal_admin on public.portal_availability;
create policy portal_admin on public.portal_availability for all to authenticated using (public.techniq_is_admin()) with check (public.techniq_is_admin());
