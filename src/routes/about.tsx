import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { company } from "@/content/company";
import { board, humanResources } from "@/content/team";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EKOWILLS Logistics & Engineering Ltd" },
      {
        name: "description",
        content:
          "Nigerian civil engineering company based in Enugu. Founded 2003, incorporated 2009. Mission, vision, board of directors and engineering team.",
      },
      { property: "og:title", content: "About EKOWILLS Logistics & Engineering" },
      {
        property: "og:description",
        content:
          "Civil engineering, roads, drainage, buildings and equipment leasing — based in Enugu, Nigeria.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title="A Nigerian civil engineering company, building since 2003."
        description="EKOWILLS Logistics and Engineering Ltd started as direct-labour civil engineering contractors in 2003, and was incorporated as a corporate civil engineering and logistics company in 2009 (RC 797482). Headquartered in Nsukka, Enugu State."
      />

      {/* Story */}
      <section className="container-x grid gap-12 py-20 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            We provide services in a manner that conforms to contractual and
            regulatory requirements — using qualified, trained and experienced
            personnel together with our own fleet of equipment.
          </p>
          <p>
            Our expertise spans road construction, building works, vehicle and
            equipment leasing and broader civil engineering. Because we are the
            direct owners of the equipment and spare parts used on our projects,
            our jobs are excellent and fast — we cut downtime where others can't.
          </p>
          <p>
            Since incorporation, we have rendered services to clients including
            the Enugu, Rivers and Akwa Ibom State Governments, FERMA, NDDC, Agip
            Nigeria, Orascom–Tinapa, Prodeco, Wilson Nig, Ferotex, Peace Mass
            Transit, ESHDC, ESUBEB and the Nigerian Navy.
          </p>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
              Our mission
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {company.mission}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-accent">
              Our vision
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {company.vision}
            </p>
          </div>
        </aside>
      </section>

      {/* Board */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container-x py-20">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Leadership
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl tracking-tight md:text-4xl">
            Board of directors.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {board.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-background p-6">
                <div className="text-base font-semibold text-foreground">{m.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HR */}
      <section className="container-x py-20">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Our people
        </div>
        <h2 className="mt-3 max-w-2xl text-3xl tracking-tight md:text-4xl">
          Engineers, surveyors and site teams.
        </h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {humanResources.map((p, i) => (
                <tr
                  key={p.name}
                  className={i % 2 === 0 ? "bg-background" : "bg-secondary/50"}
                >
                  <td className="px-6 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Org chart */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="container-x py-20">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            How we're organized
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl tracking-tight md:text-4xl">
            Organizational chart.
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 text-sm">
            {[
              ["Board"],
              ["CEO"],
              ["Commercial, Planning, Procurement", "Administration & Accounts"],
              ["Project Manager / Site Engineer", "Project Manager / Site Engineer"],
              ["Trade Supervisor", "Trade Supervisor"],
              ["Operatives", "Operatives", "Operatives", "Operatives"],
            ].map((row, i) => (
              <div key={i} className="flex flex-wrap items-center justify-center gap-3">
                {row.map((cell) => (
                  <div
                    key={cell}
                    className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 text-center"
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}