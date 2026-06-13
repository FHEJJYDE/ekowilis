import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FieldForm } from "@/components/admin/list-editor";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/company")({
  component: CompanyEditor,
});

const fields = [
  { name: "name", label: "Company name", type: "text" as const, required: true },
  { name: "short_name", label: "Short name", type: "text" as const, required: true },
  { name: "tagline", label: "Tagline", type: "text" as const },
  { name: "mission", label: "Mission", type: "textarea" as const },
  { name: "vision", label: "Vision", type: "textarea" as const },
  { name: "story", label: "Story", type: "textarea" as const },
  { name: "rc_number", label: "RC number", type: "text" as const },
  { name: "founded_year", label: "Founded year", type: "text" as const },
  { name: "head_office", label: "Head office address", type: "text" as const },
  { name: "branch_office", label: "Branch office address", type: "text" as const },
  { name: "email", label: "Email", type: "text" as const },
  { name: "phone", label: "Phone", type: "text" as const },
];

function CompanyEditor() {
  const [row, setRow] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("company_info").select("*").eq("id", 1).maybeSingle();
      setRow(data ?? { id: 1, name: "", short_name: "" });
    })();
  }, []);

  async function save() {
    if (!row) return;
    setSaving(true);
    const payload = { ...row, id: 1 };
    delete payload.updated_at;
    const { error } = await supabase.from("company_info").upsert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Company info saved");
  }

  if (!row) return <div>Loading…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Company info</h1>
      <p className="mt-1 text-sm text-muted-foreground">Used in footer, about page and contact page.</p>
      <div className="mt-6 rounded-lg border bg-card p-6">
        <FieldForm fields={fields} value={row} onChange={setRow} />
        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}