import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Copy, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  component: MediaLibrary,
});

type Asset = {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  signedUrl?: string;
};

function MediaLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    const rows = (data ?? []) as Asset[];
    // sign URLs
    const signed = await Promise.all(rows.map(async (r) => {
      const { data: s } = await supabase.storage.from("media").createSignedUrl(r.storage_path, 60 * 60);
      return { ...r, signedUrl: s?.signedUrl };
    }));
    setAssets(signed);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "bin";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const { error: dbErr } = await supabase.from("media_assets").insert({
          filename: file.name,
          storage_path: path,
          public_url: pub.publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
          uploaded_by: userId,
        });
        if (dbErr) { toast.error(`${file.name}: ${dbErr.message}`); continue; }
      }
      toast.success("Upload complete");
      refresh();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(a: Asset) {
    await supabase.storage.from("media").remove([a.storage_path]);
    const { error } = await supabase.from("media_assets").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  }

  async function copyUrl(a: Asset) {
    const url = a.signedUrl ?? a.public_url;
    await navigator.clipboard.writeText(url);
    toast.success("URL copied (1-hour signed link)");
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Media library</h1>
          <p className="mt-1 text-sm text-muted-foreground">Private bucket. Use signed URLs in content.</p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => upload(e.target.files)}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="mr-1 h-4 w-4" />
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : assets.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          No media uploaded yet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((a) => (
            <div key={a.id} className="rounded-lg border bg-card overflow-hidden">
              {a.mime_type?.startsWith("image/") ? (
                <img src={a.signedUrl} alt={a.filename} className="aspect-video w-full object-cover" />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted text-xs text-muted-foreground">
                  {a.mime_type ?? "file"}
                </div>
              )}
              <div className="p-3">
                <div className="truncate text-sm font-medium" title={a.filename}>{a.filename}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB · ` : ""}
                  {new Date(a.created_at).toLocaleDateString()}
                </div>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => copyUrl(a)}>
                    <Copy className="mr-1 h-3 w-3" /> Copy URL
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(a)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}