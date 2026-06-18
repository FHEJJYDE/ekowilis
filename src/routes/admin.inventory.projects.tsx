import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/inventory/projects")({
  component: ProjectUsagePage,
});

function ProjectUsagePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [allocations, setAllocations] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [consumables, setConsumables] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("projects" as any).select("id,title").order("title"),
        supabase.from("consumables" as any).select("id,name,unit,unit_cost").order("name"),
      ]);
      setProjects((p as any[]) ?? []);
      setConsumables((c as any[]) ?? []);
      if (p && (p as any[]).length) setProjectId((p as any[])[0].id);
    })();
  }, []);

  async function refresh() {
    if (!projectId) return;
    const [{ data: alloc }, { data: a }] = await Promise.all([
      supabase.from("project_material_allocations" as any).select("*").eq("project_id", projectId),
      supabase.from("assets" as any).select("id,asset_tag,name,status,assigned_to_person").eq("assigned_to_project_id", projectId),
    ]);
    setAllocations((alloc as any[]) ?? []);
    setAssets((a as any[]) ?? []);
  }
  useEffect(() => { refresh(); }, [projectId]);

  const totalCost = useMemo(() =>
    allocations.reduce((sum, a) => {
      const c = consumables.find((x) => x.id === a.consumable_id);
      const cost = Number(c?.unit_cost ?? 0) * Number(a.quantity_used ?? 0);
      return sum + cost;
    }, 0)
  , [allocations, consumables]);

  async function remove(id: string) {
    const { error } = await supabase.from("project_material_allocations" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Project usage</h1>
        <p className="mt-1 text-sm text-muted-foreground">Materials and assets assigned to each project.</p>
      </header>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[260px]">
          <Label className="text-xs">Project</Label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <Button onClick={() => setAdding(true)} disabled={!projectId}><Plus className="mr-1 h-4 w-4" /> Allocate material</Button>
        <div className="ml-auto text-right text-sm">
          <div className="text-xs uppercase text-muted-foreground">Materials cost (used)</div>
          <div className="text-lg font-semibold">{totalCost.toLocaleString(undefined, { style: "currency", currency: "NGN" })}</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-card overflow-x-auto">
          <header className="border-b px-4 py-3 text-sm font-medium">Material allocations</header>
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Material</th><th className="px-4 py-3">Allocated</th><th className="px-4 py-3">Used</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {allocations.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No allocations.</td></tr>
              ) : allocations.map((a) => {
                const c = consumables.find((x) => x.id === a.consumable_id);
                return (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{c?.name ?? a.consumable_id}</td>
                    <td className="px-4 py-2">{a.quantity_allocated} {c?.unit}</td>
                    <td className="px-4 py-2">{a.quantity_used} {c?.unit}</td>
                    <td className="px-4 py-2"><span className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.status}</span></td>
                    <td className="px-4 py-2 text-right"><Button variant="ghost" size="icon" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="rounded-lg border bg-card overflow-x-auto">
          <header className="border-b px-4 py-3 text-sm font-medium">Assigned assets</header>
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Tag</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Operator</th></tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No assets assigned. Set <code>assigned_to_project_id</code> on assets.</td></tr>
              ) : assets.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{a.asset_tag}</td>
                  <td className="px-4 py-2">{a.name}</td>
                  <td className="px-4 py-2">{a.status}</td>
                  <td className="px-4 py-2 text-muted-foreground">{a.assigned_to_person ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {adding && <AddAllocation projectId={projectId} consumables={consumables} onClose={() => setAdding(false)} onDone={() => { setAdding(false); refresh(); }} />}
    </div>
  );
}

function AddAllocation({ projectId, consumables, onClose, onDone }: { projectId: string; consumables: any[]; onClose: () => void; onDone: () => void }) {
  const [consumableId, setConsumableId] = useState(consumables[0]?.id ?? "");
  const [qty, setQty] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!consumableId || qty <= 0) return toast.error("Select material and quantity");
    setBusy(true);
    const { error } = await supabase.from("project_material_allocations" as any).insert({
      project_id: projectId, consumable_id: consumableId, quantity_allocated: qty, status: "allocated",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Allocated");
    onDone();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Allocate material</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Material</Label>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={consumableId} onChange={(e) => setConsumableId(e.target.value)}>
              {consumables.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}
            </select>
          </div>
          <div><Label>Quantity</Label><Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Allocate"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}