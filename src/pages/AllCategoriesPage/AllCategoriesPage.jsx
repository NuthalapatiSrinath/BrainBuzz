import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import CategoryHeader from "../../components/CategoryHeader/CategoryHeader";
import AllPageScrollCard from "../../components/AllPageScrollCard/AllPageScrollCard";
import { getCategories, getCategoryLanding } from "../../api/currentAffairs";
import styles from "./AllCategoriesPage.module.css";

/**
 * AllCategoriesPage
 * - Header + CategoryHeader (language), then one horizontal row per category.
 * - Each row shows a few subcategories (tiles) using AllPageScrollCard.
 * - Clicking View All navigates to the category landing.
 * - Clicking a tile navigates to subcategory articles.
 *
 * NOTE: This component logs all network calls to console for debugging.
 */

export default function AllCategoriesPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(
    () => localStorage.getItem("bb_lang_code") || "en"
  );

  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]); // { category, tiles: [] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load categories then load tiles (landing) for each (parallel)
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      console.log("[AllCategoriesPage] fetch -> getCategories()");
      try {
        const res = await getCategories();
        console.log("[AllCategoriesPage] getCategories response:", res);
        if (!mounted) return;
        const cats =
          res && res.success && Array.isArray(res.data) ? res.data : [];
        setCategories(cats);

        // load landing for each category in parallel (but limit concurrency)
        const promises = cats.map(async (c) => {
          try {
            console.log(
              `[AllCategoriesPage] fetch -> getCategoryLanding(${c._id})`
            );
            const r = await getCategoryLanding(c._id);
            console.log(`[AllCategoriesPage] getCategoryLanding(${c._id})`, r);
            const tiles =
              r && r.success && r.data && Array.isArray(r.data.tiles)
                ? r.data.tiles
                : [];
            return { category: c, tiles };
          } catch (err) {
            console.error(
              `[AllCategoriesPage] getCategoryLanding(${c._id}) failed:`,
              err
            );
            // fallback to empty tiles
            return { category: c, tiles: [] };
          }
        });

        // wait for all (if many categories you might want to do batching)
        const results = await Promise.all(promises);
        if (!mounted) return;
        setRows(results);
      } catch (err) {
        console.error("[AllCategoriesPage] getCategories failed:", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
        console.log("[AllCategoriesPage] load finished");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  function handleViewAll(categoryKey) {
    console.log("[AllCategoriesPage] View All ->", categoryKey);
    navigate(`/currentaffairs/${categoryKey}`);
  }

  function handleTileClick(tile, categoryKey) {
    // tile.id should be subcategory id
    console.log("[AllCategoriesPage] tile click ->", categoryKey, tile);
    const subId = tile.id || tile._id || tile.key;
    navigate(`/currentaffairs/${categoryKey}/${subId}`);
  }

  return (
    <div className={styles.pageWrapper}>
      <Header
        imageSrc="/images/current-affairs-hero.png"
        alt="All Categories"
      />

      <CategoryHeader
        title="All Current Affairs"
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

      <main className={styles.container}>
        {loading && <div className={styles.loading}>Loading categories…</div>}

        {error && <div className={styles.error}>Error: {error}</div>}

        {!loading &&
          rows.map(({ category, tiles }) => (
            <AllPageScrollCard
              key={category._id}
              title={category.title || category._id}
              items={tiles.map((t) => ({
                id: t.id || t._id || t._id, // ensure id
                title: t.title || t.name,
                logo: t.logo || category.logo,
                description: t.description || "",
                count: t.count || 0,
                path: `/currentaffairs/${category._id}/${t._id || t.id}`,
              }))}
              onViewAll={() => handleViewAll(category._id)}
              onTileClick={(t) => handleTileClick(t, category._id)}
              showCount={true}
              limit={8}
            />
          ))}

        {!loading && rows.length === 0 && (
          <div className={styles.empty}>No categories available</div>
        )}
      </main>
    </div>
  );
}
