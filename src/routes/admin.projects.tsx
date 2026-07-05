import { createFileRoute } from "@tanstack/react-router";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/admin/projects")({
  component: () => (
    <ListEditor
      table="projects"
      title="Projects"
      description="Portfolio entries."
      defaultRow={{ slug: "", title: "", client: "", location: "", category: "Roads", status: "Completed", year: "", summary: "", scope: [], cover_url: "", gallery: [], videos: [], order_index: 0, is_published: true }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "category", label: "Category" },
        { name: "status", label: "Status" },
        { name: "year", label: "Year" },
        { name: "is_published", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "client", label: "Client", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "category", label: "Category", type: "text", helper: "Roads / Buildings / Drainage / Maintenance" },
        { name: "status", label: "Status", type: "text", helper: "Completed / Ongoing" },
        { name: "year", label: "Year", type: "text" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "scope", label: "Scope items", type: "list", helper: "One per line" },
        { name: "cover_url", label: "Cover image URL", type: "image", helper: "Leave empty to use seeded fallback (when the slug matches one of the seeded projects)." },
        { name: "gallery", label: "Gallery image URLs", type: "list", helper: "One URL per line" },
<<<<<<< HEAD
        { name: "videos", label: "Videos", type: "video-list", helper: "Format: URL | Title (one per line). Example: /NNSS-UMOPU/WhatsApp Video 2026-07-05 at 15.19.19.mp4 | Hostel Construction Video" },
=======
        { name: "videos", label: "Video URLs", type: "list", helper: "One URL per line (e.g. YouTube embed or direct video links)" },
>>>>>>> f673d3d77bfb8b23c66a65f407402d1caddfd9d6
        { name: "order_index", label: "Order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});