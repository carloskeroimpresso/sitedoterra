ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS extra_contacts jsonb DEFAULT '[]';