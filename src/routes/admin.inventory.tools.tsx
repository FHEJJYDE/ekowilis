import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, ArrowRightLeft } from "lucide-react";

export const Route = createFileRoute("/admin/inventory/tools")({
  component: ToolsPage,
});

const empty: any = { tool_tag: "", name: "", category: "", status: "available", condition: "" };

function ToolsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [checkout, setCheckout] = useState<any | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase.from("tools" as any).select("*").order("tool_tag");
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any[]) ?? []);
  }
  useEffect(() => { refresh(); }, []);

  async function save(c: any) {
    const payload = { ...c };
    delete payload.created_at; delete payload.updated_at;
    if (c.id) {
      const { error } = await supabase.from("tools" as any).update(payload).eq("id", c.id);
      if (error) return toast.error(error.message);
    } else {
      delete payload.id;
      const { error } = await supabase.from("tools" as any).insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setEditing(null); refresh();
  }

  async function remove(r: any) {
    const { error } = await supabase.from("tools" as any).delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); setDeleting(null); refresh();
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hand tools and small equipment with check-out tracking.</p>
        </div>
        <Button onClick={() => setEditing({ ...empty })}><Plus className="mr-1 h-4 w-4" /> New tool</Button>
      </header>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked out to</th>
              <th className="px-4 py-3">Due back</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No tools yet.</td></tr>
            ) : rows.map((r) => {
              const overdue = r.expected_return_at && new Date(r.expected_return_at) < new Date() && r.status === "checked_out";
              return (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{r.tool_tag}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-1.5 py-0.5 text-xs ${r.status === "checked_out" ? "bg-amber-100 text-amber-800" : "bg-muted"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.checked_out_to ?? "—"}</td>
                  <td className={`px-4 py-3 ${overdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                    {r.expected_return_at ? new Date(r.expected_return_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" title="Check in/out" onClick={() => setCheckout(r)}>
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} tool</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-3 sm:grid-cols-2">
              <F label="Tag *" v={editing.tool_tag} on={(v) => setEditing({ ...editing, tool_tag: v })} />
              <F label="Name *" v={editing.name} on={(v) => setEditing({ ...editing, name: v })} />
              <F label="Category" v={editing.category ?? ""} on={(v) => setEditing({ ...editing, category: v })} />
              <F label="Status" v={editing.status} on={(v) => setEditing({ ...editing, status: v })} helper="available | checked_out | maintenance | lost | retired" />
              <F label="Condition" v={editing.condition ?? ""} on={(v) => setEditing({ ...editing, condition: v })} />
              <F label="Purchase cost" type="number" v={editing.purchase_cost ?? ""} on={(v) => setEditing({ ...editing, purchase_cost: v === "" ? null : Number(v) })} />
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

      {checkout && <CheckoutDialog tool={checkout} onClose={() => setCheckout(null)} onDone={() => { setCheckout(null); refresh(); }} />}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this tool?</AlertDialogTitle>
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

function F({ label, v, on, type = "text", helper }: { label: string; v: any; on: (v: string) => void; type?: string; helper?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={v} onChange={(e) => on(e.target.value)} />
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

function CheckoutDialog({ tool, onClose, onDone }: { tool: any; onClose: () => void; onDone: () => void }) {
  const isOut = tool.status === "checked_out";
  const [person, setPerson] = useState(tool.checked_out_to ?? "");
  const [due, setDue] = useState(tool.expected_return_at?.slice(0, 10) ?? "");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const { data: userData } = await supabase.auth.getUser();
    if (isOut) {
      const upd = await supabase.from("tools" as any).update({
        status: "available",
        checked_out_to: null,
        checked_out_at: null,
        expected_return_at: null,
      }).eq("id", tool.id);
      if (upd.error) { setBusy(false); return toast.error(upd.error.message); }
      await supabase.from("inventory_transactions" as any).insert({
        item_kind: "tool", item_id: tool.id, txn_type: "checkin",
        performed_by: userData.user?.id, performed_by_name: userData.user?.email, note,
      });
      toast.success("Checked in");
    } else {
      if (!person.trim()) { setBusy(false); return toast.error("Person required"); }
      const upd = await supabase.from("tools" as any).update({
        status: "checked_out",
        checked_out_to: person,
        checked_out_at: new Date().toISOString(),
        expected_return_at: due ? new Date(due).toISOString() : null,
      }).eq("id", tool.id);
      if (upd.error) { setBusy(false); return toast.error(upd.error.message); }
      await supabase.from("inventory_transactions" as any).insert({
        item_kind: "tool", item_id: tool.id, txn_type: "checkout",
        performed_by: userData.user?.id, performed_by_name: userData.user?.email,
        note: `To ${person}${note ? " · " + note : ""}`,
      });
      toast.success("Checked out");
    }
    setBusy(false);
    onDone();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isOut ? "Check in" : "Check out"} · {tool.name}</DialogTitle>
        </DialogHeader>
        {!isOut && (
          <div className="space-y-3">
            <div><Label>Person</Label><Input value={person} onChange={(e) => setPerson(e.target.value)} /></div>
            <div><Label>Expected return</Label><Input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></div>
          </div>
        )}
        <div><Label>Note</Label><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : isOut ? "Check in" : "Check out"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}