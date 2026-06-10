import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { equipment } from "@/content/equipment";
import equipmentImage from "@/assets/equipment-works.jpg";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment & Fleet — EKOWILLS" },
      {
        name: "description",
        content:
          "EKOWILLS owns its earth-moving equipment, road construction plant and haulage fleet — used on our projects and available for lease.",
      },
      { property: "og:title", content: "EKOWILLS Equipment & Fleet" },
      {
        property: "og:description",
        content: "Excavators, graders, rollers, tippers and more — for our own projects and for lease.",
      },
      { property: "og:image", content: equipmentImage },
    ],
  }),
  component: EquipmentPage,
});

function EquipmentPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Equipment & fleet"
        title="We own our equipment — that's how we cut downtime."
        description="A working fleet of earth-moving plant, road construction machinery and haulage vehicles. Deployed on our own projects, and available for lease to other contractors and project owners."
      />

      <section className="container-x py-16">
        <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-border">
          <img src={equipmentImage} alt="EKOWILLS equipment on site" className="h-full w-full object-cover" />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {equipment.map((group) => (
            <div key={group.category} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
                {group.category}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center justify-between border-b border-border/70 py-2 last:border-0">
                    <span>{item}</span>
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Available</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-secondary/60 p-8 md:p-10">
          <div className="grid items-center gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
                Equipment leasing
              </div>
              <h2 className="mt-3 text-2xl tracking-tight text-foreground md:text-3xl">
                Need a unit on hire? Tell us the project, location and dates.
              </h2>
            </div>
            <div className="md:text-right">
              <Link to="/contact" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Request leasing quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}