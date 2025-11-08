// src/pages/EbooksPage/EbooksPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import styles from "./EbooksPage.module.css";
import EBOOKS_DATA from "../../../data/ebooks.js";
export default function EbooksPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState(
    localStorage.getItem("bb_lang_code") || "en"
  );

  // Defensive: ensure categories array exists
  const categories = useMemo(() => {
    try {
      return Array.isArray(EBOOKS_DATA?.categories)
        ? EBOOKS_DATA.categories
        : [];
    } catch {
      return [];
    }
  }, []);

  // filter by search text
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      const name = (c.title || c.name || "").toLowerCase();
      const key = (c.key || c.slug || "").toLowerCase();
      return name.includes(q) || key.includes(q);
    });
  }, [search, categories]);

  const handleNavigate = (slug) => {
    if (!slug) return;
    // ensure lower-case slug so route matches
    const s = String(slug).toLowerCase();
    navigate(`/ebooks/${s}`);
  };

  // hero: prefer a general ebooks hero if present in data (optional)
  const heroImg =  "/images/daily-quizzes-banner.png";

  return (
    <div className={styles.pageWrapper}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextBox}>
            <h1 className={styles.heroTitle}>Explore Publications</h1>
          </div>

          <div className={styles.heroImageBox}>
            <img
              src={heroImg}
              alt="Ebooks"
              className={styles.heroImage}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Categories area */}
      <section className={styles.categories}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>E-Books</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <p className={styles.subtitle}>
          Explore our carefully curated publications and unlock valuable
          knowledge that empowers your personal and professional growth.
        </p>

        <div className={styles.searchBar}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search E-Books"
          />
        </div>

        <div className={`${styles.grid} ${search ? styles.searchActive : ""}`}>
          {filtered.map((cat) => {
            // category objects in EBOOKS_DATA.categories should have: key, title, logo, hero
            const id = cat.key || cat.id || cat.slug || cat.title;
            const title = cat.title || cat.name || id;
            const logo = cat.logo || cat.hero || "/images/default-sub.png";

            return (
              <div
                key={id}
                className={styles.card}
                role="button"
                tabIndex={0}
                onClick={() => handleNavigate(cat.key || cat.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleNavigate(cat.key || cat.slug);
                }}
                aria-label={`Go to ${title} publications`}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={logo}
                  alt={title}
                  className={styles.cardImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/default-sub.png";
                  }}
                  width={88}
                  height={88}
                />
                <div className={styles.cardTitle}>{title}</div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={styles.noResults} role="status" aria-live="polite">
              No publications found for “{search}”
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
