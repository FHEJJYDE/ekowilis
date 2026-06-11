import { supabase } from "@/integrations/supabase/client";

import nnssMaleHostel from "@/assets/nnss-male-hostel.jpg";
import nnssDining from "@/assets/nnss-dining.jpg";
import nnssInternalRoads from "@/assets/nnss-internal-roads.jpg";
import nnssAsphalt from "@/assets/nnss-asphalt-drainage.jpg";
import nnssSite from "@/assets/nnss-site.jpg";
import premierSchool from "@/assets/premier-school.jpg";
import zooEstate from "@/assets/zoo-estate-road.jpg";
import equipmentWorks from "@/assets/equipment-works.jpg";
import siteWork1 from "@/assets/site-work-1.jpg";
import siteWork2 from "@/assets/site-work-2.jpg";

export const projectImageFallback: Record<string, { cover: string; gallery: string[] }> = {
  "nnss-male-hostel": { cover: nnssMaleHostel, gallery: [nnssMaleHostel, nnssSite, siteWork1] },
  "nnss-internal-roads": { cover: nnssAsphalt, gallery: [nnssAsphalt, nnssInternalRoads, equipmentWorks] },
  "nnss-dining-galley": { cover: nnssDining, gallery: [nnssDining, nnssSite] },
  "premier-primary-school": { cover: premierSchool, gallery: [premierSchool, siteWork2] },
  "zoo-estate-road-maintenance": { cover: zooEstate, gallery: [zooEstate, siteWork1] },
  "ens-mowi-2024": { cover: equipmentWorks, gallery: [equipmentWorks, siteWork2] },
};

export const heroImageFallback = nnssAsphalt;
export const equipmentImageFallback = equipmentWorks;

export type DbCompany = {
  name: string; short_name: string; tagline: string; mission: string; vision: string; story: string;
  rc_number: string; founded_year: string; head_office: string; branch_office: string; email: string; phone: string;
};
export type DbHero = { eyebrow: string; title: string; subtitle: string; cta_label: string; cta_href: string; image_url: string };
export type DbService = { id: string; slug: string; title: string; summary: string; description: string; icon: string; order_index: number; is_published: boolean };
export type DbProject = { id: string; slug: string; title: string; client: string; location: string; category: string; status: string; year: string; summary: string; scope: string[]; cover_url: string; gallery: string[]; order_index: number; is_published: boolean };
export type DbTeamMember = { id: string; name: string; role: string; group_name: string; photo_url: string; order_index: number; is_published: boolean };
export type DbEquipment = { id: string; name: string; category: string; description: string; image_url: string; quantity: number; order_index: number; is_published: boolean };
export type DbClient = { id: string; name: string; sector: string; logo_url: string; order_index: number; is_published: boolean };
export type DbCredential = { id: string; title: string; reference: string; issuer: string; year: string; document_url: string; order_index: number; is_published: boolean };

export const defaultCompany: DbCompany = {
  name: "Ekowills Logistics & Engineering Ltd",
  short_name: "EKOWILLS",
  tagline: "Engineering with style.",
  mission: "", vision: "", story: "",
  rc_number: "RC 797482",
  founded_year: "2003",
  head_office: "20 Edem Road, Nsukka, Enugu State",
  branch_office: "50 Oloto Street, Odenigbo, Nsukka, Enugu State",
  email: "ekowilogs@gmail.com",
  phone: "",
};

export const defaultHero: DbHero = {
  eyebrow: "Civil engineering · Since 2003",
  title: "Roads, drainage and buildings — engineering with style.",
  subtitle: "EKOWILLS delivers civil works, building construction and equipment leasing for public and private clients across Nigeria.",
  cta_label: "Request a quote",
  cta_href: "/contact",
  image_url: "",
};

export async function fetchCompany(): Promise<DbCompany> {
  const { data } = await supabase.from("company_info").select("*").eq("id", 1).maybeSingle();
  return (data as unknown as DbCompany) ?? defaultCompany;
}
export async function fetchHero(): Promise<DbHero> {
  const { data } = await supabase.from("hero").select("*").eq("id", 1).maybeSingle();
  return (data as unknown as DbHero) ?? defaultHero;
}
export async function fetchPublished<T>(table: string): Promise<T[]> {
  const { data } = await supabase
    .from(table as any)
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });
  return (data as unknown as T[]) ?? [];
}

export function projectCover(p: Pick<DbProject, "slug" | "cover_url">) {
  return p.cover_url || projectImageFallback[p.slug]?.cover || heroImageFallback;
}
export function projectGallery(p: Pick<DbProject, "slug" | "gallery" | "cover_url">) {
  const arr = (p.gallery ?? []).filter(Boolean);
  if (arr.length) return arr;
  return projectImageFallback[p.slug]?.gallery ?? [projectCover(p)];
}
