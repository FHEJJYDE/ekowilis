
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
