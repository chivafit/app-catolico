-- Registro idempotente das mudanças aplicadas no Supabase durante a etapa piloto.
-- O banco remoto já recebeu estas alterações via migrations da plataforma.
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists preferences jsonb not null default '{}'::jsonb;
alter table public.sellers add column if not exists owner_user_id uuid references auth.users(id) on delete set null;
alter table public.travel_organizers add column if not exists owner_user_id uuid references auth.users(id) on delete set null;
create index if not exists sellers_owner_user_id_idx on public.sellers(owner_user_id);
create index if not exists travel_organizers_owner_user_id_idx on public.travel_organizers(owner_user_id);
create unique index if not exists bookings_pilgrimage_user_unique on public.bookings(pilgrimage_id,user_id);

-- Políticas adicionais da fase piloto são mantidas no histórico de migrations do projeto remoto.
-- Objetivos: autoatendimento seguro de seguidores, leitura de parceiros por responsável,
-- pedidos/reservas do próprio usuário e reserva de peregrinação apenas como interesse sem cobrança.
