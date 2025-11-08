import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/SearchBar/SearchBar";
import styles from "./PreviousQuestionPapers.module.css";

export default function PreviousQuestionPapers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const categories = [
    { id: 1, name: "UPSC", logo: "/images/upsc.png", slug: "upsc" },
    { id: 2, name: "CGL", logo: "/images/cgl.png", slug: "cgl" },
    { id: 3, name: "CHSL", logo: "/images/chsl.png", slug: "chsl" },
    { id: 4, name: "APPSC", logo: "/images/appsc.png", slug: "appsc" },
    { id: 5, name: "TSPSC", logo: "/images/tspsc.png", slug: "tspsc" },
    {
      id: 6,
      name: "AP POLICE SI",
      logo: "/images/appolice.png",
      slug: "appolice",
    },
    {
      id: 7,
      name: "TS POLICE SI",
      logo: "/images/tspolice.png",
      slug: "tspolice",
    },
    {
      id: 8,
      name: "State Bank of India PO",
      logo: "/images/sbi.png",
      slug: "sbi",
    },
    { id: 9, name: "IBPS", logo: "/images/ibps.png", slug: "ibps" },
    { id: 10, name: "Railways", logo: "/images/railway.png", slug: "railways" },
    { id: 11, name: "OTHERS…", logo: "/images/brainbuzz.png", slug: "others" },
  ];

  const handleNavigate = (slug) => {
    navigate(`/previous-papers/${slug}`);
  };

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [search, categories]);

  return (
    <div className={styles.pageWrapper}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextBox}>
            <h1 className={styles.heroTitle}>Previous Question Papers</h1>
          </div>

          <div className={styles.heroImageBox}>
            <img
              src="/images/daily-quizzes-banner.png"
              alt="Previous Question Papers"
              className={styles.heroImage}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className={styles.categories}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Previous Question Papers</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <p className={styles.subtitle}>
          Explore our archive of previous question papers to practice and assess
          your preparation.
        </p>

        {/* SEARCH BAR */}
        <div className={styles.searchBar}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Question Papers"
          />
        </div>

        {/* CATEGORY GRID */}
        <div className={`${styles.grid} ${search ? styles.searchActive : ""}`}>
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className={styles.card}
              onClick={() => handleNavigate(cat.slug)}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleNavigate(cat.slug);
              }}
              aria-label={`Go to ${cat.name} previous papers`}
            >
              <img src={cat.logo} alt={cat.name} className={styles.cardImage} />
              <div className={styles.cardTitle}>{cat.name}</div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className={styles.noResults} role="status" aria-live="polite">
              No results found for “{search}”
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
