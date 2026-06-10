import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { clients } from "@/content/clients";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients — EKOWILLS Logistics & Engineering" },
      {
        name: "description",
        content:
          "Government agencies, the Nigerian Navy, oil & gas operators and private estates we've served, including FERMA, NDDC and Enugu State Government.",
      },
      { property: "og:title", content: "EKOWILLS Clients" },
      {
        property: "og:description",
        content: "Public-sector, navy, oil & gas and private clients trust EKOWILLS for civil engineering and logistics.",
      },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Clients"
        title="The organizations we build for."
        description="From federal agencies to private estates, EKOWILLS has delivered civil engineering, road, drainage and building works for a range of public-sector and private clients."
      />

      <section className="container-x py-20">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c, i) => (
            <div key={c} className="bg-background p-8">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Client · 0{i + 1}
              </div>
              <div className="mt-2 text-lg font-medium text-foreground">{c}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}