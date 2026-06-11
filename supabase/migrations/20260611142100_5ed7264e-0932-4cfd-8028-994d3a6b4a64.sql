
-- Restrict execute on is_admin to authenticated users only (RLS still calls it as the row's user)
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, service_role;

-- Tighten contact/quote insert policies with length checks
DROP POLICY IF EXISTS "anyone submit contact" ON public.contact_submissions;
CREATE POLICY "anyone submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200 AND
    length(email) BETWEEN 3 AND 320 AND
    length(message) BETWEEN 1 AND 5000 AND
    coalesce(length(phone), 0) <= 40 AND
    coalesce(length(subject), 0) <= 200 AND
    is_read = false
  );

DROP POLICY IF EXISTS "anyone submit quote" ON public.quote_submissions;
CREATE POLICY "anyone submit quote" ON public.quote_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200 AND
    length(email) BETWEEN 3 AND 320 AND
    coalesce(length(message), 0) <= 5000 AND
    coalesce(length(phone), 0) <= 40 AND
    coalesce(length(project_type), 0) <= 100 AND
    coalesce(length(location), 0) <= 200 AND
    coalesce(length(scope), 0) <= 2000 AND
    coalesce(length(timeline), 0) <= 100 AND
    coalesce(length(budget), 0) <= 100 AND
    is_read = false
  );

-- Storage policies for the media bucket: admins upload/update/delete; anyone may read (bucket is private but rows readable via signed URLs)
CREATE POLICY "admin upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "admin update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "admin delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "anyone read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
