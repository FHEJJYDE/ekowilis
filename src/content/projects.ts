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

export type ProjectVideo = {
  url: string;
  title: string;
  thumbnail?: string;
};

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
  videos?: ProjectVideo[];
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
    gallery: [
      nnssMaleHostel,
      nnssSite,
      siteWork1,
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.18.36.jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.27.jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.27 (1).jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.28.jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.29.jpeg",
    ],
    videos: [
      {
        url: "/NNSS-UMOPU/WhatsApp Video 2026-07-05 at 15.19.19.mp4",
        title: "Hostel Site & Drainage Construction Overview",
      },
    ],
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
    gallery: [
      nnssAsphalt,
      nnssInternalRoads,
      equipmentWorks,
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.18.36.jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.27.jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.27 (1).jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.28.jpeg",
      "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.29.jpeg",
    ],
    videos: [
      {
        url: "/NNSS-UMOPU/WhatsApp Video 2026-07-05 at 15.19.19.mp4",
        title: "Asphalt Road and Drainage Inspection",
      },
    ],
  },
  {
    slug: "Wilson-Arab-Yard-Nsukka",
    title: "Wilson Arab Yard Nsukka",
    client: "Nigerian Navy",
    location: "Wilson Arab Yard Nsukka",
    category: "Buildings",
    status: "Ongoing",
    year: "2025",
    summary:
      "Wilson Arab Yard Nsukka construction and site development.",
    scope: [
      "Reinforced concrete frame and roof",
      "Kitchen and galley fit-out civils",
      "Finishes, services and external works",
    ],
    cover: nnssDining,
    gallery: [
      nnssDining,
      nnssSite,
      "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.02.jpeg",
      "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.03.jpeg",
      "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.05.jpeg",
      "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.06.jpeg",
    ],
  },
  {
    slug: "Internal-roads-of-Donald-Place-GRA-Nsukk",
    title: "Internal roads of Donald Place GRA Nsukka",
    client: "Donald Place",
    location: "Obollo-Eke, Udenu LGA, Enugu State",
    category: "Buildings",
    status: "Ongoing",
    year: "2025",
    summary:
      "Construction of Internal roads of Donald Place GRA Nsukk.",
    scope: [
      "Foundation and superstructure",
      "Classroom and admin blocks",
      "Finishes and external works",
    ],
    cover: premierSchool,
    gallery: [premierSchool, siteWork2],
  },
  {
    slug: "Access-Road-to-Ichi",
    title: "Access Road to Ichi",
    client: "Ichi, Enugu",
    location: "Enugu, Enugu State",
    category: "Maintenance",
    status: "Completed",
    year: "2023",
    summary:
      "Maintenance and resurfacing of internal road to Ichi, Enugu — restoring trafficability and drainage performance across the estate network.",
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