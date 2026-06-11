
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
