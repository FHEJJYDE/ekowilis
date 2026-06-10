export type Equipment = {
  category: string;
  items: string[];
};

export const equipment: Equipment[] = [
  {
    category: "Earth-moving",
    items: ["Excavators", "Bulldozers", "Wheel loaders", "Backhoe loaders"],
  },
  {
    category: "Road construction",
    items: [
      "Motor graders",
      "Vibratory rollers",
      "Pneumatic tyred rollers",
      "Asphalt pavers",
      "Bitumen sprayers",
    ],
  },
  {
    category: "Haulage & logistics",
    items: ["Tipper trucks", "Lowbed trailers", "Water tankers", "Fuel bowsers"],
  },
  {
    category: "Concrete & site",
    items: ["Concrete mixers", "Vibrators", "Generators", "Welding plants"],
  },
];