// src/data/publications.js
// Structure:
// {
//   upsc: {
//     title: "UPSC",
//     hero: "/images/upsc-hero.png",
//     subtitle: "...",
//     latest: [{ title, href }, ...],
//     subcategories: {
//       gpsc: {
//         title: "GPSC",
//         logo: "/images/gpsc.png",
//         description: "GPSC previous papers and keys",
//         papers: [
//           {
//             id: "gpsc-2023-1",
//             title: "AP SI Prelims Exam Paper-2 (Held on 19.02.2023)",
//             publishedDate: "19 Feb 2023",
//             format: "PDF",
//             pdfUrl: "/pdfs/gpsc-2023-paper2.pdf"
//           },
//           // ... more papers
//         ]
//       },
//       ias: {
//         title: "IAS Exam",
//         logo: "/images/ias.png",
//         description: "IAS papers and resources",
//         papers: [ /* ... */ ]
//       }
//     }
//   },
//   // other top-level categories...
// }

const PUBLICATIONS = {
  upsc: {
    title: "UPSC",
    hero: "/images/upsc.png",
    subtitle: "Previous papers, official keys and downloads for UPSC.",
    latest: [
      { title: "SLPRB AP Police Constable Final Written Exam 2025 on June 1", href: "#" },
      { title: "Another news item", href: "#" },
    ],
    subcategories: {
      gpsc: {
        title: "GPSC",
        logo: "/images/gpsc.png",
        description: "GPSC previous question papers and official keys.",
        papers: [
          {
            id: "gpsc-2023-1",
            title: "AP SI Prelims Exam Paper-2 (Held on 19.02.2023)",
            publishedDate: "19 Feb 2023",
            format: "PDF",
            pdfUrl: "/pdfs/AP-SI-Prelims-Paper2-2023.pdf",
          },
          {
            id: "gpsc-2022-1",
            title: "GPSC Prelims 2022 - Paper 1",
            publishedDate: "12 Jan 2022",
            format: "PDF",
            pdfUrl: "/pdfs/GPSC-Prelims-2022-paper1.pdf",
          },
        ],
      },
      ias: {
        title: "IAS Exam",
        logo: "/images/ias.png",
        description: "IAS exam previous papers",
        papers: [
          {
            id: "ias-2021-1",
            title: "IAS Prelims 2021 - Paper A",
            publishedDate: "10 Mar 2021",
            format: "PDF",
            pdfUrl: "/pdfs/IAS-Prelims-2021-A.pdf",
          },
        ],
      },
    },
  },

  // add other categories the same way
  others: {
    title: "Other Exams",
    hero: "/images/others-hero.png",
    subtitle: "Other exam papers",
    latest: [],
    subcategories: {},
  },
};

export default PUBLICATIONS;
