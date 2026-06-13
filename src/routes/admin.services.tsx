import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/services")({
  component: () => (
    <ListEditor
      table="services"
      title="Services"
      description="What we do — shown on the homepage and services page."
      defaultRow={{ slug: "", title: "", summary: "", description: "", icon: "", order_index: 0, is_published: true }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "order_index", label: "Order" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, helper: "Lowercase, hyphen-separated." },
        { name: "summary", label: "Short summary", type: "textarea" },
        { name: "description", label: "Full description", type: "textarea" },
        { name: "icon", label: "Icon name (optional)", type: "text" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});