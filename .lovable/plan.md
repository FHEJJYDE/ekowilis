
# Inventory & Asset Management System

A new admin-only module under `/admin/inventory` that tracks every physical thing EKOWILLS owns or consumes, with full history, maintenance, low-stock alerts and CSV exports.

## 1. Database (new tables, all admin-only via `is_admin()`)

### Core item tables

- `inventory_locations` — yards, sites, warehouses
  - name, type (`yard`/`site`/`warehouse`/`vehicle`), address, notes
- `assets` — individual tracked units (one row per excavator, truck, generator, power tool)
  - asset_tag (unique, e.g. `EKW-EXC-001`), name, category, make, model, serial_number, year
  - status (`available`/`in_use`/`maintenance`/`leased_out`/`retired`)
  - current_location_id → locations, assigned_to_project_id (nullable), assigned_to_person (text)
  - purchase_date, purchase_cost, current_value
  - hours_meter / odometer, last_service_at, next_service_due_at, next_service_due_hours
  - image_url, linked_equipment_id (optional FK → existing `equipment` so the public page can show real counts)
- `consumables` — stock-keeping units (fuel, filters, tyres, cement, rebar)
  - sku, name, category, unit (`L`, `kg`, `pcs`, `bag`)
  - quantity_on_hand, reorder_point, reorder_quantity, unit_cost, supplier, image_url
- `tools` — small tools checked out to staff (drills, grinders, survey kit)
  - tool_tag, name, category, status, checked_out_to (text), checked_out_at, expected_return_at, condition

### Movement & history

- `inventory_transactions` — append-only ledger for every quantity change of consumables (in/out/adjust), and for asset/tool status changes
  - item_type (`asset`/`consumable`/`tool`), item_id, type (`receive`/`issue`/`transfer`/`return`/`adjust`/`waste`)
  - quantity (signed), from_location_id, to_location_id, project_id (nullable), performed_by (auth.uid()), note, occurred_at
- `project_material_allocations` — materials assigned to / consumed on a project
  - project_id → existing `projects`, consumable_id, quantity_allocated, quantity_used, status
- `maintenance_logs` — per asset
  - asset_id, type (`service`/`repair`/`inspection`), performed_at, performed_by, hours_at_service, cost, parts_used (jsonb), notes, next_due_at, next_due_hours

### Security

- RLS on every table: `SELECT/INSERT/UPDATE/DELETE` allowed only when `public.is_admin(auth.uid())`.
- Explicit `GRANT` to `authenticated` and `service_role` (no `anon`). Standard updated_at trigger.
- Append-only enforcement on `inventory_transactions` via a `BEFORE UPDATE/DELETE` trigger that blocks edits (audit integrity).

### Helper views (read-only)

- `v_low_stock_consumables` — consumables where `quantity_on_hand <= reorder_point`.
- `v_maintenance_due` — assets where `next_service_due_at <= now() + interval '14 days'` or hours threshold reached.

## 2. Admin UI (`/admin/inventory/*`)

Sidebar gets one new top-level group **Inventory** with subroutes:

- `/admin/inventory` — dashboard: KPI cards (assets in use, low-stock count, maintenance due, tools checked out), recent transactions, alerts list.
- `/admin/inventory/assets` — table + filters (status/category/location). Detail drawer with: specs, current assignment, transfer action, schedule maintenance, full history timeline.
- `/admin/inventory/consumables` — stock table with on-hand vs reorder point; quick "Receive stock" / "Issue stock" dialogs; low-stock badge.
- `/admin/inventory/tools` — checkout/check-in flow; overdue highlighted.
- `/admin/inventory/locations` — CRUD for yards/sites/warehouses.
- `/admin/inventory/transfers` — log of all transactions; filter by item, project, date range.
- `/admin/inventory/maintenance` — calendar/list of due services and full maintenance log per asset.
- `/admin/inventory/projects` — pick a project → see allocated materials, used vs remaining, assigned assets, total cost.
- `/admin/inventory/reports` — exportable CSVs: stock valuation, consumption by project, asset utilization, maintenance history, full transaction ledger.

Reused building blocks: `AdminShell` sidebar, `ListEditor` pattern for simple CRUD (locations, basic asset/consumable/tool forms), shadcn `Dialog`/`Sheet`/`Table`/`Badge`/`Tabs` for richer flows.

## 3. Cross-links with existing CMS

- Asset row optionally links to a public `equipment` row → the public Equipment page can later show a real "X available" badge instead of static "Available" text (no public schema changes; we just join on read).
- `project_material_allocations` and asset assignments reference existing `projects.id`, so the existing admin Projects screen gains a "Materials & assets" tab showing what's been used on each project.

## 4. Alerts

- In-app only (no email yet): the inventory dashboard surfaces low-stock and maintenance-due lists; sidebar shows a red dot when either count > 0. Email/SMS notifications can be added later as a follow-up.

## 5. Out of scope (call out explicitly)

- Barcode/QR scanning, purchase orders & supplier workflow, multi-currency, public-facing availability changes, staff role (everything stays admin-only as you chose).

## Technical notes

- All schema changes via one migration with CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY in order. Triggers for `updated_at` and for the append-only ledger.
- All data access via `supabase` client from admin routes (RLS enforces admin-only) — no server functions needed for v1.
- CSV export done client-side from current query results to keep things simple.
- Reuse `ListEditor` where shape fits; build custom screens for assets (history timeline), consumables (stock movement dialogs), and tools (checkout flow).
