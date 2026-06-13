import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminSession } from "@/hooks/use-admin-session";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "EKOWILLS Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const { loading, isAdmin, email, userId } = useAdminSession();

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      navigate({ to: "/staff-access" as any }).catch(() => {
        window.location.href = "/staff-access";
      });
    }
  }, [loading, userId, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30 text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!userId) return null;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30 px-4">
        <div className="max-w-md rounded-lg border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {email} is signed in but not on the admin list. Ask an administrator to add
            this email to <code>admin_emails</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell email={email}>
      <Outlet />
    </AdminShell>
  );
}