import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Wrench, PackageCheck, Boxes, Truck, Hammer } from "lucide-react";

export const Route = createFileRoute("/admin/inventory/")({
  component: InventoryDashboard,
});

function InventoryDashboard() {
  const [stats, setStats] = useState<any>({});
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [maintDue, setMaintDue] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [assets, inUse, consumables, tools, checkedOut, locations] = await Promise.all([
        supabase.from("assets" as any).select("id", { count: "exact", head: true }),
        supabase.from("assets" as any).select("id", { count: "exact", head: true }).eq("status", "in_use"),
        supabase.from("consumables" as any).select("id", { count: "exact", head: true }),
        supabase.from("tools" as any).select("id", { count: "exact", head: true }),
        supabase.from("tools" as any).select("id", { count: "exact", head: true }).eq("status", "checked_out"),
        supabase.from("inventory_locations" as any).select("id", { count: "exact", head: true }),
      ]);
      setStats({
        assets: assets.count ?? 0,
        inUse: inUse.count ?? 0,
        consumables: consumables.count ?? 0,
        tools: tools.count ?? 0,
        checkedOut: checkedOut.count ?? 0,
        locations: locations.count ?? 0,
      });

      const { data: cons } = await supabase
        .from("consumables" as any)
        .select("id,name,unit,quantity_on_hand,reorder_point")
        .order("name");
      setLowStock(((cons as any[]) ?? []).filter((c) => Number(c.quantity_on_hand) <= Number(c.reorder_point)));

      const horizon = new Date();
      horizon.setDate(horizon.getDate() + 14);
      const { data: due } = await supabase
        .from("assets" as any)
        .select("id,asset_tag,name,next_service_due_at,status")
        .not("next_service_due_at", "is", null)
        .lte("next_service_due_at", horizon.toISOString())
        .order("next_service_due_at");
      setMaintDue((due as any[]) ?? []);

      const { data: txns } = await supabase
        .from("inventory_transactions" as any)
        .select("id,item_kind,txn_type,quantity,note,occurred_at,performed_by_name")
        .order("occurred_at", { ascending: false })
        .limit(10);
      setRecent((txns as any[]) ?? []);
    })();
  }, []);

  const cards = [
    { label: "Total assets", value: stats.assets, icon: Truck, to: "/admin/inventory/assets" },
    { label: "In use", value: stats.inUse, icon: PackageCheck, to: "/admin/inventory/assets" },
    { label: "Consumable SKUs", value: stats.consumables, icon: Boxes, to: "/admin/inventory/consumables" },
    { label: "Tools", value: stats.tools, icon: Hammer, to: "/admin/inventory/tools" },
    { label: "Tools checked out", value: stats.checkedOut, icon: Hammer, to: "/admin/inventory/tools" },
    { label: "Locations", value: stats.locations, icon: Boxes, to: "/admin/inventory/locations" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Inventory overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Live stock, asset and maintenance status.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to as any} className="rounded-lg border bg-card p-4 hover:border-primary/40">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-2 text-3xl font-semibold">{c.value ?? "—"}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-card">
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low stock ({lowStock.length})
            </div>
            <Link to="/admin/inventory/consumables" className="text-xs text-muted-foreground hover:underline">
              Manage
            </Link>
          </header>
          <ul className="divide-y">
            {lowStock.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">All stock above reorder point.</li>
            ) : (
              lowStock.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">
                    {c.quantity_on_hand} {c.unit} / reorder at {c.reorder_point}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-lg border bg-card">
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wrench className="h-4 w-4 text-blue-500" />
              Maintenance due ({maintDue.length})
            </div>
            <Link to="/admin/inventory/maintenance" className="text-xs text-muted-foreground hover:underline">
              Manage
            </Link>
          </header>
          <ul className="divide-y">
            {maintDue.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">Nothing due in the next 14 days.</li>
            ) : (
              maintDue.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span>{a.asset_tag} · {a.name}</span>
                  <span className="text-muted-foreground">
                    {new Date(a.next_service_due_at).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-lg border bg-card">
        <header className="border-b px-4 py-3 text-sm font-medium">Recent activity</header>
        <ul className="divide-y">
          {recent.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">No transactions yet.</li>
          ) : (
            recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs uppercase">{t.txn_type}</span>{" "}
                  <span className="text-muted-foreground">{t.item_kind}</span>{" "}
                  {t.quantity != null && <span>· qty {t.quantity}</span>}
                  {t.note && <span className="text-muted-foreground"> · {t.note}</span>}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(t.occurred_at).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}