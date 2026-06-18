import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/inventory/locations")({
  component: () => (
    <ListEditor
      table="inventory_locations"
      title="Locations"
      description="Yards, warehouses, project sites and vehicles where inventory lives."
      orderBy={{ column: "name", ascending: true }}
      defaultRow={{ name: "", type: "yard", address: "", notes: "", is_active: true }}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "type", label: "Type" },
        { name: "address", label: "Address" },
        { name: "is_active", label: "Active" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "type", label: "Type", type: "text", helper: "yard | site | warehouse | vehicle | other" },
        { name: "address", label: "Address", type: "text" },
        { name: "notes", label: "Notes", type: "textarea" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});