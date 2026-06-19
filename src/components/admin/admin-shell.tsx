import { ReactNode } from "react";
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

export function AdminShell({ email, children }: { email: string | null; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-card md:flex md:flex-col">
          <div className="border-b px-5 py-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">EKOWILLS</div>
            <div className="mt-1 text-sm font-semibold">CMS</div>
          </div>
          <nav className="flex-1 space-y-0.5 p-2">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to as any}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-3">
            <div className="mb-2 px-1 text-xs text-muted-foreground truncate">{email}</div>
            <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
            <div className="text-sm font-semibold">EKOWILLS CMS</div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </header>
          <div className="md:hidden border-b bg-card px-2 py-2 overflow-x-auto">
            <div className="flex gap-1">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}