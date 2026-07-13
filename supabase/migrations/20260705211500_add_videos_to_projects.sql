-- Add videos JSONB column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;

-- Make media storage bucket public so that public URLs work directly in public pages
UPDATE storage.buckets SET public = true WHERE id = 'media';

-- Register additional admin email
INSERT INTO public.admin_emails (email) VALUES ('ekowilogs@gmail.com') ON CONFLICT DO NOTHING;

-- Ensure the media storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;



