import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/equipment")({
  component: () => (
    <ListEditor
      table="equipment"
      title="Equipment"
      defaultRow={{ name: "", category: "", description: "", image_url: "", quantity: 1, order_index: 0, is_published: true }}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
        { name: "quantity", label: "Qty" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image_url", label: "Image URL", type: "image" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});