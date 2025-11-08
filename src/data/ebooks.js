// src/data/ebooks.js
// Central data for E-Books flow: categories -> subcategories -> books

const EBOOKS_DATA = {
  categories: [
    { key: "upsc", title: "UPSC", logo: "/images/upsc.png", hero: "/images/upsc.png" },
    { key: "cgl", title: "SSC CGL", logo: "/images/cgl.png", hero: "/images/cgl.png" },
    { key: "chsl", title: "SSC CHSL", logo: "/images/chsl.png", hero: "/images/chsl.png" },
    { key: "appsc", title: "APPSC", logo: "/images/appsc.png", hero: "/images/appsc.png" },
    { key: "tspsc", title: "TSPSC", logo: "/images/tspsc.png", hero: "/images/tspsc.png" },
    { key: "appolice", title: "AP POLICE SI", logo: "/images/appolice.png", hero: "/images/appolice.png" },
    { key: "tspolice", title: "TS POLICE SI", logo: "/images/tspolice.png", hero: "/images/tspolice.png" },
    { key: "sbi", title: "State Bank of India PO", logo: "/images/sbi.png", hero: "/imagessbi.png" },
    { key: "ibps", title: "IBPS", logo: "/images/ibps.png", hero: "/images/ibps.png" },
    { key: "railways", title: "Railways", logo: "/images/railway.png", hero: "/images/railway.png" },
    { key: "others", title: "OTHERS…", logo: "/images/brainbuzz.png", hero: "/images/brainbuzz.png" },
  ],

  // subcategories keyed by category
  subcategories: {
    upsc: [
      {
        id: "foundation",
        title: "Foundation",
        logo: "/images/upsc.png",
        path: "/ebooks/upsc/foundation",
        books: [
          {
            id: "ias-gs-foundation-1",
            title: "IAS GS Foundation Basics",
            thumb: "/images/default-book.png",
            pdfUrl: "/pdfs/upsc-prelims-2024-paper1.pdf",
            validity: "NA",
            medium: "Eng",
            tag: "E-Book",
          },
          {
            id: "ias-gs-foundation-2",
            title: "IAS GS Foundation Basics - Vol II",
            thumb:  "/images/default-book.png",
            pdfUrl: "/pdfs/upsc-prelims-2024-paper1.pdf",
            validity: "NA",
            medium: "Eng",
            tag: "E-Book",
          },
        ],
      },
      {
        id: "prelims",
        title: "Prelims",
        logo:  "/images/upsc.png",
        path: "/ebooks/upsc/prelims",
        books: [
          {
            id: "upsc-prelims-2023-key",
            title: "UPSC Prelims 2023 - Official Key",
            thumb:  "/images/upsc.png",
            pdfUrl: "/pdfs/upsc-prelims-2024-paper1.pdf",
            validity: "NA",
            medium: "Eng",
            tag: "E-Book",
          },
        ],
      },
      {
        id: "mains",
        title: "Mains",
        logo:  "/images/upsc.png",
        path: "/ebooks/upsc/mains",
        books: [
          {
            id: "upsc-mains-2023-essay",
            title: "UPSC Mains 2023 – Essay Paper (Solved)",
            thumb:  "/images/upsc.png",
            pdfUrl: "/pdfs/upsc-prelims-2024-paper1.pdf",
            validity: "NA",
            medium: "Eng",
            tag: "E-Book",
          },
        ],
      },
    ],

    cgl: [
      {
        id: "tier1",
        title: "Tier I",
        logo: "/images/cgl.png" ,
        path: "/ebooks/cgl/tier1",
        books: [
          {
            id: "cgl-tier1-2023",
            title: "SSC CGL Tier I 2023 - Solved",
            thumb: "/images/cgl.png" ,
            pdfUrl: "/pdfs/cgl-tier1-2023.pdf",
            validity: "NA",
            medium: "Eng",
            tag: "E-Book",
          },
        ],
      },
    ],

    chsl: [
      {
        id: "tier1",
        title: "Tier I",
        logo: "/images/sub/chsl1.png",
        path: "/ebooks/chsl/tier1",
        books: [],
      },
    ],

    appsc: [
      { id: "group1", title: "Group I", logo: "/images/sub/group1.png", path: "/ebooks/appsc/group1", books: [] },
      { id: "group2", title: "Group II", logo: "/images/sub/group2.png", path: "/ebooks/appsc/group2", books: [] },
    ],

    tspsc: [
      { id: "group1", title: "Group I", logo: "/images/sub/tsgroup1.png", path: "/ebooks/tspsc/group1", books: [] },
    ],

    appolice: [
      { id: "si", title: "AP Police SI", logo: "/images/sub/appolice.png", path: "/ebooks/appolice/si", books: [] },
    ],

    tspolice: [
      { id: "si", title: "TS Police SI", logo: "/images/sub/tspolice.png", path: "/ebooks/tspolice/si", books: [] },
    ],

    sbi: [
      { id: "po", title: "SBI PO", logo: "/images/sub/sbi.png", path: "/ebooks/sbi/po", books: [] },
    ],

    ibps: [
      { id: "po", title: "IBPS PO", logo: "/images/sub/ibps.png", path: "/ebooks/ibps/po", books: [] },
    ],

    railways: [
      { id: "rrb", title: "RRB NTPC", logo: "/images/sub/rrb.png", path: "/ebooks/railways/rrb", books: [] },
    ],

    others: [
      { id: "magazine", title: "Magazine", logo: "/images/sub/magazine.png", path: "/ebooks/others/magazine", books: [] },
    ],
  },
};

export default EBOOKS_DATA;
