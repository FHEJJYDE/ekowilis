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

function SidebarNav({
  pathname,
  email,
  onNavClick,
  signOut,
}: {
  pathname: string;
  email: string | null;
  onNavClick?: () => void;
  signOut: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/logo.png" alt="Ekowilis" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1 }}>EKOWILIS</div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--muted-foreground)", marginTop: "3px" }}>Admin CMS</div>
        </div>
      </div>

      {/* Back to site */}
      <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
        <Link
          to="/"
          onClick={onNavClick}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", fontSize: "13px", color: "var(--muted-foreground)", textDecoration: "none" }}
          className="hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft style={{ width: "15px", height: "15px" }} />
          Back to Site
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
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

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "12px" }}>
        <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "8px", padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email}
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
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

      {/* ── Top bar (all screen sizes) ───────────────────────── */}
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
          height: "56px",
        }}
      >
        {/* Left: hamburger (mobile only) + logo/title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Hamburger — rendered via CSS visibility so Tailwind md:hidden works */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-md border border-border bg-transparent cursor-pointer"
            style={{ width: "36px", height: "36px" }}
          >
            <Menu style={{ width: "18px", height: "18px" }} />
          </button>
          {/* Logo only on mobile (sidebar shows it on desktop) */}
          <img
            src="/logo.png"
            alt="Ekowilis"
            className="md:hidden"
            style={{ height: "34px", width: "auto", objectFit: "contain" }}
          />
          {/* Title only on desktop */}
          <span
            className="hidden md:inline"
            style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}
          >
            Admin CMS
          </span>
        </div>

        {/* Right: back to site + sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--muted-foreground)", textDecoration: "none", padding: "6px 10px", borderRadius: "6px" }}
            className="hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft style={{ width: "14px", height: "14px" }} />
            <span className="hidden sm:inline">Back to Site</span>
          </Link>
          <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* ── Desktop sidebar ─────────────────────────────────── */}
        <aside
          className="hidden md:flex md:flex-col"
          style={{
            position: "sticky",
            top: "56px",
            height: "calc(100vh - 56px)",
            width: "240px",
            flexShrink: 0,
            borderRight: "1px solid var(--border)",
            backgroundColor: "var(--card)",
            overflowY: "auto",
          }}
        >
          <SidebarNav pathname={pathname} email={email} signOut={signOut} />
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

        {/* ── Mobile: sidebar drawer ───────────────────────────── */}
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 70,
            width: "260px",
            backgroundColor: "var(--card)",
            boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
          }}
          className="md:hidden"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            <X style={{ width: "14px", height: "14px" }} />
          </button>
          <SidebarNav
            pathname={pathname}
            email={email}
            onNavClick={() => setDrawerOpen(false)}
            signOut={signOut}
          />
        </aside>

        {/* ── Page content ─────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
