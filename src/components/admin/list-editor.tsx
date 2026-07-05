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

export type FieldType = "text" | "textarea" | "number" | "boolean" | "image" | "list" | "video-list";

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

async function uploadToStorage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`;
  const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (upErr) {
    throw new Error(upErr.message);
  }
  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  return pub.publicUrl;
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
  const [uploadingField, setUploadingField] = useState<string | null>(null);

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
            <div className="space-y-2">
              <Textarea
                id={f.name}
                rows={3}
                placeholder={f.placeholder ?? "One URL per line"}
                value={Array.isArray(value[f.name]) ? value[f.name].join("\n") : (value[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Upload and append photos:</span>
                <label className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent cursor-pointer select-none">
                  {uploadingField === f.name ? "Uploading..." : "Upload Photos"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploadingField !== null}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setUploadingField(f.name);
                      const uploadedUrls: string[] = [];
                      try {
                        for (const file of Array.from(files)) {
                          const url = await uploadToStorage(file);
                          uploadedUrls.push(url);
                        }
                        const currentList = Array.isArray(value[f.name]) ? value[f.name] : [];
                        set(f.name, [...currentList, ...uploadedUrls]);
                        toast.success(`Uploaded ${uploadedUrls.length} photo(s)!`);
                      } catch (err: any) {
                        toast.error(`Upload failed: ${err.message}`);
                      } finally {
                        setUploadingField(null);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          ) : f.type === "video-list" ? (
            <div className="space-y-2">
              <Textarea
                id={f.name}
                rows={4}
                placeholder={f.placeholder ?? "URL | Title (one per line)"}
                value={(() => {
                  const raw = value[f.name];
                  if (!raw) return "";
                  if (Array.isArray(raw)) {
                    return raw
                      .map((v: any) => {
                        if (typeof v === "string") return `${v} | Video`;
                        return `${v?.url || ""} | ${v?.title || ""}`;
                      })
                      .join("\n");
                  }
                  if (typeof raw === "string") {
                    try {
                      const parsed = JSON.parse(raw);
                      if (Array.isArray(parsed)) {
                        return parsed.map((v: any) => `${v?.url || ""} | ${v?.title || ""}`).join("\n");
                      }
                    } catch {}
                    return raw;
                  }
                  return "";
                })()}
                onChange={(e) => {
                  const lines = e.target.value.split("\n");
                  const videoObjects = lines
                    .map((line) => {
                      const parts = line.split("|").map((s) => s.trim());
                      if (!parts[0]) return null;
                      return {
                        url: parts[0],
                        title: parts[1] || "Project Presentation",
                      };
                    })
                    .filter(Boolean);
                  set(f.name, videoObjects);
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Upload and append videos:</span>
                <label className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent cursor-pointer select-none">
                  {uploadingField === f.name ? "Uploading..." : "Upload Videos"}
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    disabled={uploadingField !== null}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setUploadingField(f.name);
                      const uploadedVideos: { url: string; title: string }[] = [];
                      try {
                        for (const file of Array.from(files)) {
                          const url = await uploadToStorage(file);
                          const title = file.name.split(".").slice(0, -1).join(" ") || "Video Presentation";
                          uploadedVideos.push({ url, title });
                        }
                        const currentList = Array.isArray(value[f.name]) ? value[f.name] : [];
                        set(f.name, [...currentList, ...uploadedVideos]);
                        toast.success(`Uploaded ${uploadedVideos.length} video(s)!`);
                      } catch (err: any) {
                        toast.error(`Upload failed: ${err.message}`);
                      } finally {
                        setUploadingField(null);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          ) : f.type === "image" ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  id={f.name}
                  value={value[f.name] ?? ""}
                  placeholder={f.placeholder ?? "Paste URL or upload image"}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="flex-1"
                />
                <label className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent cursor-pointer shrink-0 select-none">
                  {uploadingField === f.name ? "Uploading..." : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingField !== null}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingField(f.name);
                      try {
                        const url = await uploadToStorage(file);
                        set(f.name, url);
                        toast.success("Image uploaded!");
                      } catch (err: any) {
                        toast.error(`Upload failed: ${err.message}`);
                      } finally {
                        setUploadingField(null);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
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