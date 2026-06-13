import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/team")({
  component: () => (
    <ListEditor
      table="team_members"
      title="Team members"
      defaultRow={{ name: "", role: "", group_name: "Leadership", photo_url: "", order_index: 0, is_published: true }}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "role", label: "Role" },
        { name: "group_name", label: "Group" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role / title", type: "text" },
        { name: "group_name", label: "Group", type: "text", helper: "e.g. Leadership, Engineering, Operations" },
        { name: "photo_url", label: "Photo URL", type: "image" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});