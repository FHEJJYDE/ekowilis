import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/credentials")({
  component: () => (
    <ListEditor
      table="credentials"
      title="Credentials"
      description="Certificates, licences, registrations."
      defaultRow={{ title: "", reference: "", issuer: "", year: "", document_url: "", order_index: 0, is_published: true }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "issuer", label: "Issuer" },
        { name: "year", label: "Year" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "reference", label: "Reference / number", type: "text" },
        { name: "issuer", label: "Issuer", type: "text" },
        { name: "year", label: "Year", type: "text" },
        { name: "document_url", label: "Document URL", type: "text" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});