import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const counters = [
  { table: "projects", label: "Projects", to: "/admin/projects" },
  { table: "services", label: "Services", to: "/admin/services" },
  { table: "team_members", label: "Team", to: "/admin/team" },
  { table: "equipment", label: "Equipment", to: "/admin/equipment" },
  { table: "clients", label: "Clients", to: "/admin/clients" },
  { table: "credentials", label: "Credentials", to: "/admin/credentials" },
  { table: "contact_submissions", label: "Contact messages", to: "/admin/submissions" },
  { table: "quote_submissions", label: "Quote requests", to: "/admin/submissions" },
] as const;

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const out: Record<string, number> = {};
      await Promise.all(counters.map(async (c) => {
        const { count } = await supabase.from(c.table as any).select("*", { count: "exact", head: true });
        out[c.table] = count ?? 0;
      }));
      setCounts(out);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage site content and inbox.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((c) => (
          <Link
            key={c.table}
            to={c.to as any}
            className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
            <div className="mt-2 text-3xl font-semibold">{counts[c.table] ?? "—"}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
              Manage <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/admin/hero" className="rounded-lg border bg-card p-4 hover:border-primary/40">
          <div className="text-sm font-medium">Edit hero section</div>
          <div className="mt-1 text-xs text-muted-foreground">Headline, subtitle, CTA, image.</div>
        </Link>
        <Link to="/admin/company" className="rounded-lg border bg-card p-4 hover:border-primary/40">
          <div className="text-sm font-medium">Edit company info</div>
          <div className="mt-1 text-xs text-muted-foreground">Address, email, RC number, mission.</div>
        </Link>
      </div>
    </div>
  );
}