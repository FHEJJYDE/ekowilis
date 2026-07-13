-- 1. Ensure the "videos" column is added to the "projects" table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;

-- 2. Ensure the "media" storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Register the new administrator email
INSERT INTO public.admin_emails (email)
VALUES ('ekowilogs@gmail.com')
ON CONFLICT DO NOTHING;

-- 4. Grant execute on is_admin function to anon and authenticated roles so RLS policies don't fail for anonymous visitors
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;
