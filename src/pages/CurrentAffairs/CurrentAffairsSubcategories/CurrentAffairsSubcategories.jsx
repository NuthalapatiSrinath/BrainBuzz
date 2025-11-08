// src/pages/CurrentAffairsSubcategories/CurrentAffairsSubcategories.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import SearchBar from "../../../components/SearchBar/SearchBar";
import styles from "./CurrentAffairsSubcategories.module.css";
import DATA from "../../../data/CurrentAffairsSubcategories";

export default function CurrentAffairsSubcategories() {
  const { category: paramCategory } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("bb_lang_code") || "en";
    } catch {
      return "en";
    }
  });

  const entry = useMemo(() => {
    if (!paramCategory) {
      const tiles = (DATA.categories || []).map((c) => ({
        id: c.key,
        title: c.title,
        logo: c.logo || c.hero || "/images/default-hero.png",
        path: `/currentaffairs/${c.key}`,
      }));
      return {
        title: "Current Affairs",
        hero: "/images/current-affairs-hero.png",
        tiles,
      };
    }

    const key = String(paramCategory).toLowerCase();
    const cat = DATA.subcategories[key];
    if (!cat) {
      return {
        title: key.toUpperCase(),
        hero: `/images/${key}-hero.png`,
        tiles: [],
      };
    }

    return {
      title: cat.title || key.toUpperCase(),
      hero: cat.hero || `/images/${key}-hero.png`,
      tiles: (cat.tiles || []).map((t) => ({
        ...t,
        path: t.path || `/currentaffairs/${key}/${t.id}`,
      })),
    };
  }, [paramCategory]);

  const tiles = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return entry.tiles || [];
    return (entry.tiles || []).filter((t) =>
      (t.title || "").toLowerCase().includes(q)
    );
  }, [entry, query]);

  const handleTileClick = (t) =>
    navigate(t.path || `/currentaffairs/${paramCategory || t.id}`);

  return (
    <div className={styles.pageWrapper}>
      {entry.hero && (
        <Header imageSrc={entry.hero} alt={`${entry.title} hero`} />
      )}

      <CategoryHeader
        title={entry.title || "Current Affairs"}
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={lang}
        onChange={(k) => {
          try {
            localStorage.setItem("bb_lang_code", k);
          } catch {}
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
            placeholder="Search subcategories"
          />
        </div>

        <div className={styles.grid}>
          {tiles.map((t) => (
            <button
              key={t.id}
              className={styles.card}
              onClick={() => handleTileClick(t)}
              type="button"
            >
              <img src={t.logo} alt={t.title} className={styles.cardImage} />
              <div className={styles.cardTitle}>{t.title}</div>
            </button>
          ))}

          {tiles.length === 0 && (
            <div style={{ padding: 24, color: "#666" }}>
              No subcategories match “{query}”
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
