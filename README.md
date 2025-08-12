# Rightmove-style MVP (Next.js + Supabase + Leaflet)

A super-minimal property portal you can run today.

## Quick start

1) **Create a Supabase project** (free tier). In the SQL editor, run the schema below.
2) In Supabase, create a Storage bucket named `property-images` (public).
3) Copy `.env.example` to `.env.local` and paste your Supabase URL + anon key.
4) Install & run:
```bash
npm install
npm run dev
```

Open http://localhost:3000

- Browse/search on the home page
- Add listings at `/agent` (sign-in via magic link)
- View a property at `/property/:id`

## Supabase schema (paste into SQL Editor)

```sql
-- Tables
create table if not exists public.property (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  price numeric not null,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  floor_area int,
  address text not null,
  lat double precision,
  lng double precision,
  thumbnail_url text,
  approved boolean not null default true,
  agent_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now()
);

create table if not exists public.lead (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.property(id) on delete cascade,
  name text not null,
  email text not null,
  message text,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_property_price on public.property(price);
create index if not exists idx_property_bedrooms on public.property(bedrooms);
create index if not exists idx_property_latlng on public.property using gist (ll_to_earth(lat, lng));
-- enable earthdistance extension for geo index
create extension if not exists cube;
create extension if not exists earthdistance;

-- RLS
alter table public.property enable row level security;
alter table public.lead enable row level security;

-- Policies
-- Public can read approved properties
create policy "Public reads approved properties" on public.property
for select using (approved = true);

-- Agents (authenticated users) can insert their own properties
create policy "Agents insert property" on public.property
for insert with check (auth.uid() = agent_id);

-- Agents can update their own properties
create policy "Agents update own property" on public.property
for update using (auth.uid() = agent_id);

-- Public can insert leads
create policy "Public insert leads" on public.lead
for insert with check (true);

-- Admin tip: To moderate, add an 'approved' toggle in Supabase table editor.
```

## Seed data (optional)
```sql
insert into public.property (title, description, price, bedrooms, bathrooms, floor_area, address, lat, lng, thumbnail_url, approved)
values
('Bright 2-bed flat in Shoreditch', 'Stylish flat close to tech hub.', 725000, 2, 1, 820, 'Shoreditch, London', 51.5246, -0.0779, 'https://images.unsplash.com/photo-1505692794403-34d4982fb208', true),
('Family home near Richmond Park', 'Quiet street, large garden.', 1250000, 4, 2, 1650, 'Richmond, London', 51.4613, -0.3037, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa', true);
```

## Notes
- Images: put any public URL in "Thumbnail URL" field. Later, switch to uploading into the `property-images` bucket and store the public URL.
- Map: Leaflet + OpenStreetMap, no keys required.
- Search: simple filters; upgrade to Postgres full-text and bbox geo queries later.
- SEO: Next.js App Router does SSR automatically; add sitemap later.
- Deploy: Vercel (Next.js) + Supabase hosting.
```

