import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toCSV, downloadCSV } from "@/lib/csv";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inventory/reports")({
  component: ReportsPage,
});

const reports = [
  {
    key: "stock-valuation",
    title: "Stock valuation",
    description: "Every consumable with quantity on hand and cost.",
    run: async () => {
      const { data, error } = await supabase.from("consumables" as any).select("sku,name,category,unit,quantity_on_hand,unit_cost,supplier").order("name");
      if (error) throw error;
      return ((data as any[]) ?? []).map((r) => ({ ...r, value: (Number(r.unit_cost ?? 0) * Number(r.quantity_on_hand ?? 0)).toFixed(2) }));
    },
  },
  {
    key: "asset-utilization",
    title: "Asset utilization",
    description: "Status, location and operator for each asset.",
    run: async () => {
      const { data, error } = await supabase.from("assets" as any).select("asset_tag,name,category,status,hours_meter,odometer,assigned_to_person,last_service_at,next_service_due_at").order("asset_tag");
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  },
  {
    key: "consumption-by-project",
    title: "Consumption by project",
    description: "Allocated vs used materials per project.",
    run: async () => {
      const { data, error } = await supabase.from("project_material_allocations" as any).select("project_id,consumable_id,quantity_allocated,quantity_used,status");
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  },
  {
    key: "maintenance-history",
    title: "Maintenance history",
    description: "All service, repair and inspection logs.",
    run: async () => {
      const { data, error } = await supabase.from("maintenance_logs" as any).select("asset_id,type,performed_at,performed_by,hours_at_service,cost,notes").order("performed_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  },
  {
    key: "transaction-ledger",
    title: "Full transaction ledger",
    description: "Every inventory movement recorded.",
    run: async () => {
      const { data, error } = await supabase.from("inventory_transactions" as any).select("occurred_at,item_kind,item_id,txn_type,quantity,from_location_id,to_location_id,project_id,performed_by_name,note").order("occurred_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  },
];

function ReportsPage() {
  const [busy, setBusy] = useState<string | null>(null);

  async function download(r: (typeof reports)[number]) {
    setBusy(r.key);
    try {
      const rows = await r.run();
      if (!rows.length) {
        toast.message("No data to export");
        return;
      }
      downloadCSV(`${r.key}-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(rows));
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Export inventory data as CSV.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {reports.map((r) => (
          <div key={r.key} className="rounded-lg border bg-card p-4">
            <div className="text-sm font-medium">{r.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{r.description}</div>
            <Button className="mt-3" variant="outline" size="sm" disabled={busy === r.key} onClick={() => download(r)}>
              <Download className="mr-1 h-4 w-4" />
              {busy === r.key ? "Preparing…" : "Download CSV"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}