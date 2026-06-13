import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Pencil, Plus, Trash2 } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "image" | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helper?: string;
};

export type ListEditorProps = {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  listColumns: { name: string; label: string }[];
  defaultRow?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
};

export function ListEditor({
  table,
  title,
  description,
  fields,
  listColumns,
  defaultRow = {},
  orderBy = { column: "order_index", ascending: true },
}: ListEditorProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .order(orderBy.column, { ascending: orderBy.ascending ?? true });
    setLoading(false);
    if (error) {
      toast.error(`Load failed: ${error.message}`);
      return;
    }
    setRows(data ?? []);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  async function save(row: any) {
    const payload = { ...row };
    // strip server-managed
    delete payload.created_at;
    delete payload.updated_at;

    if (row.id) {
      const { error } = await supabase.from(table as any).update(payload).eq("id", row.id);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    } else {
      delete payload.id;
      const { error } = await supabase.from(table as any).insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Created");
    }
    setEditing(null);
    refresh();
  }

  async function remove(row: any) {
    const { error } = await supabase.from(table as any).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button onClick={() => setEditing({ ...defaultRow })}>
          <Plus className="mr-1 h-4 w-4" /> New
        </Button>
      </header>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {listColumns.map((c) => (
                  <th key={c.name} className="px-4 py-3">{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={listColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={listColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground">No records yet.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id ?? JSON.stringify(r)} className="border-b last:border-0 hover:bg-muted/30">
                    {listColumns.map((c) => (
                      <td key={c.name} className="px-4 py-3 align-top">
                        {renderCell(r[c.name])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleting(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit" : "New"} · {title.replace(/s$/, "")}</DialogTitle>
          </DialogHeader>
          {editing && (
            <FieldForm
              fields={fields}
              value={editing}
              onChange={setEditing}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => save(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
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

function renderCell(v: any) {
  if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "string" && v.length > 80) return v.slice(0, 80) + "…";
  return String(v);
}

export function FieldForm({
  fields,
  value,
  onChange,
}: {
  fields: Field[];
  value: Record<string, any>;
  onChange: (v: Record<string, any>) => void;
}) {
  function set(name: string, v: any) {
    onChange({ ...value, [name]: v });
  }
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
          {f.type === "textarea" ? (
            <Textarea
              id={f.name}
              rows={4}
              value={value[f.name] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "boolean" ? (
            <div className="flex items-center gap-2">
              <Switch checked={!!value[f.name]} onCheckedChange={(v) => set(f.name, v)} />
              <span className="text-sm text-muted-foreground">{value[f.name] ? "Yes" : "No"}</span>
            </div>
          ) : f.type === "number" ? (
            <Input
              id={f.name}
              type="number"
              value={value[f.name] ?? 0}
              onChange={(e) => set(f.name, Number(e.target.value))}
            />
          ) : f.type === "list" ? (
            <Textarea
              id={f.name}
              rows={3}
              placeholder={f.placeholder ?? "One per line"}
              value={Array.isArray(value[f.name]) ? value[f.name].join("\n") : (value[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            />
          ) : (
            <Input
              id={f.name}
              value={value[f.name] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => set(f.name, e.target.value)}
            />
          )}
          {f.helper && <p className="text-xs text-muted-foreground">{f.helper}</p>}
          {f.type === "image" && value[f.name] && (
            <img src={value[f.name]} alt="" className="mt-2 h-20 rounded border object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}