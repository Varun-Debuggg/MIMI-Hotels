
-- Bookings INSERT: guests may only insert rows without a user_id, or matching their own uid.
DROP POLICY "Anyone create bookings" ON public.bookings;
CREATE POLICY "Guests or self create bookings" ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) OR
    (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  );

-- Newsletter INSERT: require a plausibly formatted email; nothing else can be forged.
DROP POLICY "Anyone subscribes" ON public.newsletter_subscribers;
CREATE POLICY "Anyone subscribes with valid email" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- Lock down SECURITY DEFINER helpers. has_role is still callable from RLS policies
-- (policies run under the table owner), so revoking EXECUTE from anon/authenticated
-- keeps app policies working while blocking direct RPC calls.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
