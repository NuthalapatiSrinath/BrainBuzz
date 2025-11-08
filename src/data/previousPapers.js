// src/data/previousPapers.js
// Central data for Previous Question Papers flow: exams -> subcategories -> papers

const PREVIOUS_PAPERS = {
  // UPSC
  upsc: {
    title: "UPSC",
    hero: "/images/upsc.png",
    logo: "/images/upsc.png",
    subcategories: {
      prelims: {
        title: "Prelims Papers",
        logo: "/images/upsc.png",
        description: "Solved prelims and official answer keys.",
        papers: [
          {
            id: "upsc-prelims-2024",
            title: "UPSC Prelims 2024 - Paper 1 (GS)",
            year: "2024",
            pdfUrl: "/pdfs/upsc-prelims-2024-paper1.pdf",
            thumb: "/images/defaultthumb.png",
          },
          {
            id: "upsc-prelims-2023",
            title: "UPSC Prelims 2023 - Paper 1 (GS)",
            year: "2023",
            pdfUrl: "/pdfs/upsc-prelims-2024-paper1.pdf",
            thumb:  "/images/defaultthumb.png",
          },
        ],
      },
      mains: {
        title: "Mains Papers",
        logo: "/images/upsc.png",
        description: "Descriptive mains question papers.",
        papers: [
          {
            id: "upsc-mains-2023-essay",
            title: "UPSC Mains 2023 - Essay Paper",
            year: "2023",
            pdfUrl:"/pdfs/upsc-prelims-2024-paper1.pdf",
            thumb: "/images/defaultthumb.png",
          },
        ],
      },
    },
  },

  // SSC CGL
  cgl: {
    title: "SSC CGL",
    hero: "/images/cgl.png",
    logo: "/images/cgl.png",
    subcategories: {
      tier1: {
        title: "Tier I Papers",
        logo: "/images/sub/cgl1.png",
        papers: [
          {
            id: "cgl-tier1-2023",
            title: "SSC CGL Tier I 2023",
            year: "2023",
            pdfUrl: "/pdfs/cgl-tier1-2023.pdf",
            thumb:  "/images/defaultthumb.png",
          },
        ],
      },
      tier2: {
        title: "Tier II Papers",
        logo: "/images/sub/cgl2.png",
        papers: [],
      },
    },
  },

  chsl: {
    title: "SSC CHSL",
    hero: "/images/chsl.png",
    logo: "/images/chsl.png",
    subcategories: {
      tier1: {
        title: "Tier I Papers",
        logo: "/images/sub/chsl1.png",
        papers: [],
      },
    },
  },

  banking: {
    title: "Banking",
    hero: "/images/sbi.png",
    logo: "/images/sbi.png",
    subcategories: {
      sbi: {
        title: "SBI PO Papers",
        logo: "/images/sub/sbi.png",
        papers: [
          {
            id: "sbi-po-2022",
            title: "SBI PO 2022 - Paper",
            year: "2022",
            pdfUrl: "/pdfs/sbi-po-2022.pdf",
            thumb: "/images/papers/sbi-po-2022.jpg",
          },
        ],
      },
      ibps: {
        title: "IBPS PO Papers",
        logo: "/images/sub/ibps.png",
        papers: [],
      },
    },
  },

  railways: {
    title: "Railways",
    hero: "/images/railway.png",
    logo: "/images/railway.png",
    subcategories: {
      rrb: {
        title: "RRB NTPC Papers",
        logo: "/images/sub/rrb.png",
        papers: [],
      },
    },
  },

  // Others placeholder
  others: {
    title: "Others",
    hero: "/images/brainbuzz.png",
    logo: "/images/brainbuzz.png",
    subcategories: {},
  },
};

export default PREVIOUS_PAPERS;
