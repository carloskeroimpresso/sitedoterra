-- ============================================================
-- CORREÇÃO: Políticas RLS e colunas faltantes
-- ============================================================

-- 1. Garantir que todas as colunas do profiles existam
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'consultant',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS plan_id UUID,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS mp_customer_id TEXT;

-- 2. Remover políticas duplicadas/conflitantes de profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read profiles by username" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Master admin can update any profile" ON public.profiles;

-- 3. Recriar políticas limpas para profiles
CREATE POLICY "Anyone can read profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Master admin can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'master')
  );

-- 4. Remover políticas duplicadas de site_settings
DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Master admin can read all site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Owner can insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Owner can update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Owner can delete site_settings" ON public.site_settings;

-- 5. Recriar políticas limpas para site_settings
CREATE POLICY "Public can read site_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Owner can insert site_settings" ON public.site_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update site_settings" ON public.site_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete site_settings" ON public.site_settings
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Garantir tabelas plans e platform_settings existam
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10,2),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read active plans" ON public.plans;
DROP POLICY IF EXISTS "Master admin can manage plans" ON public.plans;

CREATE POLICY "Everyone can read active plans" ON public.plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Master admin can manage plans" ON public.plans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'master')
  );

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_public_key TEXT,
  stripe_secret_key TEXT,
  mp_access_token TEXT,
  mp_public_key TEXT,
  platform_name TEXT DEFAULT 'TopConsultores',
  support_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Master admin can read platform_settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Master admin can manage platform_settings" ON public.platform_settings;

CREATE POLICY "Master admin can manage platform_settings" ON public.platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'master')
  );

-- 7. Recriar trigger de novo usuário com suporte a username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
        email = NEW.email;

  -- Usar username dos metadados se fornecido, senão gerar do nome
  IF NEW.raw_user_meta_data->>'username' IS NOT NULL AND NEW.raw_user_meta_data->>'username' != '' THEN
    base_username := LOWER(REGEXP_REPLACE(NEW.raw_user_meta_data->>'username', '[^a-z0-9-]', '', 'g'));
  ELSE
    base_username := LOWER(
      REGEXP_REPLACE(
        COALESCE(
          NEW.raw_user_meta_data->>'full_name',
          SPLIT_PART(NEW.email, '@', 1)
        ),
        '[^a-z0-9]', '', 'g'
      )
    );
  END IF;

  IF base_username = '' THEN
    base_username := 'consultora';
  END IF;

  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username AND id != NEW.id) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  UPDATE public.profiles SET username = final_username WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Inserir planos padrão se não existirem
INSERT INTO public.plans (name, description, price_monthly, price_yearly, features, sort_order) VALUES
('Starter', 'Ideal para começar', 49.90, 499.00, '["Site personalizado","Domínio próprio","Até 10 produtos","Agendamento básico"]', 1),
('Pro', 'Para consultoras ativas', 89.90, 899.00, '["Tudo do Starter","Produtos ilimitados","Depoimentos","FAQ","Vídeo embed","Integrações avançadas"]', 2),
('Elite', 'Máximo desempenho', 149.90, 1499.00, '["Tudo do Pro","Suporte prioritário","Analytics","Integração Stripe/MercadoPago","Personalização total"]', 3)
ON CONFLICT DO NOTHING;

-- 9. Inserir configuração padrão da plataforma se não existir
INSERT INTO public.platform_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
