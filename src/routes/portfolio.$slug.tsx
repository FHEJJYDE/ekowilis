import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { projects } from "@/content/projects";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — EKOWILLS" }] };
    return {
      meta: [
        { title: `${p.title} — EKOWILLS` },
        { name: "description", content: p.summary },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.summary },
        { property: "og:image", content: p.cover },
      ],
    };
  },
  component: ProjectPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-32 text-center">
        <h1 className="text-4xl tracking-tight">Project not found</h1>
        <Link to="/portfolio" className="mt-6 inline-block text-accent">
          ← Back to portfolio
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="container-x py-32 text-center">
        <h1 className="text-3xl tracking-tight">Couldn't load this project</h1>
        <button onClick={reset} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
          Try again
        </button>
      </div>
    </SiteLayout>
  ),
});

function ProjectPage() {
  const { project: p } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-x py-14">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <div className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {p.category} · {p.status} · {p.year}
          </div>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {p.title}
          </h1>
          <div className="mt-6 grid gap-6 text-sm md:grid-cols-3">
            <div>
              <div className="uppercase tracking-[0.16em] text-muted-foreground">Client</div>
              <div className="mt-1 text-foreground">{p.client}</div>
            </div>
            <div>
              <div className="uppercase tracking-[0.16em] text-muted-foreground">Location</div>
              <div className="mt-1 text-foreground">{p.location}</div>
            </div>
            <div>
              <div className="uppercase tracking-[0.16em] text-muted-foreground">Year</div>
              <div className="mt-1 text-foreground">{p.year}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-secondary">
          <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>{p.summary}</p>
          </div>
          <aside>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-accent">Scope</div>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                {p.scope.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-accent">·</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {p.gallery.length > 1 && (
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {p.gallery.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary">
                <img src={img} alt={`${p.title} — ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}