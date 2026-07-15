-- Supabase Migration: 20260704000000_init_schema.sql

-- Enable uuid-ossp extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  updated_at timestamp with time zone default now(),
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user'))
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create profiles policies
create policy "Allow public read-only profiles" on public.profiles
  for select using (true);

create policy "Allow users to update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    -- Assign admin to the first user or check metadata
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create site_settings table (Single row constraint)
create table public.site_settings (
  id boolean primary key default true constraint site_settings_single_row check (id = true),
  site_name text default 'My Portfolio CMS',
  logo_url text,
  favicon_url text,
  meta_title jsonb default '{"en": "Premium Portfolio", "ar": "معرض أعمال متميز"}'::jsonb,
  meta_description jsonb default '{"en": "Welcome to my portfolio", "ar": "مرحباً بكم في معرض أعمالي"}'::jsonb,
  keywords jsonb default '{"en": [], "ar": []}'::jsonb,
  analytics_id text,
  og_image_url text,
  contact_email text,
  phone text,
  location jsonb default '{"en": "", "ar": ""}'::jsonb,
  footer_text jsonb default '{"en": "© All rights reserved", "ar": "جميع الحقوق محفوظة ©"}'::jsonb,
  sections_order text[] default array['hero', 'about', 'skills', 'experience', 'projects', 'services', 'testimonials', 'certifications', 'contact'],
  sections_visibility jsonb default '{"hero": true, "about": true, "skills": true, "experience": true, "projects": true, "services": true, "testimonials": true, "certifications": true, "contact": true}'::jsonb,
  updated_at timestamp with time zone default now()
);

alter table public.site_settings enable row level security;
create policy "Allow public read site_settings" on public.site_settings for select using (true);
create policy "Allow admin write site_settings" on public.site_settings for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create hero table (Single row constraint)
create table public.hero (
  id boolean primary key default true constraint hero_single_row check (id = true),
  name jsonb default '{"en": "Alex Morgan", "ar": "أليكس مورجان"}'::jsonb,
  title jsonb default '{"en": "Senior Creative Developer", "ar": "مطور إبداعي أول"}'::jsonb,
  subtitle jsonb default '{"en": "Building interactive web experiences with polished designs", "ar": "بناء تجارب ويب تفاعلية بتصاميم مصقولة"}'::jsonb,
  cta_text jsonb default '{"en": "Explore Work", "ar": "استكشف أعمالي"}'::jsonb,
  cta_link text default '#projects',
  cta_text_secondary jsonb default '{"en": "Let''s Talk", "ar": "لنبدأ التحدث"}'::jsonb,
  cta_link_secondary text default '#contact',
  background_animation text default 'particles', -- particles, waves, none
  visible boolean default true,
  updated_at timestamp with time zone default now()
);

alter table public.hero enable row level security;
create policy "Allow public read hero" on public.hero for select using (true);
create policy "Allow admin write hero" on public.hero for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create about table (Single row constraint)
create table public.about (
  id boolean primary key default true constraint about_single_row check (id = true),
  biography jsonb default '{"en": "", "ar": ""}'::jsonb,
  skills_summary jsonb default '{"en": "", "ar": ""}'::jsonb,
  cv_url text,
  profile_image_url text,
  updated_at timestamp with time zone default now()
);

alter table public.about enable row level security;
create policy "Allow public read about" on public.about for select using (true);
create policy "Allow admin write about" on public.about for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create skill_categories table
create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name jsonb not null, -- e.g. {"en": "Frontend", "ar": "واجهة أمامية"}
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.skill_categories enable row level security;
create policy "Allow public read skill_categories" on public.skill_categories for select using (true);
create policy "Allow admin write skill_categories" on public.skill_categories for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create skills table
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.skill_categories(id) on delete cascade,
  name text not null,
  icon text, -- lucide icon name
  proficiency integer check (proficiency >= 0 and proficiency <= 100),
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.skills enable row level security;
create policy "Allow public read skills" on public.skills for select using (true);
create policy "Allow admin write skills" on public.skills for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create experience table
create table public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position jsonb not null, -- {"en": "Frontend Engineer", "ar": "مهندس واجهات"}
  start_date date not null,
  end_date date,
  current boolean default false,
  description jsonb not null, -- {"en": "text", "ar": "text"}
  technologies text[] default '{}',
  logo_url text,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.experience enable row level security;
create policy "Allow public read experience" on public.experience for select using (true);
create policy "Allow admin write experience" on public.experience for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb not null,
  full_description jsonb,
  challenges jsonb,
  solutions jsonb,
  features jsonb default '{"en": [], "ar": []}'::jsonb,
  cover_image text,
  tech_stack text[] default '{}',
  github_link text,
  live_demo text,
  category text, -- E.g. Web Development, UI/UX
  featured boolean default false,
  status text default 'Completed' check (status in ('Draft', 'In Progress', 'Completed')),
  completion_date date,
  client jsonb default '{"en": "", "ar": ""}'::jsonb,
  sort_order integer default 0,
  published boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.projects enable row level security;
create policy "Allow public read projects" on public.projects for select using (true);
create policy "Allow admin write projects" on public.projects for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create project_images table
create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.project_images enable row level security;
create policy "Allow public read project_images" on public.project_images for select using (true);
create policy "Allow admin write project_images" on public.project_images for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create services table
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb not null,
  icon text, -- lucide icon name
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.services enable row level security;
create policy "Allow public read services" on public.services for select using (true);
create policy "Allow admin write services" on public.services for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create testimonials table
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role jsonb not null,
  company text,
  feedback jsonb not null,
  image_url text,
  published boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.testimonials enable row level security;
create policy "Allow public read testimonials" on public.testimonials for select using (true);
create policy "Allow admin write testimonials" on public.testimonials for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create certifications table
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  organization jsonb not null,
  issue_date date not null,
  credential_url text,
  image_url text,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.certifications enable row level security;
create policy "Allow public read certifications" on public.certifications for select using (true);
create policy "Allow admin write certifications" on public.certifications for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create contact_messages table
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamp with time zone default now()
);

alter table public.contact_messages enable row level security;
create policy "Allow public insert messages" on public.contact_messages for insert with check (true);
create policy "Allow admin write/read messages" on public.contact_messages for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create navigation table
create table public.navigation (
  id uuid primary key default gen_random_uuid(),
  label jsonb not null, -- {"en": "Home", "ar": "الرئيسية"}
  path text not null,
  sort_order integer default 0,
  visible boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.navigation enable row level security;
create policy "Allow public read navigation" on public.navigation for select using (true);
create policy "Allow admin write navigation" on public.navigation for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create social_links table
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text, -- lucide icon
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.social_links enable row level security;
create policy "Allow public read social_links" on public.social_links for select using (true);
create policy "Allow admin write social_links" on public.social_links for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create translations table (for standard static UI strings)
create table public.translations (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  en text not null,
  ar text not null,
  created_at timestamp with time zone default now()
);

alter table public.translations enable row level security;
create policy "Allow public read translations" on public.translations for select using (true);
create policy "Allow admin write translations" on public.translations for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create media_library table
create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  file_path text unique not null, -- path in bucket
  url text not null, -- public URL
  file_size integer not null,
  mime_type text not null,
  width integer,
  height integer,
  created_at timestamp with time zone default now()
);

alter table public.media_library enable row level security;
create policy "Allow public read media" on public.media_library for select using (true);
create policy "Allow admin write media" on public.media_library for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Create activity_logs table
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  action text not null,
  details text,
  created_at timestamp with time zone default now()
);

alter table public.activity_logs enable row level security;
create policy "Allow admin read logs" on public.activity_logs for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Allow admin insert logs" on public.activity_logs for insert with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);


-- Ensure storage bucket and policies exist
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Allow public select media storage"
on storage.objects for select using (bucket_id = 'media');

create policy "Allow admin insert media storage"
on storage.objects for insert with check (
  bucket_id = 'media' and
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

create policy "Allow admin delete media storage"
on storage.objects for delete using (
  bucket_id = 'media' and
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
