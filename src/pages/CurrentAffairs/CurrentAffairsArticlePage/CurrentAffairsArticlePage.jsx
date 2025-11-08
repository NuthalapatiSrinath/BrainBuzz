import React, { useMemo, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import CURRENT_AFFAIRS from "../../../data/currentAffairs";
import styles from "./CurrentAffairsArticlePage.module.css";

/**
 * Article detail page:
 * route: /currentaffairs/:category/:subId/:articleId
 */
export default function CurrentAffairsArticlePage() {
  const { category, subId, articleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Scroll to top whenever this page mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, []);

  // resolve article, subcategory, categoryMeta (unconditionally, using useMemo)
  const { article, subcategory, categoryMeta, months, recentPosts } =
    useMemo(() => {
      const state = location.state || {};
      let resolvedArticle = state.article || null;
      let resolvedSub = state.sub || null;

      const catKey = String(category || "").toLowerCase();

      // find category meta from top-level categories array
      const catMeta =
        (CURRENT_AFFAIRS.categories || []).find(
          (c) => String(c.key).toLowerCase() === catKey
        ) || null;

      // get subcategories shape (array or object)
      let subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey] || [];
      if (!subsRaw)
        subsRaw = CURRENT_AFFAIRS.subcategories?.[catKey?.toUpperCase()] || [];
      const subsArray = Array.isArray(subsRaw)
        ? subsRaw
        : Object.values(subsRaw || {});

      if (!resolvedSub) {
        resolvedSub =
          subsArray.find(
            (s) =>
              String(s.id).toLowerCase() === String(subId || "").toLowerCase()
          ) || null;
      }

      if (
        !resolvedArticle &&
        resolvedSub &&
        Array.isArray(resolvedSub.articles)
      ) {
        resolvedArticle =
          resolvedSub.articles.find(
            (a) => String(a.id) === String(articleId)
          ) || null;
      }

      // build months (YYYY-MM) with count and label (newest first)
      const mkMap = new Map();
      const arr = Array.isArray(resolvedSub?.articles)
        ? resolvedSub.articles
        : [];
      for (const a of arr) {
        const dt = a.date ? new Date(a.date) : null;
        const mk =
          dt && !Number.isNaN(dt.getTime())
            ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
                2,
                "0"
              )}`
            : "unknown";
        if (!mkMap.has(mk)) {
          const label =
            mk === "unknown"
              ? "Unknown"
              : dt.toLocaleString("en-US", { month: "long", year: "numeric" });
          mkMap.set(mk, { key: mk, label, count: 0 });
        }
        mkMap.get(mk).count += 1;
      }
      const monthsArr = Array.from(mkMap.values()).sort((a, b) => {
        if (a.key === "unknown") return 1;
        if (b.key === "unknown") return -1;
        return b.key < a.key ? 1 : -1; // descending
      });

      // recent posts: pick other articles in same subcategory, newest first (exclude current article)
      const recent = Array.isArray(arr)
        ? arr
            .filter((a) => String(a.id) !== String(articleId))
            .slice()
            .sort((x, y) => {
              const dx = x.date ? new Date(x.date).getTime() : 0;
              const dy = y.date ? new Date(y.date).getTime() : 0;
              return dy - dx;
            })
            .slice(0, 8) // limit
        : [];

      return {
        article: resolvedArticle,
        subcategory: resolvedSub,
        categoryMeta: catMeta,
        months: monthsArr,
        recentPosts: recent,
      };
    }, [category, subId, articleId, location.state]);

  // not found
  if (!article) {
    return (
      <div className={styles.wrapper}>
        <Header
          imageSrc={categoryMeta?.hero || "/images/currentaffairs-hero.png"}
          alt="Current Affairs"
        />
        <main className={styles.container}>
          <div className={styles.empty}>
            <h2>Article not found</h2>
            <p>We couldn't find the requested article.</p>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              Go back
            </button>
          </div>
        </main>
      </div>
    );
  }

  // navigate to month listing (articles page) with query param month=YYYY-MM
  function goToMonth(monthKey) {
    navigate(`/currentaffairs/${category}/${subId}?month=${monthKey}`);
  }

  // go to another article
  function openArticle(a) {
    navigate(`/currentaffairs/${category}/${subId}/${a.id}`, {
      state: { article: a, sub: subcategory },
    });
  }

  // format date nicely
  function formatDate(d) {
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

  return (
    <div className={styles.wrapper}>
      {categoryMeta?.hero && (
        <Header
          imageSrc={categoryMeta.hero}
          alt={categoryMeta.title || "Category"}
        />
      )}

      <CategoryHeader
        title={
          categoryMeta?.title ||
          (subcategory && subcategory.title) ||
          "Current Affairs"
        }
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={localStorage.getItem("bb_lang_code") || "en"}
        onChange={() => {}}
        showDivider
      />

      <main className={styles.container}>
        <article className={styles.article}>
          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.metaRow}>
            <span className={styles.date}>{formatDate(article.date)}</span>
            {article.scope && (
              <span className={styles.scope}>{article.scope}</span>
            )}
          </div>

          {article.image && (
            <div className={styles.heroImageWrap}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.heroImage}
              />
            </div>
          )}

          <div className={styles.content}>
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : article.body ? (
              <div>{article.body}</div>
            ) : article.excerpt ? (
              <p>{article.excerpt}</p>
            ) : article.pdfUrl ? (
              <p>
                This article is available as a PDF.{" "}
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open PDF
                </a>
              </p>
            ) : (
              <p>No article body available.</p>
            )}
          </div>
        </article>

        <aside className={styles.sidebar}>
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>Monthly Current Affairs</div>
            <ul className={styles.monthList}>
              {months.length === 0 && (
                <li className={styles.monthItem}>No monthly items</li>
              )}
              {months.map((m) => (
                <li key={m.key} className={styles.monthItem}>
                  <button
                    type="button"
                    className={styles.monthLink}
                    onClick={() => goToMonth(m.key)}
                  >
                    <span className={styles.chev}>&#8250;</span>
                    <span>{m.label}</span>
                    <span className={styles.monthCount}>{m.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.widgetCard}>
            <div
              className={styles.widgetHeader}
              style={{ background: "#eecf9b" }}
            >
              Recent Posts
            </div>
            <ul className={styles.recentList}>
              {recentPosts.length === 0 && (
                <li className={styles.recentItem}>No recent posts</li>
              )}
              {recentPosts.map((p) => (
                <li key={p.id} className={styles.recentItem}>
                  <button
                    type="button"
                    className={styles.recentLink}
                    onClick={() => openArticle(p)}
                  >
                    <span className={styles.chev}>&#8250;</span>
                    <span>{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
