// src/data/dailyQuizzes.js
// Daily Quizzes data generator: first quiz with 10 questions, subsequent quizzes with 2 questions
// This file programmatically builds many quizzes (by month) so the UI shows lots of quizzes like in your screenshot.

const base10Questions = [
  {
    id: "sample-q-1",
    question: "Which of these is part of the Basic Structure doctrine?",
    options: ["Parliamentary system", "Fundamental rights", "Directive Principles", "Secularism"],
    correct: "Secularism",
    explanation:
      "Basic Structure protects essential features like secularism, democracy and the rule of law.",
  },
  {
    id: "sample-q-2",
    question: "Article 368 deals with:",
    options: ["Emergency", "Amendment of Constitution", "President protection", "Distribution of powers"],
    correct: "Amendment of Constitution",
    explanation: "Article 368 empowers Parliament to amend the Constitution.",
  },
  {
    id: "sample-q-3",
    question: "President of India is elected by:",
    options: ["Direct vote", "MPs only", "MPs and MLAs", "Nominated electorate"],
    correct: "MPs and MLAs",
    explanation: "Elected by an electoral college of MPs and MLAs.",
  },
  {
    id: "sample-q-4",
    question: "Which amendment introduced GST?",
    options: ["101st", "92nd", "73rd", "44th"],
    correct: "101st",
    explanation: "The 101st Constitutional Amendment introduced GST.",
  },
  {
    id: "sample-q-5",
    question: "Right to Freedom of Speech is under which Article (broadly)?",
    options: ["Article 21", "Article 19", "Article 14", "Article 32"],
    correct: "Article 19",
    explanation: "Article 19 guarantees freedom of speech and expression.",
  },
  {
    id: "sample-q-6",
    question: "Separation of Powers in India is:",
    options: ["Complete separation", "Partial with checks", "No separation", "Only Exec & Judiciary"],
    correct: "Partial with checks",
    explanation: "India has separation with overlaps and checks (e.g., judicial review).",
  },
  {
    id: "sample-q-7",
    question: "Supreme Court resolves disputes between:",
    options: ["Union and States", "Banks", "Finance Commission", "Election Commission"],
    correct: "Union and States",
    explanation: "The Supreme Court adjudicates disputes between the Union and States.",
  },
  {
    id: "sample-q-8",
    question: "Doctrine of Judicial Review is inspired by:",
    options: ["British Constitution", "American Constitution", "French Constitution", "German Constitution"],
    correct: "American Constitution",
    explanation: "Judicial review concept in India was influenced by the U.S. system.",
  },
  {
    id: "sample-q-9",
    question: "Which is the lender of last resort in India?",
    options: ["RBI", "World Bank", "Finance Commission", "SEBI"],
    correct: "RBI",
    explanation: "RBI acts as lender of last resort for banks in India.",
  },
  {
    id: "sample-q-10",
    question: "Constant price GDP is used to measure:",
    options: ["Current price growth", "Real growth (base-year prices)", "Nominal GDP", "Inflation only"],
    correct: "Real growth (base-year prices)",
    explanation: "Constant price GDP removes inflation effects by using base-year prices.",
  },
];

const base2Questions = [
  {
    id: "mini-q-1",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: "Mars",
    explanation: "Mars is commonly called the Red Planet.",
  },
  {
    id: "mini-q-2",
    question: "What does GDP stand for?",
    options: ["Gross Domestic Product", "General Domestic Product", "Gross Domestic Placement", "General Debt Position"],
    correct: "Gross Domestic Product",
    explanation: "GDP stands for Gross Domestic Product.",
  },
];

function cloneQuestions(arr, prefix = "") {
  return arr.map((q, i) => ({
    ...q,
    id: `${prefix || q.id}-${i + 1}-${Math.random().toString(36).slice(2, 6)}`,
  }));
}

function makeQuiz({ id, title, date, description, questionCount = 2, full10 = false }) {
  const questions = full10 ? cloneQuestions(base10Questions, id) : cloneQuestions(base2Questions, id);
  return {
    id,
    title,
    date,
    description,
    questionCount: questions.length,
    questions,
  };
}

// Build many quiz entries across months to mimic your screenshot
function buildQuizzesForMonth(year, monthIndex, titles) {
  // monthIndex 0 = Jan, ... 6 = Jul etc.
  // titles: array of title strings (first title -> will be 10-q quiz)
  const quizzes = [];
  const days = [1, 3, 4, 6, 7, 2]; // sample day numbers to use (order preserved)
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    const day = days[i % days.length];
    const date = new Date(year, monthIndex, day).toISOString().slice(0, 10);
    const id = `${String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${year}-${monthIndex + 1}-${i + 1}`;
    quizzes.push(
      makeQuiz({
        id,
        title,
        date,
        description: `${title} — quick practice for ${title.split(" ")[0]}.`,
        full10: i === 0, // first quiz for the month has 10 questions
      })
    );
  }
  return quizzes;
}

// We'll create months Jul - Oct 2025 like your image (four group boxes)
// each month will have 6 quizzes (first with 10 questions, others 2)
const monthsData = [
  { year: 2025, monthIndex: 9, monthName: "October", titles: ["UPSC Static Quiz – Polity", "UPSC Static Quiz – Economy", "UPSC Static Quiz – History", "UPSC Static Quiz – Geography", "UPSC Static Quiz – Art and Culture", "UPSC Static Quiz – History"] },
  { year: 2025, monthIndex: 8, monthName: "September", titles: ["UPSC Static Quiz – Art and Culture", "UPSC Static Quiz – Economy", "UPSC Static Quiz – History", "UPSC Static Quiz – Polity", "UPSC Static Quiz – Geography", "UPSC Static Quiz – History"] },
  { year: 2025, monthIndex: 7, monthName: "August", titles: ["UPSC Static Quiz – Economy", "UPSC Static Quiz – History", "UPSC Static Quiz – Polity", "UPSC Static Quiz – Geography", "UPSC Static Quiz – Art and Culture", "UPSC Static Quiz – History"] },
  { year: 2025, monthIndex: 6, monthName: "July", titles: ["UPSC Static Quiz – Economy", "UPSC Static Quiz – History", "UPSC Static Quiz – Polity", "UPSC Static Quiz – Geography", "UPSC Static Quiz – Art and Culture", "UPSC Static Quiz – History"] },
];

// Build UPSC -> prelims quizzes by concatenating generated month quizzes (gives many entries)
const upscPrelimsQuizzes = [];
for (const m of monthsData) {
  const q = buildQuizzesForMonth(m.year, m.monthIndex, m.titles);
  upscPrelimsQuizzes.push(...q);
}

// Also keep a few hand-crafted quizzes earlier in your original file (polity & economy with full 10 each)
const handcraftedQuizzes = [
  {
    id: "upsc-prelims-polity-001",
    title: "Polity Set 1",
    date: "2025-10-01",
    description:
      "Ten quick polity questions covering constitutional provisions, institutions and governance — ideal for UPSC prelims practice.",
    questionCount: 10,
    questions: cloneQuestions(base10Questions, "polity-set-1"),
  },
  {
    id: "upsc-prelims-economy-001",
    title: "Economy Set 1",
    date: "2025-10-07",
    description:
      "Ten targeted economy questions: macro indicators, banking, fiscal/monetary policy and current economic issues for prelims practice.",
    questionCount: 10,
    questions: cloneQuestions(base10Questions, "economy-set-1"),
  },
];

// Compose final quizzes array: include handcrafted first then many monthly quizzes (so you'll definitely have the first full-10 quizzes)
const finalUpscPrelims = [...handcraftedQuizzes, ...upscPrelimsQuizzes];

// Build the full DAILY_QUIZZES object
const DAILY_QUIZZES = {
 categories: [
    { key: "upsc", title: "UPSC", logo: "/images/upsc.png", hero: "/images/upsc.png" },
    { key: "cgl", title: "SSC CGL", logo: "/images/cgl.png", hero: "/images/cgl.png" },
    { key: "chsl", title: "SSC CHSL", logo: "/images/chsl.png", hero: "/images/chsl.png" },
    { key: "appsc", title: "APPSC", logo: "/images/appsc.png", hero: "/images/appsc.png" },
    { key: "tspsc", title: "TSPSC", logo: "/images/tspsc.png", hero: "/images/tspsc.png" },
    { key: "appolice", title: "AP POLICE SI", logo: "/images/appolice.png", hero: "/images/appolice.png" },
    { key: "tspolice", title: "TS POLICE SI", logo: "/images/tspolice.png", hero: "/images/tspolice.png" },
    { key: "sbi", title: "State Bank of India PO", logo: "/images/sbi.png", hero: "/images/sbi.png" },
    { key: "ibps", title: "IBPS", logo: "/images/ibps.png", hero: "/images/ibps.png" },
    { key: "railways", title: "Railways", logo: "/images/railway.png", hero: "/images/railway.png" },
    { key: "others", title: "OTHERS…", logo: "/images/brainbuzz.png", hero: "/images/brainbuzz.png" },
  ],

  subcategories: {
    upsc: [
      {
        id: "prelims",
        title: "Prelims Quiz",
        logo: "/images/upsc.png",
        path: "/dailyquizzes/upsc/prelims",
        quizzes: finalUpscPrelims,
      },
      {
        id: "mains",
        title: "Mains Quiz",
        logo: "/images/upsc.png",
        path: "/dailyquizzes/upsc/mains",
        quizzes: [
          {
            id: "upsc-mains-essay-001",
            title: "Essay Practice 1",
            date: "2025-09-15",
            description:
              "Ten short-answer prompts and essay questions for Mains practice; each prompt requires structure and points to cover.",
            questionCount: 10,
            questions: cloneQuestions(base10Questions, "mains-essay"),
          },
        ],
      },
    ],

    cgl: [
      {
        id: "tier1",
        title: "Tier I Quiz",
        logo: "/images/cgl.png",
        path: "/dailyquizzes/cgl/tier1",
        quizzes: [
          makeQuiz({
            id: "cgl-tier1-q1",
            title: "CGL Quant & GA Set",
            date: "2025-08-07",
            description:
              "Mixed set of quantitative aptitude and general awareness questions useful for SSC CGL Tier-1 practice.",
            full10: true,
          }),
        ],
      },
    ],

    chsl: [
      {
        id: "tier1",
        title: "Tier I Quiz",
        logo: "/images/chsl.png",
        path: "/dailyquizzes/chsl/tier1",
        quizzes: [
          makeQuiz({
            id: "chsl-tier1-q1",
            title: "CHSL General Awareness Set",
            date: "2025-08-06",
            description: "Quick general awareness and reasoning questions for CHSL Tier-1 revision.",
            full10: true,
          }),
        ],
      },
    ],

    sbi: [
      {
        id: "sbi",
        title: "SBI PO Quiz",
        logo: "/images/sbi.png",
        path: "/dailyquizzes/sbi/sbi",
        quizzes: [
          makeQuiz({
            id: "sbi-po-q1",
            title: "Banking Awareness Set 1",
            date: "2025-07-10",
            description: "Banking awareness, financial sector and current banking affairs — 10 questions for PO aspirants.",
            full10: true,
          }),
        ],
      },
    ],
  },
};

export default DAILY_QUIZZES;
