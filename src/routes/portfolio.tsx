import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { projects } from "@/content/projects";
import { GallerySection } from "@/components/gallery-section";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — EKOWILLS Civil Engineering Projects" },
      {
        name: "description",
        content:
          "Selected EKOWILLS projects — Nigerian Navy hostel, internal asphalt roads with drainage, Premier Primary School, Zoo Estate maintenance and more.",
      },
      { property: "og:title", content: "EKOWILLS Portfolio" },
      {
        property: "og:description",
        content: "Roads, drainage and building construction projects across Enugu and beyond.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Portfolio"
        title="Selected projects from across Nigeria."
        description="A look at recent civil engineering, road and building works delivered for government agencies, the Nigerian Navy, schools and private estates."
      />

      <section className="container-x py-20">
        <div className="grid gap-12">
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              to="/portfolio/$slug"
              params={{ slug: p.slug }}
              className={`group grid items-center gap-8 md:grid-cols-12 ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="md:col-span-7">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-secondary">
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
                  {p.category} · {p.status} · {p.year}
                </div>
                <h2 className="mt-3 text-2xl tracking-tight text-foreground md:text-3xl group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
                <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="uppercase tracking-[0.16em] text-muted-foreground">Client</div>
                    <div className="mt-1 text-foreground">{p.client}</div>
                  </div>
                  <div>
                    <div className="uppercase tracking-[0.16em] text-muted-foreground">Location</div>
                    <div className="mt-1 text-foreground">{p.location}</div>
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent">
                  View project <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <GallerySection
        category="portfolio"
        eyebrow="Project gallery"
        heading="More from our sites"
        description="Recent photos uploaded from active and completed project sites."
      />
    </SiteLayout>
  );
}