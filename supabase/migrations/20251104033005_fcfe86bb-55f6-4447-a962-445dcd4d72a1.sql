-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type public.app_role as enum ('admin', 'user');
create type public.client_status as enum ('active', 'pending', 'inactive', 'negotiation');

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  avatar text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Create clients table (single source of truth)
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  country text not null,
  latitude numeric(10, 6) not null,
  longitude numeric(10, 6) not null,
  industry text not null,
  status client_status not null default 'pending',
  assigned_user_id uuid references public.profiles(id) on delete set null,
  last_contact timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.clients enable row level security;

-- Create security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User roles policies
create policy "Users can view all roles"
  on public.user_roles for select
  using (true);

create policy "Admins can manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- Clients policies
create policy "Authenticated users can view clients"
  on public.clients for select
  to authenticated
  using (true);

create policy "Authenticated users can create clients"
  on public.clients for insert
  to authenticated
  with check (true);

create policy "Users can update clients they're assigned to"
  on public.clients for update
  to authenticated
  using (assigned_user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete clients"
  on public.clients for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_clients_updated_at
  before update on public.clients
  for each row
  execute function public.update_updated_at_column();

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar'
  );
  
  -- Assign user role by default
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();