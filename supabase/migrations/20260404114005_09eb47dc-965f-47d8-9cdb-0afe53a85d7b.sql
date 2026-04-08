
-- ============================================
-- FASE 1: Todas as tabelas + RLS + Storage
-- ============================================

-- 1. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  role_text TEXT DEFAULT 'Consultora doTERRA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Site Settings
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url TEXT,
  favicon_url TEXT,
  site_name TEXT DEFAULT 'Ana Beatriz',
  whatsapp_number TEXT DEFAULT '5511999999999',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Owner can insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update site_settings" ON public.site_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete site_settings" ON public.site_settings FOR DELETE USING (auth.uid() = user_id);

-- 3. Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  category TEXT,
  badge TEXT,
  emoji TEXT,
  image_url TEXT,
  bg_gradient TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Owner can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- 4. Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  location TEXT,
  initials TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active testimonials" ON public.testimonials FOR SELECT USING (active = true);
CREATE POLICY "Owner can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update testimonials" ON public.testimonials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete testimonials" ON public.testimonials FOR DELETE USING (auth.uid() = user_id);

-- 5. FAQ Items
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active faq_items" ON public.faq_items FOR SELECT USING (active = true);
CREATE POLICY "Owner can insert faq_items" ON public.faq_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update faq_items" ON public.faq_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete faq_items" ON public.faq_items FOR DELETE USING (auth.uid() = user_id);

-- 6. Schedule Slots
CREATE TYPE public.slot_status AS ENUM ('available', 'booked', 'blocked');

CREATE TABLE public.schedule_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  status public.slot_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, slot_date, slot_time)
);

ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read available slots" ON public.schedule_slots FOR SELECT USING (true);
CREATE POLICY "Owner can insert slots" ON public.schedule_slots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update slots" ON public.schedule_slots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete slots" ON public.schedule_slots FOR DELETE USING (auth.uid() = user_id);

-- 7. Appointments
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES public.schedule_slots(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  notes TEXT,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner can read appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner can update appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- 8. Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Storage RLS: anyone can read, owner can upload
CREATE POLICY "Public can read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Authenticated users can upload to site-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Owner can update own files in site-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'site-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner can delete own files in site-assets" ON storage.objects FOR DELETE USING (bucket_id = 'site-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schedule_slots_updated_at BEFORE UPDATE ON public.schedule_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
