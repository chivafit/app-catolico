-- Vinde — schema consolidado do projeto Supabase `app-catolico`.
--
-- Este arquivo é a fonte de verdade versionada da estrutura do banco.
-- Reproduz fielmente o estado do projeto remoto: tabelas, constraints,
-- índices, Row Level Security (RLS) habilitado em TODAS as tabelas e as
-- políticas de acesso da etapa piloto.
--
-- Executar em um projeto novo recria o banco já com a segurança aplicada.
-- Rode este arquivo antes de `seed.sql`.

create extension if not exists "pgcrypto";

-- ============================================================================
-- TABELAS
-- ============================================================================

-- Dioceses -------------------------------------------------------------------
create table public.dioceses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  state text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Paróquias ------------------------------------------------------------------
create table public.parishes (
  id uuid primary key default gen_random_uuid(),
  diocese_id uuid references public.dioceses(id) on delete set null,
  name text not null,
  slug text not null unique,
  city text not null,
  state text not null,
  address text,
  phone text,
  whatsapp text,
  instagram text,
  description text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  photo_url text,
  website text,
  secretary_hours text,
  maps_url text,
  latitude double precision,
  longitude double precision
);

-- Perfis (1:1 com auth.users) ------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  city text,
  state text,
  primary_parish_id uuid references public.parishes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  onboarding_completed boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  phone text,
  avatar_url text
);

-- Vínculo usuário <-> paróquia -----------------------------------------------
create table public.parish_members (
  parish_id uuid not null references public.parishes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'follower'
    check (role in ('follower','volunteer','editor','admin')),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (parish_id, user_id)
);

-- Horários de missa ----------------------------------------------------------
create table public.mass_schedules (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  label text,
  active boolean not null default true
);

-- Avisos oficiais da paróquia ------------------------------------------------
create table public.parish_posts (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  title text not null,
  body text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Pastorais / movimentos -----------------------------------------------------
create table public.parish_ministries (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  slug text not null,
  name text not null,
  category text not null default 'pastoral',
  description text,
  meeting_schedule text,
  location text,
  contact_name text,
  contact_phone text,
  contact_whatsapp text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parish_id, slug)
);

-- Interesse em pastorais -----------------------------------------------------
create table public.parish_ministry_interests (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  ministry_id uuid not null references public.parish_ministries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  requester_name text,
  phone text,
  message text,
  status text not null default 'received'
    check (status in ('received','contacted','joined','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Serviços da secretaria -----------------------------------------------------
create table public.parish_services (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  slug text not null,
  service_type text not null,
  title text not null,
  description text,
  requirements jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  preparation text,
  availability_note text,
  contact_note text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parish_id, slug)
);

-- Solicitações à secretaria --------------------------------------------------
create table public.parish_service_requests (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  service_id uuid not null references public.parish_services(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  requester_name text,
  phone text,
  preferred_date date,
  notes text,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'received'
    check (status in ('received','in_review','awaiting_documents','scheduled','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Horários de confissão / adoração / secretaria ------------------------------
create table public.parish_service_schedules (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid not null references public.parishes(id) on delete cascade,
  service_type text not null
    check (service_type in ('confession','adoration','celebration','secretary')),
  weekday smallint check (weekday between 0 and 6),
  starts_at time,
  ends_at time,
  label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Momento Diário -------------------------------------------------------------
create table public.daily_devotionals (
  id uuid primary key default gen_random_uuid(),
  devotional_date date not null unique,
  title text not null,
  scripture_reference text,
  scripture_excerpt text,
  reflection text not null,
  prayer text not null,
  purpose text,
  audio_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  editorial_source text,
  reflection_question text,
  audio_voice text,
  audio_provider text,
  audio_duration_seconds integer,
  audio_generated_at timestamptz
);

create table public.devotional_completions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  devotional_id uuid not null references public.daily_devotionals(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, devotional_id)
);

-- Eventos --------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid references public.parishes(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  price_cents integer not null default 0 check (price_cents >= 0),
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'draft'
    check (status in ('draft','published','cancelled','finished')),
  created_at timestamptz not null default now(),
  category text,
  image_url text,
  all_day boolean not null default false
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- Datas litúrgicas recorrentes -----------------------------------------------
create table public.recurring_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  city text not null default 'Piumhi',
  state text not null default 'MG',
  category text,
  month smallint check (month between 1 and 12),
  day smallint check (day between 1 and 31),
  date_note text,
  description text,
  location text,
  parish_id uuid references public.parishes(id) on delete set null,
  source_url text,
  verified boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Campanhas ------------------------------------------------------------------
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  parish_id uuid references public.parishes(id) on delete set null,
  title text not null,
  description text,
  goal_cents bigint check (goal_cents is null or goal_cents > 0),
  raised_cents bigint not null default 0 check (raised_cents >= 0),
  verified boolean not null default false,
  status text not null default 'draft'
    check (status in ('draft','published','paused','finished')),
  created_at timestamptz not null default now(),
  institution_name text,
  image_url text,
  video_url text,
  deadline date,
  updates jsonb not null default '[]'::jsonb
);

-- Instituições de caridade ---------------------------------------------------
create table public.charity_institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text not null default 'Piumhi',
  state text not null default 'MG',
  cause text,
  description text,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  cnpj text,
  verified boolean not null default false,
  source_url text,
  donation_note text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Marketplace ----------------------------------------------------------------
create table public.sellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document text,
  verified boolean not null default false,
  commission_bps integer not null default 1500
    check (commission_bps >= 0 and commission_bps <= 10000),
  created_at timestamptz not null default now(),
  owner_user_id uuid references auth.users(id) on delete set null
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete set null,
  name text not null,
  slug text not null unique,
  category text not null,
  description text,
  image_url text,
  price_cents integer not null check (price_cents >= 0),
  stock integer check (stock is null or stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  author text,
  format text
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending','paid','cancelled','refunded','fulfilled')),
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  platform_fee_cents integer not null default 0 check (platform_fee_cents >= 0),
  parish_share_cents integer not null default 0 check (parish_share_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

-- Favoritos ------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, entity_type, entity_id)
);

-- Peregrinações --------------------------------------------------------------
create table public.travel_organizers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  owner_user_id uuid references auth.users(id) on delete set null
);

create table public.pilgrimage_destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country text not null default 'Brasil',
  region text,
  summary text,
  category text not null default 'national',
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  hero_image_url text,
  catholic_significance text,
  highlights jsonb default '[]'::jsonb,
  spiritual_experience jsonb default '[]'::jsonb,
  practical_info jsonb default '{}'::jsonb
);

create table public.pilgrimages (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.travel_organizers(id) on delete set null,
  title text not null,
  origin_city text,
  destination text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  price_cents integer check (price_cents is null or price_cents >= 0),
  capacity integer check (capacity is null or capacity > 0),
  available_spots integer check (available_spots is null or available_spots >= 0),
  status text not null default 'draft'
    check (status in ('draft','published','sold_out','cancelled','finished')),
  created_at timestamptz not null default now(),
  itinerary text,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  destination_id uuid references public.pilgrimage_destinations(id),
  duration_days integer,
  transport_type text,
  accommodation text,
  meals text,
  spiritual_guide text,
  departure_details text,
  deposit_cents integer,
  installments_max integer default 1,
  pix_discount_percent numeric default 0,
  includes jsonb default '[]'::jsonb,
  excludes jsonb default '[]'::jsonb,
  payment_notes text,
  cancellation_policy text
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  pilgrimage_id uuid not null references public.pilgrimages(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  passengers integer not null default 1 check (passengers > 0),
  total_cents integer not null check (total_cents >= 0),
  status text not null default 'pending'
    check (status in ('pending','paid','cancelled','refunded')),
  created_at timestamptz not null default now()
);

-- Um usuário só pode ter uma reserva por viagem.
create unique index bookings_pilgrimage_user_unique
  on public.bookings (pilgrimage_id, user_id);

-- Ledger financeiro ----------------------------------------------------------
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  parish_id uuid references public.parishes(id) on delete set null,
  source_type text not null,
  source_id uuid,
  gross_cents integer not null check (gross_cents >= 0),
  payment_fee_cents integer not null default 0 check (payment_fee_cents >= 0),
  platform_fee_cents integer not null default 0 check (platform_fee_cents >= 0),
  parish_share_cents integer not null default 0 check (parish_share_cents >= 0),
  partner_share_cents integer not null default 0 check (partner_share_cents >= 0),
  status text not null default 'pending'
    check (status in ('pending','paid','failed','refunded')),
  external_payment_id text,
  created_at timestamptz not null default now()
);

-- Analytics ------------------------------------------------------------------
create table public.analytics_events (
  id bigint primary key generated by default as identity,
  user_id uuid references auth.users(id) on delete set null,
  parish_id uuid references public.parishes(id) on delete set null,
  event_name text not null,
  entity_type text,
  entity_id uuid,
  path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- LGPD: pedidos de exclusão de conta -----------------------------------------
create table public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Índices de apoio ao vínculo de responsável.
create index if not exists sellers_owner_user_id_idx on public.sellers(owner_user_id);
create index if not exists travel_organizers_owner_user_id_idx on public.travel_organizers(owner_user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- RLS habilitado em TODAS as tabelas. Sem policy de escrita, o cliente só
-- consegue ler o que as policies de SELECT liberam; escritas administrativas
-- passam pelas policies de vínculo (parish_members) ou pela service role.
-- ============================================================================

alter table public.dioceses                  enable row level security;
alter table public.parishes                   enable row level security;
alter table public.profiles                   enable row level security;
alter table public.parish_members             enable row level security;
alter table public.mass_schedules             enable row level security;
alter table public.parish_posts               enable row level security;
alter table public.parish_ministries          enable row level security;
alter table public.parish_ministry_interests  enable row level security;
alter table public.parish_services            enable row level security;
alter table public.parish_service_requests    enable row level security;
alter table public.parish_service_schedules   enable row level security;
alter table public.daily_devotionals          enable row level security;
alter table public.devotional_completions     enable row level security;
alter table public.events                      enable row level security;
alter table public.event_registrations        enable row level security;
alter table public.recurring_events           enable row level security;
alter table public.campaigns                   enable row level security;
alter table public.charity_institutions       enable row level security;
alter table public.sellers                     enable row level security;
alter table public.products                    enable row level security;
alter table public.orders                      enable row level security;
alter table public.order_items                 enable row level security;
alter table public.favorites                   enable row level security;
alter table public.travel_organizers          enable row level security;
alter table public.pilgrimage_destinations    enable row level security;
alter table public.pilgrimages                 enable row level security;
alter table public.bookings                    enable row level security;
alter table public.transactions                enable row level security;
alter table public.analytics_events           enable row level security;
alter table public.account_deletion_requests  enable row level security;

-- ============================================================================
-- POLÍTICAS
-- ============================================================================

-- Catálogo público (leitura anônima do que está publicado/ativo) -------------
create policy "dioceses_public_read" on public.dioceses
  for select to anon, authenticated using (true);

create policy "parishes_public_read" on public.parishes
  for select to anon, authenticated using (true);

create policy "devotionals_public_read" on public.daily_devotionals
  for select to anon, authenticated using (published = true);

create policy "events_public_read" on public.events
  for select to anon, authenticated using (status = 'published');

create policy "campaigns_public_read" on public.campaigns
  for select to anon, authenticated using (status = 'published');

create policy "products_public_read" on public.products
  for select to anon, authenticated using (active = true);

create policy "pilgrimages_public_read" on public.pilgrimages
  for select to anon, authenticated using (status = 'published');

create policy "mass_schedules_public_read" on public.mass_schedules
  for select to anon, authenticated using (active = true);

create policy "parish_posts_public_read" on public.parish_posts
  for select to anon, authenticated
  using (published_at is not null and published_at <= now());

create policy "charity_institutions_public_read" on public.charity_institutions
  for select using (active = true);

create policy "recurring_events_public_read" on public.recurring_events
  for select using (active = true);

create policy "active pilgrimage destinations readable" on public.pilgrimage_destinations
  for select using (active = true);

create policy "public can read active ministries" on public.parish_ministries
  for select using (active = true);

create policy "public can read active parish services" on public.parish_services
  for select using (active = true);

create policy "public read parish service schedules" on public.parish_service_schedules
  for select using (
    active = true
    or exists (
      select 1 from public.parish_members pm
      where pm.parish_id = parish_service_schedules.parish_id
        and pm.user_id = auth.uid()
        and pm.role in ('admin','editor')
    )
  );

-- Parceiros (vendedor/organizador): público vê só verificados; dono vê o seu.
create policy "sellers_anon_read" on public.sellers
  for select to anon using (verified = true);
create policy "sellers_authenticated_read" on public.sellers
  for select to authenticated
  using (verified = true or (select auth.uid()) = owner_user_id);

create policy "organizers_anon_read" on public.travel_organizers
  for select to anon using (verified = true);
create policy "organizers_authenticated_read" on public.travel_organizers
  for select to authenticated
  using (verified = true or (select auth.uid()) = owner_user_id);

-- Perfil do próprio usuário --------------------------------------------------
create policy "profiles_own_read" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_own_insert" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_own_update" on public.profiles
  for update to authenticated using ((select auth.uid()) = id);

-- Dados do próprio usuário ----------------------------------------------------
create policy "completions_own_all" on public.devotional_completions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "favorites_own_all" on public.favorites
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "orders_own_read" on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "orders_own_insert" on public.orders
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "order_items_own_read" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.user_id = (select auth.uid()))
  );
create policy "order_items_own_insert" on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.user_id = (select auth.uid()))
  );

create policy "transactions_own_read" on public.transactions
  for select to authenticated using ((select auth.uid()) = user_id);

-- Reservas de peregrinação: só o próprio usuário, apenas como interesse -------
create policy "bookings_own_read" on public.bookings
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "bookings_own_interest_insert" on public.bookings
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and status = 'interest'
    and total_cents = 0
    and passengers between 1 and 20
  );

-- Inscrição em eventos: só o próprio usuário ---------------------------------
create policy "event_reg_self_select" on public.event_registrations
  for select to authenticated using (user_id = auth.uid());
create policy "event_reg_self_insert" on public.event_registrations
  for insert to authenticated with check (user_id = auth.uid());
create policy "event_reg_self_delete" on public.event_registrations
  for delete to authenticated using (user_id = auth.uid());

-- Vínculo com paróquia: autoatendimento só como 'follower' -------------------
create policy "parish_members_own_read" on public.parish_members
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "parish_members_self_follow" on public.parish_members
  for insert to authenticated
  with check ((select auth.uid()) = user_id and role = 'follower');
create policy "parish_members_self_update" on public.parish_members
  for update to authenticated
  using ((select auth.uid()) = user_id and role = 'follower')
  with check ((select auth.uid()) = user_id and role = 'follower');
create policy "parish_members_self_delete" on public.parish_members
  for delete to authenticated
  using ((select auth.uid()) = user_id and role = 'follower');

-- Gestão paroquial: apenas editor/admin da própria paróquia ------------------
create policy "parish editors update parish" on public.parishes
  for update using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parishes.id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parishes.id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  );

create policy "parish editors manage events" on public.events
  for all using (
    parish_id is not null and exists (
      select 1 from public.parish_members pm
      where pm.parish_id = events.parish_id and pm.user_id = auth.uid()
        and pm.role in ('admin','editor'))
  )
  with check (
    parish_id is not null and exists (
      select 1 from public.parish_members pm
      where pm.parish_id = events.parish_id and pm.user_id = auth.uid()
        and pm.role in ('admin','editor'))
  );

create policy "parish editors manage campaigns" on public.campaigns
  for all using (
    parish_id is not null and exists (
      select 1 from public.parish_members pm
      where pm.parish_id = campaigns.parish_id and pm.user_id = auth.uid()
        and pm.role in ('admin','editor'))
  )
  with check (
    parish_id is not null and exists (
      select 1 from public.parish_members pm
      where pm.parish_id = campaigns.parish_id and pm.user_id = auth.uid()
        and pm.role in ('admin','editor'))
  );

create policy "parish editors manage mass schedules" on public.mass_schedules
  for all using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = mass_schedules.parish_id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = mass_schedules.parish_id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  );

create policy "parish editors manage posts" on public.parish_posts
  for all using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_posts.parish_id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_posts.parish_id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  );

create policy "parish staff can manage ministries" on public.parish_ministries
  for all to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_ministries.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_ministries.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  );

create policy "parish staff can manage services" on public.parish_services
  for all to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_services.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_services.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  );

create policy "parish editors manage service schedules" on public.parish_service_schedules
  for all using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_service_schedules.parish_id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_service_schedules.parish_id and pm.user_id = auth.uid()
              and pm.role in ('admin','editor'))
  );

-- Interesse em pastorais: usuário cria/lê o seu; staff lê/atualiza da paróquia
create policy "users can create own ministry interest" on public.parish_ministry_interests
  for insert to authenticated with check (auth.uid() = user_id);
create policy "users can read own ministry interest" on public.parish_ministry_interests
  for select to authenticated using (auth.uid() = user_id);
create policy "parish staff can read ministry interests" on public.parish_ministry_interests
  for select to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_ministry_interests.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  );
create policy "parish staff can update ministry interests" on public.parish_ministry_interests
  for update to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_ministry_interests.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_ministry_interests.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  );

-- Solicitações à secretaria: usuário cria/lê/cancela a sua; staff lê/atualiza -
create policy "users can create own parish requests" on public.parish_service_requests
  for insert to authenticated with check (auth.uid() = user_id);
create policy "users can read own parish requests" on public.parish_service_requests
  for select to authenticated using (auth.uid() = user_id);
create policy "users can cancel own received requests" on public.parish_service_requests
  for update to authenticated
  using (auth.uid() = user_id and status in ('received','in_review'))
  with check (auth.uid() = user_id);
create policy "parish staff can read parish requests" on public.parish_service_requests
  for select to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_service_requests.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  );
create policy "parish staff can update parish requests" on public.parish_service_requests
  for update to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_service_requests.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  )
  with check (
    exists (select 1 from public.parish_members pm
            where pm.parish_id = parish_service_requests.parish_id and pm.user_id = auth.uid()
              and pm.role in ('editor','admin'))
  );

-- Analytics: inserção aberta (anônima ou do próprio usuário); leitura só staff
create policy "analytics_events_insert" on public.analytics_events
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "analytics_events_admin_read" on public.analytics_events
  for select to authenticated using (
    exists (select 1 from public.parish_members pm
            where pm.user_id = auth.uid()
              and pm.role in ('admin','editor')
              and (analytics_events.parish_id is null or pm.parish_id = analytics_events.parish_id))
  );

-- LGPD: pedidos de exclusão do próprio usuário -------------------------------
create policy "deletion_request_self_read" on public.account_deletion_requests
  for select to authenticated using (user_id = auth.uid());
create policy "deletion_request_self_insert" on public.account_deletion_requests
  for insert to authenticated with check (user_id = auth.uid());
