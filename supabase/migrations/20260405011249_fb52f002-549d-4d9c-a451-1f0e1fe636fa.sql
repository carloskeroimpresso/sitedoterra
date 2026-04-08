
-- Storage: only create policies that don't exist yet
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update own uploads' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can update own uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = ''site-assets'' AND (auth.uid()::text = (storage.foldername(name))[1]))';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete own uploads' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can delete own uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = ''site-assets'' AND (auth.uid()::text = (storage.foldername(name))[1]))';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read site-assets' AND tablename = 'objects') THEN
    EXECUTE 'CREATE POLICY "Public can read site-assets" ON storage.objects FOR SELECT TO public USING (bucket_id = ''site-assets'')';
  END IF;
END$$;

-- Allow public to update schedule_slots for booking (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can update slot status for booking' AND tablename = 'schedule_slots') THEN
    EXECUTE 'CREATE POLICY "Public can update slot status for booking" ON public.schedule_slots FOR UPDATE TO public USING (true) WITH CHECK (true)';
  END IF;
END$$;
