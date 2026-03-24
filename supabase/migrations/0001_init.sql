-- AIOScore.org starter schema
-- NOTE: This is a baseline schema for MVP velocity. Harden row-level policies and abuse prevention before production.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  email_verified boolean not null default false,
  accepted_terms_at timestamptz,
  marketing_opt_in boolean not null default false,
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_limits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  ip_address text,
  device_id text,
  free_scans_used int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ip_address text,
  device_id text,
  scan_url text not null,
  scan_status text not null default 'queued',
  overall_score int,
  partial_access boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scan_results (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid unique not null references public.scans(id) on delete cascade,
  result_json jsonb not null,
  section_scores jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  marketing_opt_in boolean not null default false,
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, last_name, email, phone, accepted_terms_at, marketing_opt_in, newsletter_opt_in)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name',''),
    coalesce(new.raw_user_meta_data->>'last_name',''),
    new.email,
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'accepted_terms_at')::timestamptz,
    coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false),
    coalesce((new.raw_user_meta_data->>'newsletter_opt_in')::boolean, false)
  );

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'inactive');

  insert into public.email_preferences (user_id, marketing_opt_in, newsletter_opt_in)
  values (new.id, coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false), coalesce((new.raw_user_meta_data->>'newsletter_opt_in')::boolean, false));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RLS Starter
alter table public.profiles enable row level security;
alter table public.scans enable row level security;
alter table public.scan_results enable row level security;
alter table public.usage_limits enable row level security;
alter table public.subscriptions enable row level security;
alter table public.email_preferences enable row level security;

create policy "profiles_owner" on public.profiles for all using (auth.uid() = id);
create policy "scans_owner" on public.scans for all using (auth.uid() = user_id);
create policy "results_owner" on public.scan_results for select using (exists(select 1 from public.scans s where s.id = scan_id and s.user_id = auth.uid()));
create policy "usage_owner" on public.usage_limits for all using (auth.uid() = user_id);
create policy "subscriptions_owner" on public.subscriptions for all using (auth.uid() = user_id);
create policy "email_preferences_owner" on public.email_preferences for all using (auth.uid() = user_id);
