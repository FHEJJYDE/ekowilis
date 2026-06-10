import { Link } from "@tanstack/react-router";
import { company } from "@/content/company";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-xl font-bold tracking-tight">{company.shortName}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
            Logistics & Engineering Ltd · {company.rc}
          </div>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/70">
            {company.tagline} Civil engineering, road construction, drainage and
            building works across Nigeria since {company.founded}.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About"],
              ["/services", "Services"],
              ["/portfolio", "Portfolio"],
              ["/equipment", "Equipment"],
              ["/clients", "Clients"],
              ["/credentials", "Credentials"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-primary-foreground/80 hover:text-primary-foreground">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
            Contact
          </div>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <span className="block text-primary-foreground/50">Head office</span>
              {company.headOffice}
            </li>
            <li>
              <span className="block text-primary-foreground/50">Branch office</span>
              {company.branchOffice}
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-primary-foreground">
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <span>Safety · Quality · Production — Building · Roads · Drainages</span>
        </div>
      </div>
    </footer>
  );
}