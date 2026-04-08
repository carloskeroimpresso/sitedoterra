ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS primary_color text,
ADD COLUMN IF NOT EXISTS secondary_color text,
ADD COLUMN IF NOT EXISTS accent_color text,
ADD COLUMN IF NOT EXISTS logo_dark_url text,
ADD COLUMN IF NOT EXISTS sections_config jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS footer_text text,
ADD COLUMN IF NOT EXISTS footer_links jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS consultant_photo_url text;