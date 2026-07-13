import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, Trash2, Pencil } from "lucide-react";
import { sanitizeSupabaseUrl } from "@/lib/utils";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

type Category = "portfolio" | "equipment";

type Row = {
  id: string;
  category: Category;
  title: string | null;
  caption: string | null;
  image_url: string;
  storage_path: string | null;
  order_index: number;
  is_published: boolean;
  signedUrl?: string;
};

function GalleryAdmin() {
  const [tab, setTab] = useState<Category>("portfolio");
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload photos shown in the public Portfolio and Equipment galleries.
        </p>
      </header>
      <Tabs value={tab} onValueChange={(v) => setTab(v as Category)}>
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio" className="mt-6">
          <GalleryPanel category="portfolio" />
        </TabsContent>
        <TabsContent value="equipment" className="mt-6">
          <GalleryPanel category="equipment" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GalleryPanel({ category }: { category: Category }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_images" as any)
      .select("*")
      .eq("category", category)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    const list = (data ?? []) as unknown as Row[];
    const withUrls = await Promise.all(
      list.map(async (r) => {
        if (r.storage_path) {
          const { data: s } = await supabase.storage
            .from("media")
            .createSignedUrl(r.storage_path, 60 * 60);
          return { ...r, signedUrl: s?.signedUrl };
        }
        return { ...r, signedUrl: sanitizeSupabaseUrl(r.image_url) };
      }),
    );
    setRows(withUrls);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `gallery/${category}/${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) {
          toast.error(`${file.name}: ${upErr.message}`);
          continue;
        }
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const { error: dbErr } = await supabase.from("gallery_images" as any).insert({
          category,
          image_url: pub.publicUrl,
          storage_path: path,
          title: file.name.replace(/\.[^.]+$/, ""),
          is_published: true,
          order_index: 0,
        });
        if (dbErr) toast.error(`${file.name}: ${dbErr.message}`);
      }
      toast.success("Upload complete");
      refresh();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(r: Row) {
    if (!confirm("Delete this image?")) return;
    if (r.storage_path) await supabase.storage.from("media").remove([r.storage_path]);
    const { error } = await supabase.from("gallery_images" as any).delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  }

  async function saveMeta() {
    if (!editing) return;
    const { error } = await supabase
      .from("gallery_images" as any)
      .update({
        title: editing.title,
        caption: editing.caption,
        order_index: editing.order_index,
        is_published: editing.is_published,
      })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} image${rows.length === 1 ? "" : "s"}`}
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => upload(e.target.files)}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="mr-1 h-4 w-4" />
            {uploading ? "Uploading…" : "Upload images"}
          </Button>
        </div>
      </div>

      {!loading && rows.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          No images yet. Click “Upload images” to add some.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-lg border bg-card">
              <div className="aspect-video w-full bg-muted">
                {r.signedUrl && (
                  <img src={r.signedUrl} alt={r.title ?? ""} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <div className="truncate text-sm font-medium" title={r.title ?? ""}>
                  {r.title || "Untitled"}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Order: {r.order_index} · {r.is_published ? "Published" : "Hidden"}
                </div>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing(r)}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit image</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Caption</Label>
                <Input
                  value={editing.caption ?? ""}
                  onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={editing.order_index}
                  onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_published}
                  onCheckedChange={(v) => setEditing({ ...editing, is_published: v })}
                />
                <span className="text-sm text-muted-foreground">
                  {editing.is_published ? "Published" : "Hidden"}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveMeta}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}