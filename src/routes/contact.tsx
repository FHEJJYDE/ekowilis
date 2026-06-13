import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, CheckCircle2 } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site-layout";
import { company } from "@/content/company";
import { services } from "@/content/services";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Request a Quote — EKOWILLS" },
      {
        name: "description",
        content:
          "Get in touch with EKOWILLS Logistics & Engineering Ltd. Head office: 20 Edem Road, Nsukka, Enugu State. Email: ekowilogs@gmail.com.",
      },
      { property: "og:title", content: "Contact EKOWILLS" },
      {
        property: "og:description",
        content: "Request a civil engineering, road or equipment leasing quote.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      project_type: String(fd.get("service") || ""),
      location: String(fd.get("location") || ""),
      message: String(fd.get("message") || ""),
    };
    const { error: err } = await supabase.from("quote_submissions").insert(payload);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSubmitted(true);
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your project."
        description="Share the scope, location and timeline — we'll respond with next steps and a clear quote."
      />

      <section className="container-x grid gap-12 py-20 md:grid-cols-5">
        <div className="md:col-span-3">
          {submitted ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-4 text-2xl tracking-tight text-foreground">Thanks — we've got it.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team will be in touch from {company.email}. For urgent
                enquiries, email us directly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Company / organization" name="org" />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
              </div>

              <div>
                <Label>Service required</Label>
                <select
                  name="service"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <Field label="Project location" name="location" placeholder="State / city / site" />

              <div>
                <Label>Project details</Label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Scope, timeline, budget — anything that helps us scope a quote."
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 md:w-auto"
              >
                {submitting ? "Sending…" : "Submit request"}
              </button>
              <p className="text-xs text-muted-foreground">
                We respond within 1–2 business days.
              </p>
            </form>
          )}
        </div>

        <aside className="md:col-span-2 space-y-6">
          <InfoCard icon={<MapPin className="h-5 w-5" />} title="Head office">
            {company.headOffice}
          </InfoCard>
          <InfoCard icon={<MapPin className="h-5 w-5" />} title="Branch office">
            {company.branchOffice}
          </InfoCard>
          <InfoCard icon={<Mail className="h-5 w-5" />} title="Email">
            <a href={`mailto:${company.email}`} className="text-foreground hover:text-accent">
              {company.email}
            </a>
          </InfoCard>
          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
            <div className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
              Registered
            </div>
            <div className="mt-2 text-sm">
              {company.name} · {company.rc}
            </div>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 text-accent">
          {icon}
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</div>
      </div>
      <div className="mt-3 text-sm text-foreground">{children}</div>
    </div>
  );
}