
DROP POLICY IF EXISTS "Public can update slot status for booking" ON public.schedule_slots;

CREATE POLICY "Public can book available slots"
ON public.schedule_slots FOR UPDATE
TO public
USING (status = 'available')
WITH CHECK (status = 'booked');
