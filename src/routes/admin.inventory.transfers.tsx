import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toCSV, downloadCSV } from "@/lib/csv";
import { Download } from "lucide-react";

export const Route = createFileRoute("/admin/inventory/transfers")({
  component: TransfersPage,
});

function TransfersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory_transactions" as any)
        .select("*")
        .order("occurred_at", { ascending: false })
        .limit(500);
      setLoading(false);
      if (!error) setRows((data as any[]) ?? []);
    })();
  }, []);

  const filtered = useMemo(() => rows.filter((r) =>
    (!kind || r.item_kind === kind) &&
    (!type || r.txn_type === type) &&
    (!search || (r.note ?? "").toLowerCase().includes(search.toLowerCase()) || (r.performed_by_name ?? "").toLowerCase().includes(search.toLowerCase()))
  ), [rows, kind, type, search]);

  function exportCSV() {
    downloadCSV(`inventory-transactions-${new Date().toISOString().slice(0,10)}.csv`,
      toCSV(filtered, ["occurred_at","item_kind","item_id","txn_type","quantity","from_location_id","to_location_id","project_id","performed_by_name","note"]));
  }

  return (
    <div>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions ledger</h1>
          <p className="mt-1 text-sm text-muted-foreground">Append-only history of every inventory movement.</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-1 h-4 w-4" /> Export CSV</Button>
      </header>

      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <div>
          <Label className="text-xs">Item kind</Label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">All</option>
            <option value="asset">Asset</option>
            <option value="consumable">Consumable</option>
            <option value="tool">Tool</option>
          </select>
        </div>
        <div>
          <Label className="text-xs">Type</Label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            {["receive","issue","transfer","return","adjust","waste","status_change","checkout","checkin"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Search note / person</Label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">By</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No transactions match.</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{new Date(r.occurred_at).toLocaleString()}</td>
                <td className="px-4 py-2">{r.item_kind}</td>
                <td className="px-4 py-2"><span className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.txn_type}</span></td>
                <td className="px-4 py-2">{r.quantity ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.performed_by_name ?? "—"}</td>
                <td className="px-4 py-2">{r.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}