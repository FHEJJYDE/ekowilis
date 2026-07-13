
-- ============ ADMIN GATE ============
CREATE TABLE public.admin_emails (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_emails TO authenticated;
GRANT ALL ON public.admin_emails TO service_role;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read admin_emails" ON public.admin_emails FOR SELECT TO authenticated USING (true);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "users upsert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- is_admin: true if the user's email is in admin_emails
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.admin_emails ae ON lower(u.email) = lower(ae.email)
    WHERE u.id = _user_id
  );
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ SINGLETONS: company_info, hero ============
CREATE TABLE public.company_info (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL DEFAULT '',
  short_name TEXT NOT NULL DEFAULT '',
  tagline TEXT DEFAULT '',
  mission TEXT DEFAULT '',
  vision TEXT DEFAULT '',
  story TEXT DEFAULT '',
  rc_number TEXT DEFAULT '',
  founded_year TEXT DEFAULT '',
  head_office TEXT DEFAULT '',
  branch_office TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.company_info TO anon, authenticated;
GRANT INSERT, UPDATE ON public.company_info TO authenticated;
GRANT ALL ON public.company_info TO service_role;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read company" ON public.company_info FOR SELECT USING (true);
CREATE POLICY "admin write company" ON public.company_info FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.company_info FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.hero (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow TEXT DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  cta_label TEXT DEFAULT 'Request a quote',
  cta_href TEXT DEFAULT '/contact',
  image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero TO anon, authenticated;
GRANT INSERT, UPDATE ON public.hero TO authenticated;
GRANT ALL ON public.hero TO service_role;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read hero" ON public.hero FOR SELECT USING (true);
CREATE POLICY "admin write hero" ON public.hero FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.hero FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ CONTENT TABLES ============
-- generic shape: order_index, is_published, created/updated_at
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "admin write services" ON public.services FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client TEXT DEFAULT '',
  location TEXT DEFAULT '',
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'Completed',
  year TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  scope TEXT[] NOT NULL DEFAULT '{}',
  cover_url TEXT DEFAULT '',
  gallery TEXT[] NOT NULL DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read projects" ON public.projects FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "admin write projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  group_name TEXT NOT NULL DEFAULT 'staff',
  photo_url TEXT DEFAULT '',
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read team" ON public.team_members FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "admin write team" ON public.team_members FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  quantity INT DEFAULT 1,
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipment TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.equipment TO authenticated;
GRANT ALL ON public.equipment TO service_role;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read equipment" ON public.equipment FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "admin write equipment" ON public.equipment FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clients TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read clients" ON public.clients FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "admin write clients" ON public.clients FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reference TEXT DEFAULT '',
  issuer TEXT DEFAULT '',
  year TEXT DEFAULT '',
  document_url TEXT DEFAULT '',
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credentials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.credentials TO authenticated;
GRANT ALL ON public.credentials TO service_role;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read credentials" ON public.credentials FOR SELECT USING (is_published OR public.is_admin(auth.uid()));
CREATE POLICY "admin write credentials" ON public.credentials FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.credentials FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ FORM SUBMISSIONS ============
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submit contact" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read contact" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin update contact" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete contact" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.quote_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  project_type TEXT DEFAULT '',
  location TEXT DEFAULT '',
  scope TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.quote_submissions TO authenticated;
GRANT ALL ON public.quote_submissions TO service_role;
ALTER TABLE public.quote_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submit quote" ON public.quote_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read quote" ON public.quote_submissions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin update quote" ON public.quote_submissions FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete quote" ON public.quote_submissions FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ MEDIA LIBRARY (metadata) ============
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT DEFAULT '',
  size_bytes BIGINT DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "admin write media" ON public.media_assets FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ SEED ADMIN EMAIL + SINGLETONS ============
INSERT INTO public.admin_emails (email) VALUES ('support.ekowillis@gmail.com');
INSERT INTO public.company_info (id, name, short_name, tagline, mission, vision, story, rc_number, founded_year, head_office, branch_office, email, phone)
VALUES (1,
  'Ekowills Logistics & Engineering Ltd',
  'EKOWILLS',
  'Engineering with style.',
  'To deliver creative, innovative space and building solutions of the highest quality, on time and within budget.',
  'To be a leading civil engineering and equipment leasing company in West Africa, recognised for excellence and integrity.',
  'Ekowills Logistics & Engineering Ltd is a Nigerian civil engineering, equipment leasing and procurement company based in Enugu. Established in 2003 and incorporated in 2009, we have delivered roads, drainage, building and maintenance projects for public and private clients across the country.',
  'RC 797482', '2003',
  '20 Edem Road, Nsukka, Enugu State',
  '50 Oloto Street, Odenigbo, Nsukka, Enugu State',
  'ekowilogs@gmail.com', '');
INSERT INTO public.hero (id, eyebrow, title, subtitle, cta_label, cta_href, image_url)
VALUES (1, 'Civil engineering · Since 2003',
  'Building roads, drains and structures that move Nigeria forward.',
  'Ekowills delivers civil works, building construction and equipment leasing for public and private clients across Nigeria.',
  'Request a quote', '/contact', '');




-- Restrict execute on is_admin to authenticated users only (RLS still calls it as the row's user)
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon, authenticated, service_role;

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




DROP POLICY IF EXISTS "auth read admin_emails" ON public.admin_emails;

CREATE POLICY "admins read admin_emails"
ON public.admin_emails
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;




-- ENUMS
CREATE TYPE public.inv_location_type AS ENUM ('yard','site','warehouse','vehicle','other');
CREATE TYPE public.inv_asset_status AS ENUM ('available','in_use','maintenance','leased_out','retired');
CREATE TYPE public.inv_tool_status AS ENUM ('available','checked_out','maintenance','lost','retired');
CREATE TYPE public.inv_item_kind AS ENUM ('asset','consumable','tool');
CREATE TYPE public.inv_txn_type AS ENUM ('receive','issue','transfer','return','adjust','waste','status_change','checkout','checkin');
CREATE TYPE public.inv_maint_type AS ENUM ('service','repair','inspection');
CREATE TYPE public.inv_alloc_status AS ENUM ('planned','allocated','partial','completed','cancelled');

-- updated_at trigger fn already exists: public.tg_set_updated_at()

-- 1) LOCATIONS
CREATE TABLE public.inventory_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type public.inv_location_type NOT NULL DEFAULT 'yard',
  address text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_locations TO authenticated;
GRANT ALL ON public.inventory_locations TO service_role;
ALTER TABLE public.inventory_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all locations" ON public.inventory_locations FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_inv_locations_updated BEFORE UPDATE ON public.inventory_locations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2) ASSETS
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_tag text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  make text,
  model text,
  serial_number text,
  year integer,
  status public.inv_asset_status NOT NULL DEFAULT 'available',
  current_location_id uuid REFERENCES public.inventory_locations(id) ON DELETE SET NULL,
  assigned_to_project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  assigned_to_person text,
  purchase_date date,
  purchase_cost numeric(14,2),
  current_value numeric(14,2),
  hours_meter numeric(12,2),
  odometer numeric(12,2),
  last_service_at timestamptz,
  next_service_due_at timestamptz,
  next_service_due_hours numeric(12,2),
  image_url text,
  linked_equipment_id uuid REFERENCES public.equipment(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all assets" ON public.assets FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_assets_updated BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_category ON public.assets(category);

-- 3) CONSUMABLES
CREATE TABLE public.consumables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  name text NOT NULL,
  category text,
  unit text NOT NULL DEFAULT 'pcs',
  quantity_on_hand numeric(14,3) NOT NULL DEFAULT 0,
  reorder_point numeric(14,3) NOT NULL DEFAULT 0,
  reorder_quantity numeric(14,3) NOT NULL DEFAULT 0,
  unit_cost numeric(14,2),
  supplier text,
  default_location_id uuid REFERENCES public.inventory_locations(id) ON DELETE SET NULL,
  image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consumables TO authenticated;
GRANT ALL ON public.consumables TO service_role;
ALTER TABLE public.consumables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all consumables" ON public.consumables FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_consumables_updated BEFORE UPDATE ON public.consumables FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4) TOOLS
CREATE TABLE public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_tag text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  status public.inv_tool_status NOT NULL DEFAULT 'available',
  current_location_id uuid REFERENCES public.inventory_locations(id) ON DELETE SET NULL,
  checked_out_to text,
  checked_out_at timestamptz,
  expected_return_at timestamptz,
  condition text,
  purchase_date date,
  purchase_cost numeric(14,2),
  image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tools TO authenticated;
GRANT ALL ON public.tools TO service_role;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all tools" ON public.tools FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_tools_updated BEFORE UPDATE ON public.tools FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 5) TRANSACTIONS LEDGER (append-only)
CREATE TABLE public.inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_kind public.inv_item_kind NOT NULL,
  item_id uuid NOT NULL,
  txn_type public.inv_txn_type NOT NULL,
  quantity numeric(14,3),
  from_location_id uuid REFERENCES public.inventory_locations(id) ON DELETE SET NULL,
  to_location_id uuid REFERENCES public.inventory_locations(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  performed_by uuid,
  performed_by_name text,
  note text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inventory_transactions TO authenticated;
GRANT ALL ON public.inventory_transactions TO service_role;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin select txns" ON public.inventory_transactions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin insert txns" ON public.inventory_transactions FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE INDEX idx_inv_txn_item ON public.inventory_transactions(item_kind, item_id);
CREATE INDEX idx_inv_txn_occurred ON public.inventory_transactions(occurred_at DESC);

-- append-only enforcement
CREATE OR REPLACE FUNCTION public.tg_inv_txn_append_only() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'inventory_transactions is append-only';
END $$;
CREATE TRIGGER trg_inv_txn_no_update BEFORE UPDATE ON public.inventory_transactions FOR EACH ROW EXECUTE FUNCTION public.tg_inv_txn_append_only();
CREATE TRIGGER trg_inv_txn_no_delete BEFORE DELETE ON public.inventory_transactions FOR EACH ROW EXECUTE FUNCTION public.tg_inv_txn_append_only();

-- 6) PROJECT MATERIAL ALLOCATIONS
CREATE TABLE public.project_material_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  consumable_id uuid NOT NULL REFERENCES public.consumables(id) ON DELETE RESTRICT,
  quantity_allocated numeric(14,3) NOT NULL DEFAULT 0,
  quantity_used numeric(14,3) NOT NULL DEFAULT 0,
  status public.inv_alloc_status NOT NULL DEFAULT 'planned',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_material_allocations TO authenticated;
GRANT ALL ON public.project_material_allocations TO service_role;
ALTER TABLE public.project_material_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all allocations" ON public.project_material_allocations FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_alloc_updated BEFORE UPDATE ON public.project_material_allocations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_alloc_project ON public.project_material_allocations(project_id);

-- 7) MAINTENANCE LOGS
CREATE TABLE public.maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  type public.inv_maint_type NOT NULL DEFAULT 'service',
  performed_at timestamptz NOT NULL DEFAULT now(),
  performed_by text,
  hours_at_service numeric(12,2),
  cost numeric(14,2),
  parts_used jsonb,
  notes text,
  next_due_at timestamptz,
  next_due_hours numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_logs TO authenticated;
GRANT ALL ON public.maintenance_logs TO service_role;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all maintenance" ON public.maintenance_logs FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_maint_updated BEFORE UPDATE ON public.maintenance_logs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_maint_asset ON public.maintenance_logs(asset_id);




CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('portfolio','equipment')),
  title text,
  caption text,
  image_url text NOT NULL,
  storage_path text,
  order_index integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published gallery images"
ON public.gallery_images FOR SELECT
USING (is_published = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage gallery images"
ON public.gallery_images FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER gallery_images_set_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX gallery_images_category_order_idx ON public.gallery_images (category, order_index);



ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb;



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




