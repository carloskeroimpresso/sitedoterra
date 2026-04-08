-- ============================================================
-- TOPCONSULTORES — Script de criação do banco de dados
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard
-- ============================================================

-- EXTENSÃO UUID
create extension if not exists "pgcrypto";

-- PLANOS
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_monthly numeric(10,2) not null default 0,
  price_yearly numeric(10,2) not null default 0,
  features jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- CONSULTORAS
create table if not exists consultants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  whatsapp text,
  slug text not null unique,
  custom_domain text,
  plan_id uuid references plans(id),
  plan_status text not null default 'trial' check (plan_status in ('active','suspended','cancelled','trial')),
  plan_expires_at timestamptz,
  avatar_url text,
  logo_light_url text,
  logo_dark_url text,
  primary_color text not null default '#1e293b',
  secondary_color text not null default '#64748b',
  accent_color text not null default '#f59e0b',
  site_settings jsonb not null default '{}',
  footer_text text,
  meta_title text,
  meta_description text,
  og_image_url text,
  instagram_handle text,
  video_url text,
  stripe_customer_id text,
  mp_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PRODUTOS
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  category text,
  price numeric(10,2),
  promotional_price numeric(10,2),
  external_link text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- DEPOIMENTOS
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  name text not null,
  company text,
  role text,
  content text not null,
  photo_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- DISPONIBILIDADE
create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time text not null default '08:00',
  end_time text not null default '18:00',
  is_active boolean not null default true,
  unique(consultant_id, day_of_week)
);

-- AGENDAMENTOS
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

-- CLIENTES (CRM)
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  whatsapp text,
  birthdate date,
  notes text,
  tags text[] not null default '{}',
  last_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INTERAÇÕES COM CLIENTES
create table if not exists client_interactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  consultant_id uuid not null references consultants(id) on delete cascade,
  type text not null check (type in ('call','whatsapp','email','meeting','note')),
  content text not null,
  created_at timestamptz not null default now()
);

-- LEADS
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  source text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','converted','lost')),
  created_at timestamptz not null default now()
);

-- TAREFAS
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

-- NOTIFICAÇÕES
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  type text not null check (type in ('lead','appointment','birthday','system')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ANALYTICS
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  consultant_id uuid not null references consultants(id) on delete cascade,
  event_type text not null check (event_type in ('product_click','lead_form','whatsapp_click','page_view')),
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- CONFIGURAÇÕES DA PLATAFORMA
create table if not exists platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table consultants enable row level security;
alter table products enable row level security;
alter table testimonials enable row level security;
alter table availability enable row level security;
alter table appointments enable row level security;
alter table clients enable row level security;
alter table client_interactions enable row level security;
alter table leads enable row level security;
alter table tasks enable row level security;
alter table notifications enable row level security;
alter table analytics_events enable row level security;

-- Consultoras: leem e editam apenas seus próprios dados
create policy "consultant own data" on consultants
  for all using (auth.uid() = user_id);

-- Produtos: público para leitura (site), escrita apenas pelo dono
create policy "products public read" on products
  for select using (true);
create policy "products owner write" on products
  for all using (
    auth.uid() = (select user_id from consultants where id = consultant_id)
  );

-- Depoimentos: idem
create policy "testimonials public read" on testimonials
  for select using (true);
create policy "testimonials owner write" on testimonials
  for all using (
    auth.uid() = (select user_id from consultants where id = consultant_id)
  );

-- Analytics: inserção pública (site), leitura apenas dono
create policy "analytics public insert" on analytics_events
  for insert with check (true);
create policy "analytics owner read" on analytics_events
  for select using (
    auth.uid() = (select user_id from consultants where id = consultant_id)
  );

-- Demais tabelas: apenas o dono
create policy "owner only" on availability for all using (auth.uid() = (select user_id from consultants where id = consultant_id));
create policy "owner only" on appointments for all using (auth.uid() = (select user_id from consultants where id = consultant_id));
create policy "owner only" on clients for all using (auth.uid() = (select user_id from consultants where id = consultant_id));
create policy "owner only" on client_interactions for all using (auth.uid() = (select user_id from consultants where id = consultant_id));
create policy "owner only" on leads for all using (auth.uid() = (select user_id from consultants where id = consultant_id));
create policy "owner only" on tasks for all using (auth.uid() = (select user_id from consultants where id = consultant_id));
create policy "owner only" on notifications for all using (auth.uid() = (select user_id from consultants where id = consultant_id));

-- Planos: leitura pública
create policy "plans public read" on plans for select using (true);

-- Platform settings: apenas admin (via service role)
alter table platform_settings enable row level security;

-- ============================================================
-- DADOS INICIAIS — Planos de exemplo
-- ============================================================
insert into plans (name, description, price_monthly, price_yearly, features) values
  ('Básico', 'Site profissional + ferramentas essenciais', 49.90, 479.00, '["Site personalizado","Produtos ilimitados","Depoimentos","Agenda","QR Code","Link WhatsApp"]'),
  ('Pro', 'Tudo do Básico + CRM e ferramentas avançadas', 89.90, 899.00, '["Tudo do Básico","CRM completo","Leads","Analytics","SEO avançado","Notificações"]'),
  ('Premium', 'Plataforma completa com IA e integrações', 149.90, 1499.00, '["Tudo do Pro","Gerador de posts com IA","Gerador de propostas","Área de conteúdo","Treinamento de IA","Suporte prioritário"]')
on conflict do nothing;
