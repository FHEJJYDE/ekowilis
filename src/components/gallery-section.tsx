import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeSupabaseUrl } from "@/lib/utils";

type Row = {
  id: string;
  title: string | null;
  caption: string | null;
  image_url: string;
  storage_path: string | null;
};

type Item = Row & { displayUrl: string };

export function GallerySection({
  category,
  heading = "Gallery",
  eyebrow = "Photos",
  description,
}: {
  category: "portfolio" | "equipment";
  heading?: string;
  eyebrow?: string;
  description?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Item | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("gallery_images" as any)
        .select("id,title,caption,image_url,storage_path,order_index")
        .eq("category", category)
        .eq("is_published", true)
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      const rows = (data ?? []) as unknown as Row[];
      const withUrls = rows.map((r) => {
        let displayUrl = r.image_url;
        if (r.storage_path) {
          const { data: pub } = supabase.storage.from("media").getPublicUrl(r.storage_path);
          displayUrl = pub.publicUrl;
        }
        return { ...r, displayUrl: sanitizeSupabaseUrl(displayUrl) };
      });
      if (!cancelled) {
        setItems(withUrls);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="container-x py-16">
      <div className="mb-8 max-w-2xl">
        <div className="text-[11px] uppercase tracking-[0.18em] text-accent">{eyebrow}</div>
        <h2 className="mt-3 text-2xl tracking-tight text-foreground md:text-3xl">{heading}</h2>
        {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <button
              type="button"
              key={it.id}
              onClick={() => setLightbox(it)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary"
            >
              <img
                src={it.displayUrl}
                alt={it.title ?? it.caption ?? "Gallery image"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              {(it.title || it.caption) && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left opacity-0 transition-opacity group-hover:opacity-100">
                  {it.title && <div className="text-xs font-medium text-white">{it.title}</div>}
                  {it.caption && <div className="text-[11px] text-white/80">{it.caption}</div>}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-h-full max-w-5xl">
            <img
              src={lightbox.displayUrl}
              alt={lightbox.title ?? "Gallery image"}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            {(lightbox.title || lightbox.caption) && (
              <div className="mt-3 text-center text-sm text-white/90">
                {lightbox.title && <div className="font-medium">{lightbox.title}</div>}
                {lightbox.caption && <div className="text-white/70">{lightbox.caption}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}