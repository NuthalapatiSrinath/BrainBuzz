// src/pages/CurrentAffairsArticlesPage/CurrentAffairsArticlesPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import CURRENT_AFFAIRS from "../../../data/currentAffairs";
import CurrentAffairsArticleCard from "../../../components/CurrentAffairsArticleCard/CurrentAffairsArticleCard";
import CurrentAffairsCard from "../../../components/CurrentAffairsCard/CurrentAffairsCard";
import styles from "./CurrentAffairsArticlesPage.module.css";
import {
  getCategoryLanding,
  getArticlesList,
} from "../../../api/currentAffairs";

/**
 * CurrentAffairsArticlesPage (integrated)
 * - header uses subcategory image (if available)
 * - category header title uses subcategory title
 * - language selection acts as a filter (no translation API)
 */

export default function CurrentAffairsArticlesPage() {
  const { category, subId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?month=YYYY-MM from URL (if present)
  const queryParams = new URLSearchParams(location.search);
  const initialMonth = queryParams.get("month");

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("bb_lang_code") || "en";
    } catch {
      return "en";
    }
  });

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || null); // "YYYY-MM" or null
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // data from API or fallback
  const [articlesData, setArticlesData] = useState({
    articles: [],
    months: [],
    meta: { total: 0, page: 1, limit },
  });
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [subcategoryMeta, setSubcategoryMeta] = useState(null); // new: metadata for current subcategory (logo/title)

  const catKey = String(category || "").toLowerCase();

  // keep selectedMonth in sync with URL changes
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const m = q.get("month");
    setSelectedMonth(m || null);
  }, [location.search]);

  // fetch category landing once: set categoryMeta and subcategoryMeta (if present)
  useEffect(() => {
    let mounted = true;
    async function loadCategoryLandingForMeta() {
      if (!category) return;
      try {
        console.log(
          `[ArticlesPage] fetch -> getCategoryLanding("${category}") for landing`
        );
        const res = await getCategoryLanding(category);
        console.log("[ArticlesPage] getCategoryLanding response:", res);
        if (!mounted) return;

        if (res && res.success && res.data) {
          const cat = res.data.category || null;
          setCategoryMeta(cat);

          // try to find the subcategory metadata by subId
          const tiles = res.data.tiles || res.data.subcategories || [];
          // tiles may be array of sub objects; be defensive
          let found = null;
          if (Array.isArray(tiles)) {
            found = tiles.find((s) => {
              const sid =
                s._id || s.id || s.slug || String(s.key || "").toLowerCase();
              return (
                String(sid).toLowerCase() === String(subId || "").toLowerCase()
              );
            });
          } else if (tiles && typeof tiles === "object") {
            // object keyed map
            const vals = Object.values(tiles);
            found = vals.find((s) => {
              const sid =
                s._id || s.id || s.slug || String(s.key || "").toLowerCase();
              return (
                String(sid).toLowerCase() === String(subId || "").toLowerCase()
              );
            });
          }
          if (found) {
            setSubcategoryMeta(found);
          } else {
            // if not found, try to match within category's nested subcategories (defensive)
            const alt = (res.data.subcategories || []).find
              ? (res.data.subcategories || []).find((s) => {
                  const sid = s._id || s.id || s.slug || s.key;
                  return (
                    String(sid).toLowerCase() ===
                    String(subId || "").toLowerCase()
                  );
                })
              : null;
            if (alt) setSubcategoryMeta(alt);
          }
        } else {
          // fallback static
          const catMeta =
            (CURRENT_AFFAIRS.categories || []).find(
              (c) => String(c.key).toLowerCase() === catKey
            ) || null;
          setCategoryMeta(catMeta);

          let subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey];
          if (!subsRaw)
            subsRaw =
              CURRENT_AFFAIRS.subcategories?.[catKey?.toUpperCase()] || [];
          const subsArray = Array.isArray(subsRaw)
            ? subsRaw
            : Object.values(subsRaw || {});
          const sub =
            subsArray.find(
              (s) =>
                String(s.id).toLowerCase() === String(subId || "").toLowerCase()
            ) || null;
          setSubcategoryMeta(sub);
        }
      } catch (err) {
        console.error("[ArticlesPage] getCategoryLanding failed:", err);
        if (!mounted) return;
        setError(
          err?.message || "Failed to load category/subcategory metadata"
        );
        // fallback to static data as above
        const catMeta =
          (CURRENT_AFFAIRS.categories || []).find(
            (c) => String(c.key).toLowerCase() === catKey
          ) || null;
        setCategoryMeta(catMeta);

        let subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey];
        if (!subsRaw)
          subsRaw =
            CURRENT_AFFAIRS.subcategories?.[catKey?.toUpperCase()] || [];
        const subsArray = Array.isArray(subsRaw)
          ? subsRaw
          : Object.values(subsRaw || {});
        const sub =
          subsArray.find(
            (s) =>
              String(s.id).toLowerCase() === String(subId || "").toLowerCase()
          ) || null;
        setSubcategoryMeta(sub);
      }

      return () => {
        mounted = false;
      };
    }

    loadCategoryLandingForMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subId]);

  // fetch articles when category/subId/page/activeFilter/selectedMonth/lang changes
  useEffect(() => {
    let mounted = true;
    async function loadArticles() {
      if (!category || !subId) return;

      setLoading(true);
      setError(null);
      console.log(
        `[ArticlesPage] fetch -> getArticlesList("${category}", "${subId}", page=${page}, limit=${limit}, month=${selectedMonth}, filter=${activeFilter}, lang=${lang})`
      );

      try {
        // build query object
        const qobj = { page, limit, lang };
        if (selectedMonth) qobj.month = selectedMonth;

        // if activeFilter is All -> no q, else send q as the filter label (backend will treat q as scope if matches)
        if (activeFilter && activeFilter !== "All") qobj.q = activeFilter;

        const res = await getArticlesList(category, subId, qobj);
        console.log("[ArticlesPage] getArticlesList response:", res);

        if (!mounted) return;

        if (res && res.success && res.data) {
          const items = (res.data.articles || []).map((a) => ({
            id: a._id || a.id,
            _id: a._id || a.id,
            title: a.title,
            excerpt: a.excerpt,
            body: a.body,
            date: a.date,
            image: a.image,
            scope: a.scope,
            language: a.language || a.lang || "en",
          }));

          const months = (res.data.months || []).map((m) => ({
            key: m.key,
            label: m.label,
            count: m.count,
          }));

          setArticlesData({
            articles: items,
            months,
            meta: res.data.meta || { total: items.length, page, limit },
          });
        } else {
          console.warn("[ArticlesPage] API returned no data — using fallback.");
          // fallback logic: find local CURRENT_AFFAIRS
          const catMeta =
            (CURRENT_AFFAIRS.categories || []).find(
              (c) => String(c.key).toLowerCase() === catKey
            ) || null;

          let subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey];
          if (!subsRaw)
            subsRaw =
              CURRENT_AFFAIRS.subcategories?.[catKey?.toUpperCase()] || [];
          const subsArray = Array.isArray(subsRaw)
            ? subsRaw
            : Object.values(subsRaw || {});
          const sub =
            subsArray.find(
              (s) =>
                String(s.id).toLowerCase() === String(subId || "").toLowerCase()
            ) || null;

          let arr = Array.isArray(sub?.articles) ? sub.articles : [];
          // filter by language when using fallback
          if (lang) {
            arr = arr.filter(
              (x) => !x.language || String(x.language) === String(lang)
            );
          }
          arr.sort(
            (x, y) =>
              (new Date(y.date).getTime() || 0) -
              (new Date(x.date).getTime() || 0)
          );
          setArticlesData({
            articles: arr.map((a) => ({
              id: a._id || a.id,
              _id: a._id || a.id,
              title: a.title,
              excerpt: a.excerpt,
              body: a.body,
              date: a.date,
              image: a.image,
              scope: a.scope,
              language: a.language || "en",
            })),
            months: [],
            meta: { total: arr.length, page, limit },
          });
        }
      } catch (err) {
        console.error("[ArticlesPage] getArticlesList failed:", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load articles");
        // fallback to local CURRENT_AFFAIRS similar to above
        const catMeta =
          (CURRENT_AFFAIRS.categories || []).find(
            (c) => String(c.key).toLowerCase() === catKey
          ) || null;

        let subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey];
        if (!subsRaw)
          subsRaw =
            CURRENT_AFFAIRS.subcategories?.[catKey?.toUpperCase()] || [];
        const subsArray = Array.isArray(subsRaw)
          ? subsRaw
          : Object.values(subsRaw || {});

        const sub =
          subsArray.find(
            (s) =>
              String(s.id).toLowerCase() === String(subId || "").toLowerCase()
          ) || null;

        let arr = Array.isArray(sub?.articles) ? sub.articles : [];
        if (lang) {
          arr = arr.filter(
            (x) => !x.language || String(x.language) === String(lang)
          );
        }
        arr.sort(
          (x, y) =>
            (new Date(y.date).getTime() || 0) -
            (new Date(x.date).getTime() || 0)
        );
        setArticlesData({
          articles: arr.map((a) => ({
            id: a._id || a.id,
            _id: a._id || a.id,
            title: a.title,
            excerpt: a.excerpt,
            body: a.body,
            date: a.date,
            image: a.image,
            scope: a.scope,
            language: a.language || "en",
          })),
          months: [],
          meta: { total: arr.length, page, limit },
        });
      } finally {
        if (mounted) setLoading(false);
        console.log("[ArticlesPage] loadArticles finished");
      }
    }

    loadArticles();

    return () => {
      mounted = false;
    };
  }, [category, subId, page, limit, selectedMonth, activeFilter, lang]); // include lang

  // not found early return
  const noSubFound =
    !loading && (!articlesData.articles || articlesData.articles.length === 0);

  if (noSubFound) {
    return (
      <div className={styles.wrapper}>
        <Header
          imageSrc={
            (subcategoryMeta &&
              (subcategoryMeta.logo || subcategoryMeta.hero)) ||
            categoryMeta?.hero ||
            "/images/currentaffairs-hero.png"
          }
          alt="Current Affairs"
        />
        <CategoryHeader
          title={
            (subcategoryMeta && subcategoryMeta.title) ||
            (categoryMeta && categoryMeta.title) ||
            "Current Affairs"
          }
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
        />
        <main className={styles.container}>
          <div className={styles.empty}>
            <h2>Not found</h2>
            <p>Requested subcategory not found or no articles available.</p>
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

  // helper: open article page (navigate + pass state)
  function openArticle(a) {
    console.log("[ArticlesPage] openArticle ->", a);
    const aid = a._id || a.id;
    navigate(`/currentaffairs/${category}/${subId}/${aid}`, {
      state: { article: a, sub: { id: subId } },
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

  // displayedArticles: already provided by fetch; just slice/copy
  const displayedArticles = (articlesData.articles || []).slice();

  // left widgets data (top N)
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

  // display title (use subcategory title if available)
  const displayTitle = selectedMonth
    ? `${new Date(selectedMonth + "-01").toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })} — Current Affairs`
    : `${
        (subcategoryMeta && subcategoryMeta.title) ||
        (categoryMeta && categoryMeta.title) ||
        "Today Latest Current Affairs"
      }`;

  // filters list to render above the widgets (labels used as q / scope)
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

  // handle month click: toggle selectedMonth and update URL
  function handleMonthClick(monthKey) {
    const newMonth = selectedMonth === monthKey ? null : monthKey;
    setSelectedMonth(newMonth);

    const basePath = `/currentaffairs/${category}/${subId}`;
    if (newMonth) {
      navigate(`${basePath}?month=${newMonth}`, { replace: false });
    } else {
      navigate(basePath, { replace: false });
    }

    setPage(1);
    const top = document.querySelector(`.${styles.container}`);
    if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // pagination
  const total = articlesData.meta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function goToPage(p) {
    const newPage = Math.max(1, Math.min(totalPages, p));
    if (newPage === page) return;
    setPage(newPage);
    const top = document.querySelector(`.${styles.container}`);
    if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Language selector UI (a small inline filter - sets lang and resets page)
  const languageOptions = [
    { key: "en", label: "English" },
    { key: "hi", label: "Hindi" },
    { key: "te", label: "Telugu" },
  ];

  return (
    <div className={styles.wrapper}>
      {/* HERO uses subcategory image if available */}
      <Header
        imageSrc={
          (subcategoryMeta && (subcategoryMeta.logo || subcategoryMeta.hero)) ||
          categoryMeta?.hero ||
          "/images/currentaffairs-hero.png"
        }
        alt={
          (subcategoryMeta && subcategoryMeta.title) ||
          (categoryMeta && categoryMeta.title) ||
          "Current Affairs"
        }
      />

      {/* CATEGORY HEADER */}
      <CategoryHeader
        title={`${
          (subcategoryMeta && subcategoryMeta.title) ||
          (categoryMeta && categoryMeta.title) ||
          subId
        } — Current Affairs`}
        languages={languageOptions}
        active={lang}
        onChange={(k) => {
          try {
            localStorage.setItem("bb_lang_code", k);
          } catch {}
          setLang(k);
          setPage(1); // reset page when language changes
          console.log("[ArticlesPage] language changed ->", k);
        }}
        showDivider
      />

      {/* LANGUAGE FILTER (also shows current language and lets users switch) */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          margin: "12px 24px 0 24px",
        }}
      >
        {languageOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => {
              setLang(opt.key);
              try {
                localStorage.setItem("bb_lang_code", opt.key);
              } catch {}
              setPage(1);
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: opt.key === lang ? "none" : "1px solid #ddd",
              background: opt.key === lang ? "#9fbdf0" : "#fff",
              cursor: "pointer",
            }}
            aria-pressed={opt.key === lang}
          >
            {opt.label}
          </button>
        ))}
      </div> */}

      {/* FILTERS (above the two widgets) */}
      <div
        className={styles.filterRow}
        role="tablist"
        aria-label="Article filters"
        style={{ marginTop: 8 }}
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
              onClick={() => {
                setActiveFilter(f);
                setPage(1);
                console.log("[ArticlesPage] filter changed ->", f);
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* TWO-WIDGET ROW */}
      <main className={styles.container}>
        <div className={styles.twoWidgetsRow}>
          {/* LEFT */}
          <div className={styles.leftWidget}>
            <CurrentAffairsCard
              title={displayTitle}
              color="#f2b6c3"
              topArticleNodes={leftTop4Components}
              style={{ width: "100%", maxWidth: "880px" }}
            >
              <div style={{ marginTop: 16 }}>
                {loading ? (
                  <div style={{ padding: 24, color: "#666" }}>
                    Loading articles...
                  </div>
                ) : (
                  <>
                    {displayedArticles.map((a) => (
                      <div key={a.id} style={{ marginBottom: 12 }}>
                        <CurrentAffairsArticleCard
                          compact={false}
                          image={a.image}
                          title={a.title}
                          description={a.excerpt || a.body}
                          dateTime={formatDateShort(a.date)}
                          category={a.scope}
                          onClick={() => openArticle(a)}
                        />
                      </div>
                    ))}

                    {/* pagination */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 16,
                      }}
                    >
                      <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page <= 1}
                      >
                        Prev
                      </button>
                      <div style={{ padding: "0 12px", alignSelf: "center" }}>
                        {page} / {totalPages}
                      </div>
                      <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </CurrentAffairsCard>
          </div>

          {/* RIGHT: monthly widget */}
          <aside className={styles.rightWidget}>
            <CurrentAffairsCard
              title="Monthly Current Affairs"
              items={
                articlesData.months && articlesData.months.length
                  ? articlesData.months.map((m) => ({
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

      {error && (
        <div style={{ color: "crimson", textAlign: "center", marginTop: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
