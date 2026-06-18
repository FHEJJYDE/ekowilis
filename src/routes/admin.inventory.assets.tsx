import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/inventory/assets")({
  component: () => (
    <ListEditor
      table="assets"
      title="Assets"
      description="Individually tracked units — excavators, trucks, generators, etc."
      orderBy={{ column: "asset_tag", ascending: true }}
      defaultRow={{
        asset_tag: "",
        name: "",
        category: "",
        status: "available",
        make: "",
        model: "",
        serial_number: "",
        year: null,
        assigned_to_person: "",
        purchase_cost: null,
        current_value: null,
        hours_meter: null,
        odometer: null,
        image_url: "",
        notes: "",
      }}
      listColumns={[
        { name: "asset_tag", label: "Tag" },
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
        { name: "status", label: "Status" },
        { name: "assigned_to_person", label: "Assigned" },
        { name: "hours_meter", label: "Hours" },
      ]}
      fields={[
        { name: "asset_tag", label: "Asset tag", type: "text", required: true, placeholder: "EKW-EXC-001" },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text" },
        { name: "status", label: "Status", type: "text", helper: "available | in_use | maintenance | leased_out | retired" },
        { name: "make", label: "Make", type: "text" },
        { name: "model", label: "Model", type: "text" },
        { name: "serial_number", label: "Serial number", type: "text" },
        { name: "year", label: "Year", type: "number" },
        { name: "assigned_to_person", label: "Assigned to (person)", type: "text" },
        { name: "purchase_date", label: "Purchase date", type: "text", helper: "YYYY-MM-DD" },
        { name: "purchase_cost", label: "Purchase cost", type: "number" },
        { name: "current_value", label: "Current value", type: "number" },
        { name: "hours_meter", label: "Hours meter", type: "number" },
        { name: "odometer", label: "Odometer", type: "number" },
        { name: "next_service_due_at", label: "Next service due", type: "text", helper: "ISO date e.g. 2026-07-01" },
        { name: "next_service_due_hours", label: "Next service due (hours)", type: "number" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  ),
});