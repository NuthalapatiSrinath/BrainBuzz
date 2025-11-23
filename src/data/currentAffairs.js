// src/data/currentAffairs.js
// Full sample data for Current Affairs (12 categories).
// Ensure referenced images exist under /public/images (e.g. worldcup.png, lion.png, etc.)

const CURRENT_AFFAIRS = {
  categories: [
    {
      key: "upsc",
      title: "UPSC",
      hero: "/images/upsc.png",
      logo: "/images/upsc.png",
    },
    {
      key: "cgl",
      title: "SSC CGL",
      hero: "/images/cgl.png",
      logo: "/images/cgl.png",
    },
    {
      key: "ssc",
      title: "SSC",
      hero: "/images/ssc.png",
      logo: "/images/ssc.png",
    },
    {
      key: "appsc",
      title: "APPSC",
      hero: "/images/appsc.png",
      logo: "/images/appsc.png",
    },
    {
      key: "banking",
      title: "Banking",
      hero: "/images/banking-hero.png",
      logo: "/images/banking.png",
    },
    {
      key: "state",
      title: "State News",
      hero: "/images/state-hero.png",
      logo: "/images/state.png",
    },
    {
      key: "international",
      title: "International",
      hero: "/images/international-hero.png",
      logo: "/images/international.png",
    },
    {
      key: "books",
      title: "Books & Authors",
      hero: "/images/books-hero.png",
      logo: "/images/books.png",
    },
    {
      key: "sports",
      title: "Sports",
      hero: "/images/sports-hero.png",
      logo: "/images/sports.png",
    },
    {
      key: "awards",
      title: "Awards",
      hero: "/images/awards-hero.png",
      logo: "/images/awards.png",
    },
    {
      key: "economy",
      title: "Economy",
      hero: "/images/economy-hero.png",
      logo: "/images/economy.png",
    },
    {
      key: "science",
      title: "Science & Tech",
      hero: "/images/science-hero.png",
      logo: "/images/science.png",
    },
  ],

  subcategories: {
    /* ===== UPSC ===== */
    upsc: [
      {
        id: "ias",
        title: "IAS EXAM",
        hero: "/images/ias-hero.png",
        articles: [
          {
            id: "upsc-a1",
            title: "Ladakh Protests over Statehood Demand",
            excerpt:
              "Protests in Ladakh demanding statehood intensified after local calls ...",
            image: "/images/worldcup.png",
            date: "2025-09-25T09:00:00Z",
            scope: "State",
            body: "<p>Full article text for Ladakh protests...</p>",
          },
          {
            id: "upsc-a2",
            title: "Mission Sudarshan Chakra",
            excerpt:
              "The government launched Mission Sudarshan Chakra to modernize ...",
            image: "/images/worldcup.png",
            date: "2025-09-20T10:00:00Z",
            scope: "National",
          },
          {
            id: "upsc-a3",
            title: "2025 India–Pakistan Conflict / Operation Sindoor",
            excerpt: "Tensions rose following cross-border incidents ...",
            image: "/images/worldcup.png",
            date: "2025-08-12T10:00:00Z",
            scope: "International",
          },
          {
            id: "upsc-a4",
            title: "2025 Vice Presidential Election in India",
            excerpt:
              "A timeline and candidate summary for the 2025 VP election ...",
            image: "/images/worldcup.png",
            date: "2025-07-08T10:00:00Z",
            scope: "National",
          },
        ],
      },
    ],

    /* ===== SSC CGL ===== */
    cgl: [
      {
        id: "general",
        title: "General Current Affairs",
        hero: "/images/general-hero.png",
        articles: [
          {
            id: "cgl-a1",
            title: "Economic update – Q2 report",
            excerpt: "Q2 GDP numbers show a mixed recovery in core sectors...",
            image: "/images/worldcup.png",
            date: "2025-09-20T10:00:00Z",
            scope: "National",
          },
          {
            id: "cgl-a2",
            title: "National Education Policy updates",
            excerpt:
              "New guidelines for higher education have been proposed ...",
            image: "/images/worldcup.png",
            date: "2025-06-19T10:00:00Z",
            scope: "National",
          },
        ],
      },
    ],

    /* ===== SSC ===== */
    ssc: [
      {
        id: "general",
        title: "SSC General",
        hero: "/images/ssc-hero.png",
        articles: [
          {
            id: "ssc-a1",
            title: "State level reforms and elections",
            excerpt:
              "Elections in several states resulted in new leadership ...",
            image: "/images/worldcup.png",
            date: "2025-09-14T10:00:00Z",
            scope: "State",
          },
        ],
      },
    ],

    /* ===== APPSC ===== */
    appsc: [
      {
        id: "appsc-1",
        title: "APPSC Topics",
        hero: "/images/appsc-hero.png",
        articles: [
          {
            id: "appsc-a1",
            title: "AP: Ladakh Protests overview",
            excerpt:
              "Regional perspective on Ladakh protests and state administration ...",
            image: "/images/worldcup.png",
            date: "2025-09-25T09:00:00Z",
            scope: "State",
          },
        ],
      },
    ],

    /* ===== Banking ===== */
    banking: [
      {
        id: "banking-news",
        title: "Banking Updates",
        hero: "/images/banking-hero.png",
        articles: [
          {
            id: "bank-a1",
            title: "New RBI guidelines on digital lending",
            excerpt:
              "RBI released a fresh round of rules for digital lenders ...",
            image: "/images/worldcup.png",
            date: "2025-09-18T10:00:00Z",
            scope: "Banking",
          },
          {
            id: "bank-a2",
            title: "Bank merger announced",
            excerpt:
              "Two public sector banks are set to merge to improve efficiency ...",
            image: "/images/worldcup.png",
            date: "2025-08-05T10:00:00Z",
            scope: "Banking",
          },
        ],
      },
    ],

    /* ===== State News ===== */
    state: [
      {
        id: "state-general",
        title: "State Current Affairs",
        hero: "/images/state-hero.png",
        articles: [
          {
            id: "state-a1",
            title: "Local infrastructure projects approved",
            excerpt: "New projects were approved for urban modernization ...",
            image: "/images/worldcup.png",
            date: "2025-09-10T10:00:00Z",
            scope: "State",
          },
        ],
      },
    ],

    /* ===== International ===== */
    international: [
      {
        id: "world",
        title: "International Affairs",
        hero: "/images/international-hero.png",
        articles: [
          {
            id: "int-a1",
            title: "Global summit outcomes – Climate pact",
            excerpt:
              "World leaders agreed to a new climate pact in the summit ...",
            image: "/images/worldcup.png",
            date: "2025-09-02T10:00:00Z",
            scope: "International",
          },
          {
            id: "int-a2",
            title: "Cross-border agreements signed",
            excerpt:
              "Two neighboring countries signed trade and security agreements ...",
            image: "/images/worldcup.png",
            date: "2025-07-22T10:00:00Z",
            scope: "International",
          },
        ],
      },
    ],

    /* ===== Books & Authors ===== */
    books: [
      {
        id: "books-authors",
        title: "Books & Authors",
        hero: "/images/books-hero.png",
        articles: [
          {
            id: "books-a1",
            title: "Notable releases this month",
            excerpt:
              "A curated list of important books and authors to follow ...",
            image: "/images/worldcup.png",
            date: "2025-09-12T10:00:00Z",
            scope: "Books & Authors",
          },
        ],
      },
    ],

    /* ===== Sports ===== */
    sports: [
      {
        id: "sports-main",
        title: "Sports",
        hero: "/images/sports-hero.png",
        articles: [
          {
            id: "sports-a1",
            title: "List of Cricket World Cup winners",
            excerpt: "Historical winners and notable finals across decades ...",
            image: "/images/worldcup.png",
            date: "2025-09-29T10:00:00Z",
            scope: "Sports",
          },
          {
            id: "sports-a2",
            title: "National players in international leagues",
            excerpt:
              "Players from the country played key roles in recent leagues ...",
            image: "/images/worldcup.png",
            date: "2025-09-01T10:00:00Z",
            scope: "Sports",
          },
        ],
      },
    ],

    /* ===== Awards ===== */
    awards: [
      {
        id: "awards-list",
        title: "Awards & Recognitions",
        hero: "/images/awards-hero.png",
        articles: [
          {
            id: "awards-a1",
            title: "National awards announced",
            excerpt:
              "The government announced national honors for multiple contributors ...",
            image: "/images/worldcup.png",
            date: "2025-08-31T10:00:00Z",
            scope: "Awards",
          },
        ],
      },
    ],

    /* ===== Economy ===== */
    economy: [
      {
        id: "economy-main",
        title: "Economy",
        hero: "/images/economy-hero.png",
        articles: [
          {
            id: "eco-a1",
            title: "Inflation trends and policy stance",
            excerpt:
              "Analysis of inflation and expected central bank moves ...",
            image: "/images/worldcup.png",
            date: "2025-09-15T10:00:00Z",
            scope: "Economy",
          },
        ],
      },
    ],

    /* ===== Science & Tech ===== */
    science: [
      {
        id: "science-tech",
        title: "Science & Technology",
        hero: "/images/science-hero.png",
        articles: [
          {
            id: "sci-a1",
            title: "New satellite launched for remote sensing",
            excerpt:
              "A new satellite will support agriculture and disaster monitoring ...",
            image: "/images/worldcup.png",
            date: "2025-09-05T10:00:00Z",
            scope: "Science",
          },
        ],
      },
    ],
  },
};

export default CURRENT_AFFAIRS;
