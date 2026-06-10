import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { company, stats } from "@/content/company";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { clients } from "@/content/clients";
import heroImage from "@/assets/nnss-asphalt-drainage.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKOWILLS Logistics & Engineering — Civil Engineering in Nigeria" },
      {
        name: "description",
        content:
          "Nigerian civil engineering, road construction, drainage and building company based in Enugu. Engineering with style since 2003.",
      },
      { property: "og:title", content: "EKOWILLS Logistics & Engineering Ltd" },
      {
        property: "og:description",
        content:
          "Roads, drainage, buildings and equipment leasing across Nigeria. Trusted by Nigerian Navy, FERMA, NDDC and the Enugu State Government.",
      },
      { property: "og:image", content: heroImage },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = projects.slice(0, 3);
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <div className="reveal text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Civil Engineering · Enugu, Nigeria · {company.rc}
            </div>
            <h1 className="reveal reveal-delay-1 mt-4 text-5xl leading-[1.02] tracking-tight text-foreground md:text-7xl">
              Roads, drainage and buildings —{" "}
              <span className="text-muted-foreground">engineering with style.</span>
            </h1>
            <p className="reveal reveal-delay-2 mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              {company.shortName} is a Nigerian civil engineering, equipment
              leasing and procurement company. Direct-labour contractors since{" "}
              {company.founded}, incorporated in {company.incorporated}, and
              trusted on projects for the Nigerian Navy, FERMA, NDDC and state
              governments.
            </p>
            <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                See our work
              </Link>
            </div>
          </div>

          <div className="reveal reveal-delay-2 md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary">
              <img
                src={heroImage}
                alt="EKOWILLS asphalted internal roads with drainage system at NNSS Umuopu, Enugu"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-5 text-primary-foreground">
                <div className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/70">
                  Featured · Roads & Drainage
                </div>
                <div className="mt-1 text-base font-medium">
                  NNSS Umuopu — internal asphalt roads with RC drainage
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container-x grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              What we do
            </div>
            <h2 className="mt-3 max-w-2xl text-3xl tracking-tight md:text-5xl">
              Heavy engineering, delivered with our own people and equipment.
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
          >
            All services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <div key={s.slug} className="bg-background p-7 transition-colors hover:bg-secondary/50">
              <div className="text-base font-semibold text-foreground">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-x py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Selected work
              </div>
              <h2 className="mt-3 max-w-2xl text-3xl tracking-tight md:text-5xl">
                Recent projects across Enugu and beyond.
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
            >
              View portfolio <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.slug}
                to="/portfolio/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-background">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {p.category} · {p.status}
                    </div>
                    <div className="mt-1 text-base font-medium text-foreground group-hover:text-accent">
                      {p.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{p.location}</div>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="container-x py-20 md:py-24">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Trusted by
        </div>
        <h2 className="mt-3 max-w-3xl text-2xl tracking-tight md:text-4xl">
          Government agencies, navy, oil & gas and private estates.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((c) => (
            <div
              key={c}
              className="flex min-h-20 items-center justify-center bg-background p-5 text-center text-xs font-medium text-muted-foreground"
            >
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground md:px-16 md:py-20">
          <div className="grid items-end gap-8 md:grid-cols-2">
            <h2 className="text-3xl tracking-tight md:text-5xl">
              Have a project? Let's talk specifications, timeline and budget.
            </h2>
            <div className="md:text-right">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
