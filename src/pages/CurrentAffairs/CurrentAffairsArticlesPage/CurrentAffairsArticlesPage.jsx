// src/pages/CurrentAffairsArticlesPage/CurrentAffairsArticlesPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import CURRENT_AFFAIRS from "../../../data/currentAffairs";
import CurrentAffairsArticleCard from "../../../components/CurrentAffairsArticleCard/CurrentAffairsArticleCard";
import CurrentAffairsCard from "../../../components/CurrentAffairsCard/CurrentAffairsCard";
import styles from "./CurrentAffairsArticlesPage.module.css";

/**
 * Layout:
 * Header
 * CategoryHeader
 * Filters row
 * -> TWO WIDGETS ROW:
 *    LEFT: CurrentAffairsCard that renders article cards inside (topArticleNodes)
 *    RIGHT: CurrentAffairsCard showing months list only (clicking month filters left + updates URL)
 */
export default function CurrentAffairsArticlesPage() {
  const { category, subId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?month=YYYY-MM from URL (if present)
  const queryParams = new URLSearchParams(location.search);
  const initialMonth = queryParams.get("month");

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || null); // "YYYY-MM" or null
  const catKey = String(category || "").toLowerCase();

  // keep selectedMonth in sync with URL changes (so navigation from other pages works)
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const m = q.get("month");
    setSelectedMonth(m || null);
  }, [location.search]);

  // lookup category & subcategory
  const { subcategory, categoryMeta } = useMemo(() => {
    const catMeta =
      (CURRENT_AFFAIRS.categories || []).find(
        (c) => String(c.key).toLowerCase() === catKey
      ) || null;

    let subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey];
    if (!subsRaw)
      subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey?.toUpperCase()] || [];
    const subsArray = Array.isArray(subsRaw)
      ? subsRaw
      : Object.values(subsRaw || {});
    const sub =
      subsArray.find(
        (s) => String(s.id).toLowerCase() === String(subId || "").toLowerCase()
      ) || null;

    return { subcategory: sub, categoryMeta: catMeta };
  }, [catKey, subId]);

  // helper: safe month key "YYYY-MM"
  function monthKeyFromDate(d) {
    try {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return null;
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1).toString().padStart(2, "0");
      return `${y}-${m}`;
    } catch {
      return null;
    }
  }

  // compute months list from subcategory articles
  const months = useMemo(() => {
    const arr = Array.isArray(subcategory?.articles)
      ? subcategory.articles
      : [];
    const map = new Map();
    for (const a of arr) {
      const mk = monthKeyFromDate(a.date) || "unknown";
      if (!map.has(mk)) {
        const label =
          mk === "unknown"
            ? "Unknown"
            : new Date(a.date).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              });
        map.set(mk, { key: mk, label, count: 0 });
      }
      map.get(mk).count += 1;
    }
    const items = Array.from(map.values()).sort((a, b) => {
      if (a.key === "unknown") return 1;
      if (b.key === "unknown") return -1;
      return b.key.localeCompare(a.key) * -1; // newest first
    });
    return items;
  }, [subcategory]);

  // displayedArticles: sort, then filter by selectedMonth and activeFilter
  const displayedArticles = useMemo(() => {
    const arr = Array.isArray(subcategory?.articles)
      ? [...subcategory.articles]
      : [];
    arr.sort((x, y) => {
      const dx = x.date ? new Date(x.date).getTime() : 0;
      const dy = y.date ? new Date(y.date).getTime() : 0;
      return dy - dx;
    });

    let filtered = arr;

    // monthly filter
    if (selectedMonth) {
      filtered = filtered.filter(
        (a) => monthKeyFromDate(a.date) === selectedMonth
      );
    }

    // active scope filter
    if (activeFilter && activeFilter !== "All") {
      filtered = filtered.filter((a) =>
        (a.scope || "")
          .toString()
          .toLowerCase()
          .includes(activeFilter.toLowerCase())
      );
    }

    return filtered;
  }, [subcategory, selectedMonth, activeFilter]);

  // not found early return
  if (!subcategory) {
    return (
      <div className={styles.wrapper}>
        <Header
          imageSrc={categoryMeta?.hero || "/images/currentaffairs-hero.png"}
          alt="Current Affairs"
        />
        <CategoryHeader
          title={(categoryMeta && categoryMeta.title) || "Current Affairs"}
          languages={[
            { key: "en", label: "English" },
            { key: "hi", label: "Hindi" },
            { key: "te", label: "Telugu" },
          ]}
          active={localStorage.getItem("bb_lang_code") || "en"}
          onChange={() => {}}
        />
        <main className={styles.container}>
          <div className={styles.empty}>
            <h2>Not found</h2>
            <p>Requested subcategory not found.</p>
            <button
              className={styles.backBtn}
              onClick={() => navigate(`/currentaffairs/${category || ""}`)}
            >
              Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  // small helper to open article page
  function openArticle(a) {
    navigate(`/currentaffairs/${category}/${subcategory.id}/${a.id}`, {
      state: { article: a, sub: subcategory },
    });
  }

  // format date short
  function formatDateShort(d) {
    try {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return d || "";
      return dt.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d || "";
    }
  }

  // left widgets data (top N from displayedArticles so it's already filtered)
  const leftTop4Data = displayedArticles.slice(0, 4).map((a) => ({
    id: a.id,
    image: a.image || "/images/worldcup.png",
    title: a.title,
    description: a.excerpt || a.body || "",
    dateTime: formatDateShort(a.date),
    category: a.scope || "",
    onClick: () => openArticle(a),
  }));

  const leftTop4Components = leftTop4Data.map((a) => (
    <CurrentAffairsArticleCard
      key={`top-${a.id}`}
      compact={true}
      image={a.image}
      title={a.title}
      description={a.description}
      dateTime={a.dateTime}
      category={a.category}
      onClick={a.onClick}
    />
  ));

  // display title: if month selected -> "Month Year — Current Affairs" else default
  const displayTitle = selectedMonth
    ? `${new Date(selectedMonth + "-01").toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })} — Current Affairs`
    : `Today Latest Current Affairs`;

  // filters list to render above the widgets
  const FILTERS = [
    "All",
    "International",
    "State News",
    "Banking",
    "Business news",
    "Books & Authors",
    "Sports",
    "Awards",
  ];

  // handle month click: toggle selectedMonth and update URL (so bookmarking works)
  function handleMonthClick(monthKey) {
    const newMonth = selectedMonth === monthKey ? null : monthKey;
    setSelectedMonth(newMonth);

    // update URL to include or remove ?month=
    const basePath = `/currentaffairs/${category}/${subcategory.id}`;
    if (newMonth) {
      navigate(`${basePath}?month=${newMonth}`, { replace: false });
    } else {
      navigate(basePath, { replace: false });
    }

    // scroll top for UX
    const top = document.querySelector(`.${styles.container}`);
    if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={styles.wrapper}>
      {/* HERO */}
      {categoryMeta?.hero ? (
        <Header
          imageSrc={categoryMeta.hero}
          alt={categoryMeta.title || "Category"}
        />
      ) : (
        <Header
          imageSrc="/images/currentaffairs-hero.png"
          alt="Current Affairs"
        />
      )}

      {/* CATEGORY HEADER */}
      <CategoryHeader
        title={`${subcategory.title || subId} — Current Affairs`}
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={localStorage.getItem("bb_lang_code") || "en"}
        onChange={(k) => {
          try {
            localStorage.setItem("bb_lang_code", k);
          } catch {}
        }}
        showDivider
      />

      {/* FILTERS (above the two widgets) */}
      <div
        className={styles.filterRow}
        role="tablist"
        aria-label="Article filters"
      >
        {FILTERS.map((f) => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.filterPill} ${
                active ? styles.activePill : ""
              }`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* TWO-WIDGET ROW */}
      <main className={styles.container}>
        <div className={styles.twoWidgetsRow}>
          {/* LEFT: big widget that renders article nodes (filtered) */}
          <div className={styles.leftWidget}>
            <CurrentAffairsCard
              title={displayTitle}
              color="#f2b6c3"
              topArticleNodes={leftTop4Components}
              style={{ width: "100%", maxWidth: "880px" }}
            />
          </div>

          {/* RIGHT: monthly widget (only the month list) */}
          <aside className={styles.rightWidget}>
            <CurrentAffairsCard
              title="Monthly Current Affairs"
              items={
                months.length
                  ? months.map((m) => ({
                      id: m.key,
                      title: m.label,
                      onClick: () => handleMonthClick(m.key),
                    }))
                  : []
              }
              activeItemId={selectedMonth}
              color="#bfe6ea"
              logo="/images/lion.png"
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
