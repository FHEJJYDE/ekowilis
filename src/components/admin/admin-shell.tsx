import { ReactNode, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Building2,
  Wrench,
  FolderKanban,
  Users,
  Truck,
  Briefcase,
  Award,
  Inbox,
  FolderOpen,
  Boxes,
  Images,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero", icon: ImageIcon },
  { to: "/admin/company", label: "Company", icon: Building2 },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/equipment", label: "Equipment", icon: Truck },
  { to: "/admin/clients", label: "Clients", icon: Briefcase },
  { to: "/admin/credentials", label: "Credentials", icon: Award },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/media", label: "Media", icon: FolderOpen },
];

// Just the nav links — no logo, no buttons, no text headers
function SidebarNav({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <nav style={{ padding: "8px" }}>
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to as any}
            onClick={onNavClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "2px",
              textDecoration: "none",
              backgroundColor: active ? "var(--primary)" : "transparent",
              color: active ? "var(--primary-foreground)" : "var(--foreground)",
            }}
            className={active ? "" : "hover:bg-muted transition-colors"}
          >
            <Icon style={{ width: "15px", height: "15px", flexShrink: 0 }} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ email, children }: { email: string | null; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/staff-access" as any }).catch(() => {
      window.location.href = "/staff-access";
    });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster richColors position="top-right" />

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--card)",
          padding: "0 16px",
          height: "60px",
        }}
      >
        {/* Left: hamburger (mobile) + logo (always) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Menu style={{ width: "18px", height: "18px" }} />
          </button>
          <img
            src="/logo.png"
            alt="Ekowilis"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Right: Back to Site + Sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "var(--muted-foreground)",
              textDecoration: "none",
              padding: "6px 10px",
              borderRadius: "6px",
            }}
            className="hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft style={{ width: "14px", height: "14px" }} />
            <span>Back to Site</span>
          </Link>
          <Button variant="outline" size="sm" onClick={signOut} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LogOut style={{ width: "14px", height: "14px" }} />
            <span>Sign out</span>
          </Button>
        </div>
      </header>

      <div style={{ display: "flex" }}>

        {/* ── Desktop sidebar (nav links only) ────────────────── */}
        <aside
          className="hidden md:block"
          style={{
            position: "sticky",
            top: "60px",
            height: "calc(100vh - 60px)",
            width: "220px",
            flexShrink: 0,
            borderRight: "1px solid var(--border)",
            backgroundColor: "var(--card)",
            overflowY: "auto",
          }}
        >
          <SidebarNav pathname={pathname} />
          {/* Email at the very bottom */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", fontSize: "11px", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </div>
        </aside>

        {/* ── Mobile: backdrop ─────────────────────────────────── */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
        )}

        {/* ── Mobile: drawer sidebar (nav links only) ──────────── */}
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 70,
            width: "240px",
            backgroundColor: "var(--card)",
            boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer top: close button only */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "12px 12px 4px" }}>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X style={{ width: "14px", height: "14px" }} />
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <SidebarNav pathname={pathname} onNavClick={() => setDrawerOpen(false)} />
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", fontSize: "11px", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </div>
        </aside>

        {/* ── Page content ─────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="p-4 md:p-8">{children}</div>
        </main>

      </div>
    </div>
  );
}
