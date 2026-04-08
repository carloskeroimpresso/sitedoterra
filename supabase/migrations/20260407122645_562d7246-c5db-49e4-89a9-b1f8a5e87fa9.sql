ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS external_link text,
ADD COLUMN IF NOT EXISTS promo_price text,
ADD COLUMN IF NOT EXISTS has_price boolean NOT NULL DEFAULT true;