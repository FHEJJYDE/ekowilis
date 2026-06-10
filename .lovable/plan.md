## EKOWILLS Logistics & Engineering — Website & Management System

Two-phase build for **Ekowills Logistics and Engineering Ltd** (RC 797482) — Nigerian civil engineering, equipment leasing & procurement company based in Enugu, est. 2003.

**Phase 1 (this build):** polished public website built from the company profile PDF. **Phase 2:** internal management system (projects, fleet, quotes, client portal, field workers).

---

### Phase 1 — Public Website

**Pages**
- **Home (`/`)** — Hero ("…engineering with style"), positioning (civil engineering, road construction, buildings, equipment leasing), stats (20+ years experience, since 2003, incorporated 2009), services preview, featured projects, notable clients strip, CTA "Request a quote".
- **About (`/about`)** — Company story, mission ("deliver creative, innovative space and building solutions…"), vision, board of directors (MD/CEO Engr. Itodo Williams Ejike, ED, 5 directors), key staff/HR table (16 people from the profile), organizational chart, head & branch office addresses.
- **Services (`/services`)** — Building Construction, Road Construction, Drainage Systems, Pond Construction, Ridges, Maintenance Services, Equipment & Vehicle Leasing, Procurement. Each as a card with description and example projects.
- **Portfolio (`/portfolio`)** — Featured projects from the PDF:
  - Construction of Male Hostel, Nigerian Navy Secondary School (NNSS), Umuopu, Igbo-Eze North, Enugu
  - Asphalted NNSS Umuopu Internal Roads with Drainage System
  - Construction of Dining/Galley at NNSS Umuopu
  - Green Smart Schools / Premier Primary School, Obollo-Eke, Udenu LGA
  - Zoo Estate Enugu — Internal Road Maintenance
  - Enugu State Ministry of Works & Infrastructure contract (2024)
  - Each project gets a detail page (`/portfolio/$slug`) with description, client, location, scope, gallery.
- **Equipment & Fleet (`/equipment`)** — Showcase of earth-moving equipment & vehicles available for own projects and for leasing (excavators, graders, rollers, tippers, etc.).
- **Clients (`/clients`)** — Logos/names strip + page listing key clients from the profile: Enugu State Govt, Rivers State Govt, Akwa Ibom State Govt, FERMA, NDDC, Agip Nigeria, Orascom-Tinapa, Prodeco Nigeria, Private Estate W.A., Wilson Nig, Ferotex Construction, Peace Mass Transit, ESHDC, ESUBEB, Nigerian Navy.
- **Credentials (`/credentials`)** — CAC Certificate of Incorporation (RC 797482, 26 Jan 2009), Tax Clearance (TCC 225189456945), FIRS TIN, NSITF ECS Clearance, PenCom Pension Clearance, BPP Registration, ITF Compliance. Builds trust for govt/corporate clients.
- **Contact (`/contact`)** — Head Office: 20 Edem Road, Nsukka, Enugu State. Branch: 50 Oloto Street, Odenigbo, Nsukka, Enugu State. Email: ekowilogs@gmail.com. Contact form + "Request a Quote" form (project type, location, scope, timeline, budget).
- **404** — Custom not-found page (already scaffolded).

**Design direction — modern & minimal**
- Editorial layout, generous whitespace, large imagery, strong type hierarchy.
- Palette: deep slate/charcoal as primary, off-white/warm-paper background, single warm accent (an industrial amber, not the typical safety yellow). All defined as semantic tokens in `src/styles.css` (oklch).
- Typography: modern sans pair suited to engineering/architecture (Urbanist + Epilogue, or similar).
- Subtle motion: fade/slide-up on scroll, hover lift on cards. No heavy animation.
- Imagery: use the project photos from the uploaded PDF (NNSS, Premier Primary School, Zoo Estate, equipment) as the portfolio source-of-truth, plus generated section/hero imagery where needed. PDF images uploaded as CDN assets.

**Tech**
- TanStack Start file-based routes — one file per section with distinct `head()` metadata (title, description, og:title, og:description, og:image per page where meaningful).
- Shared header (logo "EKOWILLS" + nav + "Request a quote" CTA) and footer (offices, services, clients, credentials, contact).
- Content stored in typed TS files under `src/content/` (`projects.ts`, `services.ts`, `equipment.ts`, `team.ts`, `clients.ts`) — easy to edit, easy to migrate to DB in Phase 2.
- `sitemap.xml` server route + `public/robots.txt`.
- Quote/contact form: client-side validation only in this build. Wiring to email/DB happens in Phase 2 (would require enabling Lovable Cloud).

---

### Phase 2 — Internal Management System (next build)

Outlined so the architecture stays consistent. Enables Lovable Cloud (auth, DB, storage, server functions).

- **Auth & roles** — Admin, Office Staff, Field Worker, Client. Roles in separate `user_roles` table with `has_role()` security-definer function.
- **Projects** — Create, assign team, milestones, progress photos, status timeline. Field workers update from mobile.
- **Equipment & vehicles** — Inventory, project assignment, maintenance log, availability calendar, leasing module.
- **Quotes & invoicing** — Templates, convert quote → invoice, payment tracking, PDF export.
- **CRM / client portal** — Clients log in to view their project status, documents, invoices, messaging.
- **Field worker view** — Mobile-first daily reports, site check-ins, photo uploads.
- **Admin dashboard** — KPIs, active projects, equipment utilization, outstanding invoices.

---

### Technical Notes

- Routes under `src/routes/`: `index.tsx`, `about.tsx`, `services.tsx`, `portfolio.tsx`, `portfolio.$slug.tsx`, `equipment.tsx`, `clients.tsx`, `credentials.tsx`, `contact.tsx`, `sitemap[.]xml.ts`.
- Design tokens in `src/styles.css` (oklch). No hardcoded color classes in components.
- shadcn Button/Card/Form/Input/Textarea extended with project variants (`hero`, `outline-dark`).
- Project photos extracted from the PDF uploaded as CDN assets via `lovable-assets`.
- Phase 1 does NOT enable Lovable Cloud — pure static public site.

---

### What I'll do in this build
1. Set up the design system (`src/styles.css`) — palette, typography, motion tokens.
2. Build shared `<SiteHeader />` and `<SiteFooter />`.
3. Extract & upload project photos from the PDF as CDN assets; generate any missing hero imagery.
4. Build all 9 public routes with real EKOWILLS content (board, team, projects, clients, credentials).
5. Add the quote-request form (client-side only).
6. Add `sitemap.xml` and `robots.txt`.

When ready for Phase 2, say "let's build the internal system" and I'll enable Lovable Cloud and start on the dashboard.
