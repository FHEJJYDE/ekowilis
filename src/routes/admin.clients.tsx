import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/clients")({
  component: () => (
    <ListEditor
      table="clients"
      title="Clients"
      defaultRow={{ name: "", sector: "", logo_url: "", order_index: 0, is_published: true }}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "sector", label: "Sector" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "sector", label: "Sector", type: "text" },
        { name: "logo_url", label: "Logo URL", type: "image" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});