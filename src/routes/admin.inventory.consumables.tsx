import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/inventory/consumables")({
  component: ConsumablesPage,
});

type Consumable = {
  id?: string;
  sku?: string | null;
  name: string;
  category?: string | null;
  unit: string;
  quantity_on_hand: number;
  reorder_point: number;
  reorder_quantity: number;
  unit_cost?: number | null;
  supplier?: string | null;
  notes?: string | null;
};

const empty: Consumable = {
  name: "",
  unit: "pcs",
  quantity_on_hand: 0,
  reorder_point: 0,
  reorder_quantity: 0,
};

function ConsumablesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Consumable | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [stockMove, setStockMove] = useState<{ row: any; mode: "receive" | "issue" } | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase.from("consumables" as any).select("*").order("name");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any[]) ?? []);
  }
  useEffect(() => { refresh(); }, []);

  async function save(c: Consumable) {
    const payload: any = { ...c };
    delete payload.created_at;
    delete payload.updated_at;
    if (c.id) {
      const { error } = await supabase.from("consumables" as any).update(payload).eq("id", c.id);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    } else {
      delete payload.id;
      const { error } = await supabase.from("consumables" as any).insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Created");
    }
    setEditing(null);
    refresh();
  }

  async function remove(row: any) {
    const { error } = await supabase.from("consumables" as any).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consumables & spare parts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stock levels, reorder points and movements.
          </p>
        </div>
        <Button onClick={() => setEditing({ ...empty })}>
          <Plus className="mr-1 h-4 w-4" /> New SKU
        </Button>
      </header>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Reorder at</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No SKUs yet.</td></tr>
              ) : rows.map((r) => {
                const low = Number(r.quantity_on_hand) <= Number(r.reorder_point);
                return (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{r.sku ?? "—"}</td>
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3">{r.category ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={low ? "inline-flex items-center gap-1 text-amber-600" : ""}>
                        {low && <AlertTriangle className="h-3 w-3" />}
                        {r.quantity_on_hand} {r.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.reorder_point} {r.unit}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.supplier ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="icon" title="Receive stock" onClick={() => setStockMove({ row: r, mode: "receive" })}>
                          <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Issue stock" onClick={() => setStockMove({ row: r, mode: "issue" })}>
                          <ArrowUpFromLine className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditing(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleting(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit" : "New"} consumable</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="SKU" v={editing.sku ?? ""} on={(v) => setEditing({ ...editing, sku: v })} />
              <Field label="Name *" v={editing.name} on={(v) => setEditing({ ...editing, name: v })} />
              <Field label="Category" v={editing.category ?? ""} on={(v) => setEditing({ ...editing, category: v })} />
              <Field label="Unit" v={editing.unit} on={(v) => setEditing({ ...editing, unit: v })} placeholder="pcs, kg, L, bag" />
              <Field label="Quantity on hand" type="number" v={editing.quantity_on_hand} on={(v) => setEditing({ ...editing, quantity_on_hand: Number(v) })} />
              <Field label="Reorder point" type="number" v={editing.reorder_point} on={(v) => setEditing({ ...editing, reorder_point: Number(v) })} />
              <Field label="Reorder quantity" type="number" v={editing.reorder_quantity} on={(v) => setEditing({ ...editing, reorder_quantity: Number(v) })} />
              <Field label="Unit cost" type="number" v={editing.unit_cost ?? ""} on={(v) => setEditing({ ...editing, unit_cost: v === "" ? null : Number(v) })} />
              <Field label="Supplier" v={editing.supplier ?? ""} on={(v) => setEditing({ ...editing, supplier: v })} />
              <div className="sm:col-span-2">
                <Label>Notes</Label>
                <Textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {stockMove && (
        <StockMoveDialog
          row={stockMove.row}
          mode={stockMove.mode}
          onClose={() => setStockMove(null)}
          onDone={() => { setStockMove(null); refresh(); }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this SKU?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && remove(deleting)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, v, on, type = "text", placeholder }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={v} placeholder={placeholder} onChange={(e) => on(e.target.value)} />
    </div>
  );
}

function StockMoveDialog({ row, mode, onClose, onDone }: { row: any; mode: "receive" | "issue"; onClose: () => void; onDone: () => void }) {
  const [qty, setQty] = useState<number>(0);
  const [note, setNote] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode === "issue") {
      supabase.from("projects" as any).select("id,title").order("title").then(({ data }) => setProjects((data as any[]) ?? []));
    }
  }, [mode]);

  async function submit() {
    if (qty <= 0) return toast.error("Quantity must be greater than zero");
    setBusy(true);
    const signed = mode === "receive" ? Math.abs(qty) : -Math.abs(qty);
    const newQty = Number(row.quantity_on_hand) + signed;
    if (newQty < 0) {
      setBusy(false);
      return toast.error("Not enough stock");
    }
    const { data: userData } = await supabase.auth.getUser();
    const updErr = await supabase.from("consumables" as any).update({ quantity_on_hand: newQty }).eq("id", row.id);
    if (updErr.error) { setBusy(false); return toast.error(updErr.error.message); }
    const txnErr = await supabase.from("inventory_transactions" as any).insert({
      item_kind: "consumable",
      item_id: row.id,
      txn_type: mode,
      quantity: signed,
      project_id: projectId || null,
      performed_by: userData.user?.id,
      performed_by_name: userData.user?.email,
      note,
    });
    setBusy(false);
    if (txnErr.error) return toast.error(txnErr.error.message);
    toast.success(`${mode === "receive" ? "Received" : "Issued"} ${qty} ${row.unit}`);
    onDone();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "receive" ? "Receive stock" : "Issue stock"} · {row.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Current: {row.quantity_on_hand} {row.unit}</div>
          <div>
            <Label>Quantity ({row.unit})</Label>
            <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
          {mode === "issue" && (
            <div>
              <Label>Project (optional)</Label>
              <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">—</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
          <div>
            <Label>Note</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Confirm"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}