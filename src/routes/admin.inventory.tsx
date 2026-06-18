import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryLayout,
});

const tabs = [
  { to: "/admin/inventory", label: "Overview", exact: true },
  { to: "/admin/inventory/assets", label: "Assets" },
  { to: "/admin/inventory/consumables", label: "Consumables" },
  { to: "/admin/inventory/tools", label: "Tools" },
  { to: "/admin/inventory/locations", label: "Locations" },
  { to: "/admin/inventory/transfers", label: "Transactions" },
  { to: "/admin/inventory/maintenance", label: "Maintenance" },
  { to: "/admin/inventory/projects", label: "Project usage" },
  { to: "/admin/inventory/reports", label: "Reports" },
];

function InventoryLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div>
      <div className="mb-6 border-b">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}