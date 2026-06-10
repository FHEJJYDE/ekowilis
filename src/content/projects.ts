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

export type Project = {
  slug: string;
  title: string;
  client: string;
  location: string;
  category: "Roads" | "Buildings" | "Drainage" | "Maintenance";
  status: "Completed" | "Ongoing";
  year: string;
  summary: string;
  scope: string[];
  cover: string;
  gallery: string[];
};

export const projects: Project[] = [
  {
    slug: "nnss-male-hostel",
    title: "Male Hostel — Nigerian Navy Secondary School",
    client: "Nigerian Navy",
    location: "NNSS Umuopu, Igbo-Eze North, Enugu State",
    category: "Buildings",
    status: "Completed",
    year: "2024–2025",
    summary:
      "Design and construction of a male hostel block at the Nigerian Navy Secondary School, Umuopu — delivered under a Naval Headquarters contract with milestone-based payment and a six-month retention period.",
    scope: [
      "Substructure and reinforced concrete frame",
      "Block-work, plastering and finishes",
      "Roof, doors, windows and joinery",
      "Plumbing, electrical and external works",
    ],
    cover: nnssMaleHostel,
    gallery: [nnssMaleHostel, nnssSite, siteWork1],
  },
  {
    slug: "nnss-internal-roads",
    title: "Asphalted Internal Roads with Drainage — NNSS Umuopu",
    client: "Nigerian Navy",
    location: "NNSS Umuopu, Igbo-Eze North, Enugu State",
    category: "Roads",
    status: "Completed",
    year: "2024",
    summary:
      "Construction of asphalted internal roads with a reinforced concrete drainage system serving the Nigerian Navy Secondary School campus at Umuopu.",
    scope: [
      "Site clearance and earthworks",
      "Sub-base and base course",
      "Asphalt wearing course",
      "Reinforced concrete drainage and culverts",
    ],
    cover: nnssAsphalt,
    gallery: [nnssAsphalt, nnssInternalRoads, equipmentWorks],
  },
  {
    slug: "nnss-dining-galley",
    title: "Dining / Galley Construction — NNSS Umuopu",
    client: "Nigerian Navy",
    location: "NNSS Umuopu, Igbo-Eze North, Enugu State",
    category: "Buildings",
    status: "Ongoing",
    year: "2025",
    summary:
      "Ongoing construction of a dining hall and galley block serving the Nigerian Navy Secondary School community at Umuopu.",
    scope: [
      "Reinforced concrete frame and roof",
      "Kitchen and galley fit-out civils",
      "Finishes, services and external works",
    ],
    cover: nnssDining,
    gallery: [nnssDining, nnssSite],
  },
  {
    slug: "premier-primary-school",
    title: "Green Smart Schools — Premier Primary School",
    client: "Green Smart Schools",
    location: "Obollo-Eke, Udenu LGA, Enugu State",
    category: "Buildings",
    status: "Ongoing",
    year: "2025",
    summary:
      "Ongoing construction of classroom blocks and ancillary buildings for the Premier Primary School under the Green Smart Schools initiative.",
    scope: [
      "Foundation and superstructure",
      "Classroom and admin blocks",
      "Finishes and external works",
    ],
    cover: premierSchool,
    gallery: [premierSchool, siteWork2],
  },
  {
    slug: "zoo-estate-road-maintenance",
    title: "Internal Road Maintenance — Zoo Estate",
    client: "Zoo Estate, Enugu",
    location: "Enugu, Enugu State",
    category: "Maintenance",
    status: "Completed",
    year: "2023",
    summary:
      "Maintenance and resurfacing of internal roads within Zoo Estate, Enugu — restoring trafficability and drainage performance across the estate network.",
    scope: [
      "Pothole repair and patching",
      "Drainage cleaning and minor reconstruction",
      "Surface dressing",
    ],
    cover: zooEstate,
    gallery: [zooEstate, siteWork1],
  },
  {
    slug: "ens-mowi-2024",
    title: "Enugu State Ministry of Works Contract — 2024",
    client: "Enugu State Ministry of Works & Infrastructure",
    location: "Enugu State",
    category: "Roads",
    status: "Ongoing",
    year: "2024",
    summary:
      "Civil works contract awarded by the Enugu State Government, Ministry of Works & Infrastructure under offer letter ENS/MOW&I/PRS/S.R.1/VOL.X/229 dated 30 September 2024.",
    scope: [
      "Road and drainage works as per contract scope",
      "Compliance with Enugu State Standard Contract Agreement",
    ],
    cover: equipmentWorks,
    gallery: [equipmentWorks, siteWork2],
  },
];