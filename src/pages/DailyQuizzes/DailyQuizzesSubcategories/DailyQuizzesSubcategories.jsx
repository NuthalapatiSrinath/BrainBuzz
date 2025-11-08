// src/pages/DailyQuizzesSubcategories/DailyQuizzesSubcategories.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import SearchBar from "../../../components/SearchBar/SearchBar";
import DAILY_QUIZZES from "../../../data/dailyQuizzes"; // ✅ new dynamic source
import styles from "./DailyQuizzesSubcategories.module.css";

/**
 * DailyQuizzesSubcategories
 *
 * Supports:
 *  - /dailyquizzes            → shows all quiz exam categories (UPSC, CGL, etc.)
 *  - /dailyquizzes/:category  → shows quiz subcategories for a given exam (Prelims, Tier 1, etc.)
 *
 * Data structure expected from src/data/dailyQuizzes.js:
 * {
 *   categories: [{ key, title, logo, hero }],
 *   subcategories: {
 *     upsc: [{ id, title, logo, path, quizzes }],
 *     ...
 *   }
 * }
 */

export default function DailyQuizzesSubcategories() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [lang, setLang] = useState(
    localStorage.getItem("bb_lang_code") || "en"
  );

  /** Top-level exam categories */
  const topCategories = useMemo(() => DAILY_QUIZZES.categories || [], []);

  /** Build entry (either list of categories, or subcategories of one exam) */
  const entry = useMemo(() => {
    if (!category) {
      // Main quizzes landing — show all categories
      return {
        title: "Daily Quizzes",
        hero: "/images/dailyquizzes-hero.png",
        tiles: topCategories.map((cat) => ({
          id: cat.key,
          title: cat.title,
          logo: cat.logo || cat.hero,
          path: `/dailyquizzes/${cat.key}`,
        })),
      };
    }

    // Category-specific quizzes
    const catKey = String(category).toLowerCase();
    const subList = DAILY_QUIZZES.subcategories?.[catKey] || [];
    const catMeta = topCategories.find((c) => c.key === catKey);

    return {
      title: catMeta?.title || catKey.toUpperCase(),
      hero: catMeta?.hero || `/images/${catKey}-hero.png`,
      tiles: subList.map((s) => ({
        id: s.id,
        title: s.title,
        logo: s.logo || "/images/default-sub.png",
        path: s.path || `/dailyquizzes/${catKey}/${s.id}`,
      })),
    };
  }, [category, topCategories]);

  /** Search filtering */
  const tiles = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!entry) return [];
    const all = entry.tiles || [];
    if (!q) return all;
    return all.filter(
      (t) =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.id || "").toLowerCase().includes(q)
    );
  }, [entry, query]);

  /** Handle no data fallback */
  if (!entry)
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: 40 }}>No quiz data found.</div>
      </div>
    );

  return (
    <div className={styles.pageWrapper}>
      {/* HERO */}
      {entry.hero && <Header imageSrc={entry.hero} alt={entry.title} />}

      {/* HEADER */}
      <CategoryHeader
        title={entry.title}
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={lang}
        onChange={(k) => {
          localStorage.setItem("bb_lang_code", k);
          setLang(k);
        }}
        showDivider
      />

      {/* BODY */}
      <section className={styles.subSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>{entry.title}</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <div className={styles.searchRow}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search quizzes"
          />
        </div>

        <div className={styles.grid}>
          {tiles.map((t) => (
            <button
              key={t.id}
              type="button"
              className={styles.card}
              onClick={() => {
                try {
                  navigate(t.path);
                } catch (err) {
                  console.error("Navigation failed:", err, t.path);
                }
              }}
              aria-label={`Open ${t.title}`}
            >
              <img
                src={t.logo}
                alt={t.title}
                className={styles.cardImage}
                onError={(e) =>
                  (e.currentTarget.src = "/images/default-sub.png")
                }
              />
              <div className={styles.cardTitle}>{t.title}</div>
            </button>
          ))}

          {tiles.length === 0 && (
            <div style={{ padding: 24, color: "#666" }}>
              No quizzes found for “{query}”
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
