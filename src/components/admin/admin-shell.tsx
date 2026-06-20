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

function SidebarContent({
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
    <div className="flex h-full flex-col">
      {/* Sidebar header */}
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <img src="/logo.png" alt="Ekowilis" className="h-10 w-auto object-contain" />
        <div>
          <div className="text-sm font-bold leading-none">EKOWILIS</div>
          <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">CMS</div>
        </div>
      </div>

      {/* Back to site */}
      <div className="border-b px-3 py-2">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onNavClick}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              onClick={onNavClick}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="border-t p-3">
        <div className="mb-2 px-1 text-xs text-muted-foreground truncate">{email}</div>
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
      <div className="flex">

        {/* ── Desktop sidebar ─────────────────────────────────── */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-card md:flex md:flex-col">
          <SidebarContent pathname={pathname} email={email} signOut={signOut} />
        </aside>

        {/* ── Mobile drawer overlay ────────────────────────────── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile sidebar drawer ────────────────────────────── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-xl transition-transform duration-300 ease-in-out md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Close button inside drawer */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent
            pathname={pathname}
            email={email}
            onNavClick={() => setDrawerOpen(false)}
            signOut={signOut}
          />
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <img src="/logo.png" alt="Ekowilis" className="h-8 w-auto object-contain" />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </header>

          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
