// src/pages/CurrentAffairsSubcategories/CurrentAffairsSubcategories.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import SearchBar from "../../../components/SearchBar/SearchBar";
import CategoryCard from "../../../components/CategoryCard/CategoryCard";
import styles from "./CurrentAffairsSubcategories.module.css";
import DATA from "../../../data/CurrentAffairsSubcategories";
import { getCategories, getCategoryLanding } from "../../../api/currentAffairs";

/**
 * CurrentAffairsSubcategories
 * - Shows either top-level categories (when no :category param)
 *   or the subcategory tiles for a given categoryKey.
 * - Uses CategoryCard component for tiles.
 * - Logs network calls and results to console.
 */

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

  const [entryData, setEntryData] = useState({
    title: "Current Affairs",
    hero: "/images/current-affairs-hero.png",
    tiles: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // helper to normalize tiles to shape used by CategoryCard
  function normalizeTiles(tiles, fallbackLogo) {
    return (tiles || []).map((t) => ({
      id:
        t._id ||
        t.id ||
        t.key ||
        t.path ||
        (t.title || "").toLowerCase().replace(/\s+/g, "_"),
      title: t.title || t.name || "",
      logo: t.logo || t.hero || fallbackLogo || "/images/default-hero.png",
      description: t.description || t.excerpt || "",
      path:
        t.path ||
        t.url ||
        t.route ||
        `/currentaffairs/${paramCategory || t.key || t.id}`,
      count: t.count || t.itemCount || 0,
      raw: t,
    }));
  }

  useEffect(() => {
    let mounted = true;

    async function loadForNoCategory() {
      console.log("[Subcategories] fetch -> getCategories()");
      setLoading(true);
      setError(null);
      try {
        const res = await getCategories();
        console.log("[Subcategories] getCategories response:", res);

        if (!mounted) return;

        if (
          res &&
          res.success &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          const tiles = normalizeTiles(
            res.data,
            "/images/current-affairs-hero.png"
          );
          setEntryData({
            title: "Current Affairs",
            hero: "/images/current-affairs-hero.png",
            tiles,
          });
        } else {
          // fallback to DATA file
          console.warn(
            "[Subcategories] getCategories returned no data — using local DATA fallback."
          );
          const tiles = (DATA.categories || []).map((c) => ({
            id: c.key,
            title: c.title,
            logo: c.logo || c.hero || "/images/default-hero.png",
            description: c.description || "",
            path: `/currentaffairs/${c.key}`,
            raw: c,
          }));
          setEntryData({
            title: "Current Affairs",
            hero: "/images/current-affairs-hero.png",
            tiles,
          });
        }
      } catch (err) {
        console.error("[Subcategories] getCategories failed:", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load categories");
        // fallback to DATA
        const tiles = (DATA.categories || []).map((c) => ({
          id: c.key,
          title: c.title,
          logo: c.logo || c.hero || "/images/default-hero.png",
          description: c.description || "",
          path: `/currentaffairs/${c.key}`,
          raw: c,
        }));
        setEntryData({
          title: "Current Affairs",
          hero: "/images/current-affairs-hero.png",
          tiles,
        });
      } finally {
        if (mounted) setLoading(false);
        console.log("[Subcategories] getCategories finished");
      }
    }

    async function loadForCategory(key) {
      console.log(`[Subcategories] fetch -> getCategoryLanding("${key}")`);
      setLoading(true);
      setError(null);
      try {
        const res = await getCategoryLanding(key);
        console.log(
          `[Subcategories] getCategoryLanding(${key}) response:`,
          res
        );

        if (!mounted) return;

        if (res && res.success && res.data) {
          const categoryMeta = res.data.category || {};
          const tilesRaw = res.data.tiles || [];
          const tiles = normalizeTiles(
            tilesRaw,
            categoryMeta.logo || "/images/default-hero.png"
          );
          setEntryData({
            title: categoryMeta.title || key.toUpperCase(),
            hero:
              categoryMeta.hero ||
              categoryMeta.logo ||
              `/images/${key}-hero.png`,
            tiles,
            category: categoryMeta,
          });
        } else {
          console.warn(
            `[Subcategories] getCategoryLanding(${key}) returned no data — using local DATA fallback.`
          );
          // fallback to local DATA
          const catObj = DATA.subcategories?.[String(key).toLowerCase()];
          if (!catObj) {
            setEntryData({
              title: key.toUpperCase(),
              hero: `/images/${key}-hero.png`,
              tiles: [],
            });
          } else {
            const tiles = (catObj.tiles || []).map((t) => ({
              id: t.id,
              title: t.title,
              logo: t.logo || "/images/default-hero.png",
              description: t.description || "",
              path: t.path || `/currentaffairs/${key}/${t.id}`,
              raw: t,
            }));
            setEntryData({
              title: catObj.title || key.toUpperCase(),
              hero: catObj.hero || `/images/${key}-hero.png`,
              tiles,
            });
          }
        }
      } catch (err) {
        console.error(
          `[Subcategories] getCategoryLanding(${key}) failed:`,
          err
        );
        if (!mounted) return;
        setError(err?.message || "Failed to load category landing");
        // fallback to local DATA
        const catObj = DATA.subcategories?.[String(key).toLowerCase()];
        if (!catObj) {
          setEntryData({
            title: key.toUpperCase(),
            hero: `/images/${key}-hero.png`,
            tiles: [],
          });
        } else {
          const tiles = (catObj.tiles || []).map((t) => ({
            id: t.id,
            title: t.title,
            logo: t.logo || "/images/default-hero.png",
            description: t.description || "",
            path: t.path || `/currentaffairs/${key}/${t.id}`,
            raw: t,
          }));
          setEntryData({
            title: catObj.title || key.toUpperCase(),
            hero: catObj.hero || `/images/${key}-hero.png`,
            tiles,
          });
        }
      } finally {
        if (mounted) setLoading(false);
        console.log(`[Subcategories] getCategoryLanding(${key}) finished`);
      }
    }

    // decide which data to load
    if (!paramCategory) {
      loadForNoCategory();
    } else {
      loadForCategory(String(paramCategory).toLowerCase());
    }

    return () => {
      mounted = false;
    };
    // re-run when paramCategory or lang changes
  }, [paramCategory, lang]);

  // filter tiles by search query
  const tiles = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return entryData.tiles || [];
    return (entryData.tiles || []).filter(
      (t) =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [entryData.tiles, query]);

  const handleTileClick = (payload) => {
    // payload may be the full tile object (preferred) or a slug string (fallback)
    let t = payload;
    if (typeof payload === "string") {
      // try to find matching tile in current entryData.tiles
      t = (entryData.tiles || []).find(
        (x) => String(x.id) === String(payload)
      ) || { id: payload };
    }
    // derive category key safely
    const categoryKey = paramCategory
      ? String(paramCategory).toLowerCase()
      : (t.raw && (t.raw.categoryKey || t.raw.key)) || "";
    const subId = (t && (t.id || t._id || t.slug)) || "";

    // guard - if no categoryKey or subId, log and do nothing
    if (!categoryKey || !subId) {
      console.warn(
        "[Subcategories] handleTileClick missing categoryKey or subId",
        { categoryKey, subId, t }
      );
      return;
    }

    const path = `/currentaffairs/${categoryKey}/${subId}`;
    console.log("[Subcategories] navigate ->", path, { tile: t });
    navigate(path);
  };

  return (
    <div className={styles.pageWrapper}>
      {entryData.hero && (
        <Header imageSrc={entryData.hero} alt={`${entryData.title} hero`} />
      )}

      <CategoryHeader
        title={entryData.title || "Current Affairs"}
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
          <h2 className={styles.heading}>{entryData.title}</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <div className={styles.searchRow}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search subcategories"
          />
        </div>

        {loading ? (
          <div style={{ padding: 24, color: "#666" }}>Loading...</div>
        ) : (
          <div className={styles.grid}>
            {tiles.map((t) => (
              <CategoryCard
                key={t.id}
                id={t.id}
                name={t.title}
                buttonLabel={"view Current Affars"}
                logo={t.logo}
                slug={t.id}
                description={t.description}
                count={t.count} // if your CategoryCard supports count
                onButtonClick={() => handleTileClick(t)}
              />
            ))}

            {(!tiles || tiles.length === 0) && (
              <div style={{ padding: 24, color: "#666" }}>
                No subcategories match “{query}”
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, color: "crimson" }}>
            Error loading data: {error}. See console for details.
          </div>
        )}
      </section>
    </div>
  );
}
