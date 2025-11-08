// src/data/CurrentAffairsSubcategories.js
// Sample data for Current Affairs categories → subcategories.
// Replace logos, titles, and counts with your real data.

const CurrentAffairsSubcategories = {
  // top-level categories shown on /currentaffairs
  categories: [
    { key: "upsc", title: "UPSC", hero: "/images/upsc.png", logo: "/images/upsc.png" },
    { key: "cgl", title: "SSC CGL", hero: "/images/cgl.png", logo: "/images/cgl.png" },
    { key: "chsl", title: "CHSL", hero: "/images/chsl-hero.png", logo: "/images/chsl.png" },
    { key: "ibps", title: "IBPS", hero: "/images/ibps-hero.png", logo: "/images/ibps.png" },
    { key: "railways", title: "Railways", hero: "/images/railway-hero.png", logo: "/images/railway.png" },
    // add more categories...
  ],

  // per-category subcategories:
  subcategories: {
    upsc: {
      title: "UPSC",
      hero: "/images/upsc.png",
      tiles: [
        { id: "ias", title: "IAS EXAM", logo: "/images/sub/ias.png", description: "Policy, Governance & Administration", path: "/currentaffairs/upsc/ias", count: 120 },
        { id: "ips", title: "IPS", logo: "/images/gpsc.png", description: "Law & Order", path: "/currentaffairs/upsc/ips", count: 68 },
        { id: "ifs", title: "IFS", logo: "/images/sub/ifs.png", description: "Foreign Affairs", path: "/currentaffairs/upsc/ifs", count: 34 },
      ],
    },

    cgl: {
      title: "SSC CGL",
      hero: "/images/cgl.png",
      tiles: [
        { id: "general", title: "CGL", logo: "/images/sub/gpsc.png", description: "National & International", path: "/currentaffairs/cgl/general", count: 200 },
        { id: "economy", title: "CGL 2", logo: "/images/sub/ifs.png", description: "Economic updates", path: "/currentaffairs/cgl/economy", count: 54 },
      ],
    },

    // fallback for categories without defined subcategories
    others: {
      title: "Others",
      hero: "/images/default-hero.png",
      tiles: [],
    },
  },
};

export default CurrentAffairsSubcategories;
