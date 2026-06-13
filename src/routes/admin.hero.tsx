import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FieldForm } from "@/components/admin/list-editor";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/hero")({
  component: HeroEditor,
});

const fields = [
  { name: "eyebrow", label: "Eyebrow", type: "text" as const },
  { name: "title", label: "Title", type: "textarea" as const, required: true },
  { name: "subtitle", label: "Subtitle", type: "textarea" as const },
  { name: "cta_label", label: "CTA label", type: "text" as const },
  { name: "cta_href", label: "CTA link", type: "text" as const },
  { name: "image_url", label: "Image URL", type: "image" as const, helper: "Leave empty to use the default seeded image." },
];

function HeroEditor() {
  const [row, setRow] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("hero").select("*").eq("id", 1).maybeSingle();
      setRow(data ?? { id: 1, eyebrow: "", title: "", subtitle: "", cta_label: "Request a quote", cta_href: "/contact", image_url: "" });
    })();
  }, []);

  async function save() {
    if (!row) return;
    setSaving(true);
    const payload = { ...row, id: 1 };
    delete payload.updated_at;
    const { error } = await supabase.from("hero").upsert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Hero saved");
  }

  if (!row) return <div>Loading…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Hero section</h1>
      <p className="mt-1 text-sm text-muted-foreground">Appears on the homepage.</p>
      <div className="mt-6 rounded-lg border bg-card p-6">
        <FieldForm fields={fields} value={row} onChange={setRow} />
        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}