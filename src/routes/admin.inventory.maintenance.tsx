import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Wrench } from "lucide-react";

export const Route = createFileRoute("/admin/inventory/maintenance")({
  component: MaintenancePage,
});

function MaintenancePage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

  async function refresh() {
    const [{ data: a }, { data: l }] = await Promise.all([
      supabase.from("assets" as any).select("id,asset_tag,name,status,hours_meter,last_service_at,next_service_due_at,next_service_due_hours").order("asset_tag"),
      supabase.from("maintenance_logs" as any).select("*").order("performed_at", { ascending: false }).limit(100),
    ]);
    setAssets((a as any[]) ?? []);
    setLogs((l as any[]) ?? []);
  }
  useEffect(() => { refresh(); }, []);

  const now = Date.now();
  const due = assets.filter((a) => {
    const t = a.next_service_due_at ? new Date(a.next_service_due_at).getTime() : null;
    return t && t <= now + 14 * 86400000;
  });

  return (
    <div>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Maintenance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Service schedule and full history.</p>
        </div>
        <Button onClick={() => setAdding(true)}><Plus className="mr-1 h-4 w-4" /> Log service</Button>
      </header>

      <section className="mb-6 rounded-lg border bg-card">
        <header className="border-b px-4 py-3 text-sm font-medium flex items-center gap-2">
          <Wrench className="h-4 w-4 text-blue-500" /> Due in the next 14 days ({due.length})
        </header>
        <ul className="divide-y">
          {due.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">All assets up to date.</li>
          ) : due.map((a) => (
            <li key={a.id} className="flex items-center justify-between px-4 py-2 text-sm">
              <span>{a.asset_tag} · {a.name}</span>
              <span className="text-muted-foreground">{new Date(a.next_service_due_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-card overflow-x-auto">
        <header className="border-b px-4 py-3 text-sm font-medium">Recent maintenance history</header>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">By</th>
              <th className="px-4 py-3">Hours</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No logs yet.</td></tr>
            ) : logs.map((l) => {
              const a = assets.find((x) => x.id === l.asset_id);
              return (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(l.performed_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{a ? `${a.asset_tag} · ${a.name}` : l.asset_id}</td>
                  <td className="px-4 py-2">{l.type}</td>
                  <td className="px-4 py-2 text-muted-foreground">{l.performed_by ?? "—"}</td>
                  <td className="px-4 py-2">{l.hours_at_service ?? "—"}</td>
                  <td className="px-4 py-2">{l.cost ?? "—"}</td>
                  <td className="px-4 py-2">{l.notes ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {adding && <AddLog assets={assets} onClose={() => setAdding(false)} onDone={() => { setAdding(false); refresh(); }} />}
    </div>
  );
}

function AddLog({ assets, onClose, onDone }: { assets: any[]; onClose: () => void; onDone: () => void }) {
  const [assetId, setAssetId] = useState(assets[0]?.id ?? "");
  const [type, setType] = useState("service");
  const [performedBy, setPerformedBy] = useState("");
  const [hours, setHours] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [nextDueAt, setNextDueAt] = useState("");
  const [nextDueHours, setNextDueHours] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!assetId) return toast.error("Pick an asset");
    setBusy(true);
    const payload: any = {
      asset_id: assetId,
      type,
      performed_by: performedBy || null,
      hours_at_service: hours === "" ? null : Number(hours),
      cost: cost === "" ? null : Number(cost),
      next_due_at: nextDueAt ? new Date(nextDueAt).toISOString() : null,
      next_due_hours: nextDueHours === "" ? null : Number(nextDueHours),
      notes: notes || null,
    };
    const ins = await supabase.from("maintenance_logs" as any).insert(payload);
    if (ins.error) { setBusy(false); return toast.error(ins.error.message); }
    await supabase.from("assets" as any).update({
      last_service_at: new Date().toISOString(),
      next_service_due_at: payload.next_due_at,
      next_service_due_hours: payload.next_due_hours,
    }).eq("id", assetId);
    setBusy(false);
    toast.success("Logged");
    onDone();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Log maintenance</DialogTitle></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Asset</Label>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              {assets.map((a) => <option key={a.id} value={a.id}>{a.asset_tag} · {a.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Type</Label>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="service">Service</option>
              <option value="repair">Repair</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>
          <div><Label>Performed by</Label><Input value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} /></div>
          <div><Label>Hours at service</Label><Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
          <div><Label>Cost</Label><Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} /></div>
          <div><Label>Next due date</Label><Input type="date" value={nextDueAt} onChange={(e) => setNextDueAt(e.target.value)} /></div>
          <div><Label>Next due hours</Label><Input type="number" value={nextDueHours} onChange={(e) => setNextDueHours(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save log"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}