import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { services } from "@/content/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — EKOWILLS Logistics & Engineering" },
      {
        name: "description",
        content:
          "Road construction, drainage, building construction, civil works, equipment leasing, procurement and maintenance services across Nigeria.",
      },
      { property: "og:title", content: "EKOWILLS Services" },
      {
        property: "og:description",
        content: "Heavy civil engineering services — roads, drainage, buildings, equipment leasing.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title="Heavy civil engineering for roads, drainage and buildings."
        description="From earthworks and asphalt to reinforced concrete drains and full building construction — delivered with our own equipment, our own people, and a discipline shaped by 20+ years on site."
      />

      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.slug}
              className="group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-baseline justify-between">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  0{i + 1}
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
                  Service
                </div>
              </div>
              <h2 className="mt-4 text-2xl tracking-tight text-foreground">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/60 p-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
              Need something specific?
            </div>
            <p className="mt-2 text-base text-foreground">
              Tell us about your project — scope, location, timeline. We'll come
              back with a clear quote.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Request a quote
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}