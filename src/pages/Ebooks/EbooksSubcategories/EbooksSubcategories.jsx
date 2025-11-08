import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import SearchBar from "../../../components/SearchBar/SearchBar";
import EBOOKS_DATA from "../../../data/ebooks"; // expected: { categories: [...], subcategories: {...} }
import styles from "./EbooksSubcategories.module.css";

export default function EbooksSubcategories() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState(
    localStorage.getItem("bb_lang_code") || "en"
  );

  // categories list (safe)
  const topCategories = useMemo(() => EBOOKS_DATA?.categories || [], []);

  const entry = useMemo(() => {
    if (!category) {
      const tiles = topCategories.map((cat) => ({
        id: cat.key,
        title: cat.title,
        logo: cat.logo || cat.hero || "/images/default-hero.png",
        path: `/ebooks/${cat.key}`,
      }));
      return {
        title: "E-Books",
        hero: EBOOKS_DATA?.hero || "/images/ebooks-hero.png",
        tiles,
      };
    }

    const catKey = String(category).toLowerCase();
    const catMeta = topCategories.find(
      (c) => String(c.key).toLowerCase() === catKey
    );
    const subs = EBOOKS_DATA?.subcategories?.[catKey] || [];

    return {
      title: catMeta?.title || catKey.toUpperCase(),
      hero: catMeta?.hero || catMeta?.logo || `/images/${catKey}-hero.png`,
      tiles: subs.map((s) => ({
        id: s.id,
        title: s.title,
        logo: s.logo || "/images/default-sub.png",
        path: s.path || `/ebooks/${catKey}/${s.id}`,
      })),
    };
  }, [category, topCategories]);

  const tiles = useMemo(() => {
    if (!entry) return [];
    const q = (query || "").trim().toLowerCase();
    if (!q) return entry.tiles || [];
    return (entry.tiles || []).filter((t) =>
      (t.title || "").toLowerCase().includes(q)
    );
  }, [entry, query]);

  if (!entry)
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: 40 }}>No E-Books data found.</div>
      </div>
    );

  return (
    <div className={styles.pageWrapper}>
      {entry.hero && (
        <Header imageSrc={entry.hero} alt={entry.title || "E-Books"} />
      )}

      <CategoryHeader
        title={entry.title || "E-Books"}
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

      <section className={styles.subSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>{entry.title}</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <div className={styles.searchRow}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search e-books"
          />
        </div>

        <div className={styles.grid}>
          {tiles.map((t) => (
            <button
              key={t.id}
              className={styles.card}
              onClick={() => navigate(t.path)}
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
              No e-books found for “{query}”.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
