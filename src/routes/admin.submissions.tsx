import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Check, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/submissions")({
  component: Submissions,
});

function Submissions() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
      <p className="mt-1 text-sm text-muted-foreground">Messages and quote requests from the website.</p>
      <Tabs defaultValue="quotes" className="mt-6">
        <TabsList>
          <TabsTrigger value="quotes">Quote requests</TabsTrigger>
          <TabsTrigger value="contact">Contact messages</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes" className="mt-4">
          <List table="quote_submissions" kind="quote" />
        </TabsContent>
        <TabsContent value="contact" className="mt-4">
          <List table="contact_submissions" kind="contact" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function List({ table, kind }: { table: string; kind: "quote" | "contact" }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows(data ?? []);
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [table]);

  async function toggleRead(r: any) {
    const { error } = await supabase.from(table as any).update({ is_read: !r.is_read }).eq("id", r.id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function remove(r: any) {
    const { error } = await supabase.from(table as any).delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (rows.length === 0) return <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No submissions yet.</div>;

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <article key={r.id} className={`rounded-lg border bg-card p-4 ${!r.is_read ? "border-primary/40" : ""}`}>
          <header className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{r.name}</h3>
                {!r.is_read && <Badge>New</Badge>}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                {r.phone ? ` · ${r.phone}` : ""}
                {` · ${new Date(r.created_at).toLocaleString()}`}
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => toggleRead(r)}>
                <Check className="mr-1 h-4 w-4" /> {r.is_read ? "Mark unread" : "Mark read"}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`mailto:${r.email}`}><Mail className="mr-1 h-4 w-4" /> Reply</a>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(r)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </header>
          {kind === "quote" ? (
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {r.project_type && <Row label="Project type">{r.project_type}</Row>}
              {r.location && <Row label="Location">{r.location}</Row>}
              {r.timeline && <Row label="Timeline">{r.timeline}</Row>}
              {r.budget && <Row label="Budget">{r.budget}</Row>}
              {r.scope && <Row label="Scope">{r.scope}</Row>}
            </dl>
          ) : (
            r.subject && <div className="mt-2 text-sm font-medium">{r.subject}</div>
          )}
          {r.message && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{r.message}</p>}
        </article>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}