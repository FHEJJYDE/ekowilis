export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
};

export const services: Service[] = [
  {
    slug: "road-construction",
    title: "Road Construction",
    short: "Asphalt roads, internal estate roads, rehabilitation & maintenance.",
    description:
      "Earthworks, sub-base, base course, asphalt wearing course and surface dressing for estate, institutional and public roads. Includes road rehabilitation and routine maintenance contracts.",
  },
  {
    slug: "drainage-systems",
    title: "Drainage Systems",
    short: "Reinforced concrete drains, culverts and storm-water channels.",
    description:
      "Design and construction of reinforced concrete drains, box culverts, line drains and storm-water management systems integrated with road and estate developments.",
  },
  {
    slug: "building-construction",
    title: "Building Construction",
    short: "Institutional, residential and commercial building works.",
    description:
      "Full-cycle building construction — substructure, superstructure, finishes and MEP coordination — for schools, hostels, offices and residential developments.",
  },
  {
    slug: "civil-works",
    title: "Bridges, Dams & Civil Works",
    short: "Heavy civil engineering for bridges, dams and pond construction.",
    description:
      "Heavy civil engineering capability covering small bridges, dams, pond construction and ridges — delivered with our own equipment fleet and experienced site teams.",
  },
  {
    slug: "equipment-leasing",
    title: "Equipment & Vehicle Leasing",
    short: "Earth-moving equipment and vehicles for hire.",
    description:
      "We lease our own earth-moving equipment and vehicles — excavators, graders, rollers, tippers and more — to contractors and project owners across Nigeria.",
  },
  {
    slug: "procurement",
    title: "Procurement",
    short: "Sourcing of construction materials, equipment and spares.",
    description:
      "Procurement of construction materials, equipment and genuine spare parts — leveraging our direct supply relationships to cut downtime and cost on every project.",
  },
  {
    slug: "maintenance",
    title: "Maintenance Services",
    short: "Routine and reactive maintenance for roads, drains and buildings.",
    description:
      "Scheduled and reactive maintenance for completed roads, drainage networks and buildings — keeping assets in service across their full life-cycle.",
  },
];