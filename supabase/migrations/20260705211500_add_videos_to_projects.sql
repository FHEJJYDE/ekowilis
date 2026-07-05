-- Add videos JSONB column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;
