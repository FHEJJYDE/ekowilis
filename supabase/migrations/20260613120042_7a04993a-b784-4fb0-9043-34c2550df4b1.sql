
DROP POLICY IF EXISTS "auth read admin_emails" ON public.admin_emails;

CREATE POLICY "admins read admin_emails"
ON public.admin_emails
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
