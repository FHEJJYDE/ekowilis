import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { credentials } from "@/content/credentials";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials & Compliance — EKOWILLS" },
      {
        name: "description",
        content:
          "CAC incorporation (RC 797482), FIRS tax clearance, NSITF, PenCom, BPP and ITF compliance — EKOWILLS' regulatory credentials at a glance.",
      },
      { property: "og:title", content: "EKOWILLS — Credentials & Compliance" },
      {
        property: "og:description",
        content: "Statutory compliance across CAC, FIRS, NSITF, PenCom, BPP and ITF.",
      },
    ],
  }),
  component: CredentialsPage,
});

function CredentialsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Credentials"
        title="Statutory compliance and registrations."
        description="EKOWILLS Logistics & Engineering Ltd is fully registered and compliant with the Nigerian regulatory framework — ready to bid and deliver on public-sector and private contracts."
      />

      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {credentials.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-foreground">{c.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{c.issuer}</div>
                  {c.reference && (
                    <div className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {c.reference}
                    </div>
                  )}
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-foreground">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
          Copies of certificates are available on request as part of any tender
          or due-diligence package.
        </p>
      </section>
    </SiteLayout>
  );
}