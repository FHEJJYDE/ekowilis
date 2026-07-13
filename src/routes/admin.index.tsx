import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Download, Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage site content and inbox.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/admin/hero" className="rounded-lg border bg-card p-4 hover:border-primary/40">
          <div className="text-sm font-medium">Edit hero section</div>
          <div className="mt-1 text-xs text-muted-foreground">Headline, subtitle, CTA, image.</div>
        </Link>
        <Link to="/admin/company" className="rounded-lg border bg-card p-4 hover:border-primary/40">
          <div className="text-sm font-medium">Edit company info</div>
          <div className="mt-1 text-xs text-muted-foreground">Address, email, RC number, mission.</div>
        </Link>
      </div>

      <DatabaseBackupRestore />
    </div>
  );
}

const BACKUP_TABLES = [
  "clients",
  "credentials",
  "media_assets",
  "team_members",
  "projects",
  "services",
  "equipment",
  "inventory_locations",
  "consumables",
  "assets",
  "tools",
  "project_material_allocations",
  "maintenance_logs",
  "quote_submissions",
  "contact_submissions",
  "gallery_images"
] as const;

function DatabaseBackupRestore() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleExport = async () => {
    setIsExporting(true);
    setStatus("Fetching database tables...");
    try {
      const backupData: Record<string, any[]> = {};
      for (const table of BACKUP_TABLES) {
        setStatus(`Exporting ${table}...`);
        const { data, error } = await supabase.from(table as any).select("*");
        if (error) throw error;
        backupData[table] = data || [];
      }

      setStatus("Generating backup file...");
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ekowilis_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Database backup downloaded successfully!");
      setStatus("");
    } catch (err: any) {
      console.error(err);
      toast.error(`Export failed: ${err.message}`);
      setStatus("");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setStatus("Reading backup file...");
    try {
      const text = await file.text();
      
      // Sanitise backup text to use current Supabase project URL
      const currentSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      let sanitizedText = text;
      if (currentSupabaseUrl) {
        // Replace ysmwaiulrjwgzeislweb or any other old Supabase domains with the active one
        sanitizedText = text.replace(/https:\/\/[a-zA-Z0-9-]+\.supabase\.co/g, currentSupabaseUrl);
      }
      
      const backupData = JSON.parse(sanitizedText);

      // Perform upsert table-by-table in safe foreign key dependency order
      for (const table of BACKUP_TABLES) {
        let rows = backupData[table];
        if (!Array.isArray(rows) || rows.length === 0) {
          continue;
        }

        // Clean up user foreign key references (uploaded_by) for media_assets to prevent foreign key errors on new project
        if (table === "media_assets") {
          rows = rows.map(r => ({ ...r, uploaded_by: null }));
        }

        setStatus(`Importing ${rows.length} rows to ${table}...`);

        // Split rows into chunks of 100 to prevent hitting Supabase payload limits
        const chunkSize = 100;
        for (let i = 0; i < rows.length; i += chunkSize) {
          const chunk = rows.slice(i, i + chunkSize);
          const { error } = await supabase.from(table as any).upsert(chunk);
          if (error) {
            console.error(`Error importing chunk for ${table}:`, error);
            throw new Error(`Failed to upsert to ${table}: ${error.message}`);
          }
        }
      }

      toast.success("Database restored successfully!");
      setStatus("");
      // Reload page to refresh dashboard counts after a slight delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toast.error(`Import failed: ${err.message}`);
      setStatus("");
    } finally {
      setIsImporting(false);
      e.target.value = ""; // clear file selection
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-medium">Database Backup & Restore</h2>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">
        Export all site data (projects, services, inventory, submissions) to a JSON file, or restore it back to another database.
      </p>

      {status && (
        <div className="mt-4 flex items-center gap-2 rounded border bg-muted/30 px-3 py-2 text-xs text-muted-foreground animate-pulse">
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>{status}</span>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting || isImporting}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/95 disabled:opacity-50 select-none cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export Backup (JSON)"}
        </button>

        <label className={`inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent cursor-pointer select-none ${(isExporting || isImporting) ? "opacity-50 pointer-events-none" : ""}`}>
          <Upload className="h-4 w-4" />
          {isImporting ? "Importing..." : "Import Backup (JSON)"}
          <input
            type="file"
            accept=".json"
            className="hidden"
            disabled={isExporting || isImporting}
            onChange={handleImport}
          />
        </label>
      </div>
    </div>
  );
}