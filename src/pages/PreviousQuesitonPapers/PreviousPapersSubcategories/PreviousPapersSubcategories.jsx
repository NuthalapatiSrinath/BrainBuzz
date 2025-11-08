import React, { useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import SearchBar from "../../../components/SearchBar/SearchBar";
import PREVIOUS_PAPERS from "../../../data/previousPapers";
import styles from "./PreviousPapersSubcategories.module.css";

/** memoized Tile to avoid unneeded re-mounts/rerenders */
const Tile = React.memo(function Tile({ t, onOpen }) {
  // console.log can help debug re-renders:
  // console.log("Tile render:", t.id);
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen(t.path)}
      aria-label={`Open ${t.title}`}
    >
      <img
        src={t.logo}
        alt={t.title}
        className={styles.cardImage}
        loading="lazy"
        width={120}
        height={100}
        onError={(e) => {
          // set fallback but do NOT call setState here
          e.currentTarget.src = "/images/default-sub.png";
        }}
        style={{ objectFit: "contain", display: "block" }}
      />
      <div className={styles.cardTitle}>{t.title}</div>
    </button>
  );
});

export default function PreviousPapersSubcategories() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [lang, setLang] = useState(
    () => localStorage.getItem("bb_lang_code") || "en"
  );

  // compute entry only when category changes (stable references)
  const entry = useMemo(() => {
    const data = PREVIOUS_PAPERS || {};
    if (!category) {
      const tiles = Object.keys(data).map((k) => {
        const item = data[k] || {};
        return {
          id: k,
          title: item.title || k.toUpperCase(),
          logo: item.hero || "/images/default-hero.png",
          path: `/previous-papers/${k}`,
          count: item.subcategories
            ? Object.keys(item.subcategories).length
            : 0,
        };
      });

      return {
        title: "Previous Papers",
        hero: "/images/previous-papers-hero.png",
        tiles,
      };
    }

    const catKey = String(category).toLowerCase();
    const catObj = data[catKey];
    if (!catObj) {
      return {
        title: catKey.toUpperCase(),
        hero: `/images/${catKey}-hero.png`,
        tiles: [],
      };
    }

    const tiles = Object.keys(catObj.subcategories || {}).map((sKey) => {
      const s = catObj.subcategories[sKey] || {};
      return {
        id: sKey,
        title: s.title || sKey,
        logo: s.logo || "/images/default-sub.png",
        description: s.description || "",
        path: `/previous-papers/${catKey}/${sKey}`,
        count: s.papers ? s.papers.length : 0,
      };
    });

    return {
      title: catObj.title || catKey.toUpperCase(),
      hero: catObj.hero || `/images/${catKey}-hero.png`,
      tiles,
    };
  }, [category]);

  // search filter — memoized
  const filteredTiles = useMemo(() => {
    if (!entry) return [];
    const q = (query || "").trim().toLowerCase();
    if (!q) return entry.tiles || [];
    return (entry.tiles || []).filter(
      (t) =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.id || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [entry, query]);

  // stable handler so Tile onClick identity doesn't change
  const handleOpen = useCallback(
    (path) => {
      try {
        navigate(path);
      } catch (err) {
        console.error("Navigation failed:", err, path);
      }
    },
    [navigate]
  );

  if (!entry) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: 40 }}>No previous papers data available.</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {entry.hero && (
        <Header imageSrc={entry.hero} alt={entry.title || "Previous Papers"} />
      )}

      <CategoryHeader
        title={entry.title || "Previous Papers"}
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={lang}
        onChange={(k) => {
          if (k !== lang) {
            localStorage.setItem("bb_lang_code", k);
            setLang(k);
          }
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
            placeholder="Search papers"
          />
        </div>

        <div className={styles.grid} role="list">
          {filteredTiles.map((t) => (
            <Tile key={t.id} t={t} onOpen={handleOpen} />
          ))}

          {filteredTiles.length === 0 && (
            <div style={{ padding: 24, color: "#666" }}>
              No items match “{query}”
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
