// src/pages/QuizzesListPage/QuizzesListPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import QuizzesListCard from "../../../components/QuizzesListCard/QuizzesListCard";
import styles from "./QuizzesListPage.module.css";
import DAILY_QUIZZES from "../../../data/dailyQuizzes"; // your data file

// Helper: month-year key from date string
function monthYearKey(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const opts = { month: "long" };
  const month = d.toLocaleString("en-US", opts);
  return `${month} - ${d.getFullYear()}`;
}

// Helper: chunk array into `n` groups balanced
function chunkIntoGroups(arr, n = 4) {
  const res = Array.from({ length: n }, () => []);
  if (!arr || arr.length === 0) return res;
  const base = Math.floor(arr.length / n);
  let remainder = arr.length % n;
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const take = base + (remainder > 0 ? 1 : 0);
    remainder = Math.max(0, remainder - 1);
    if (take > 0) {
      res[i] = arr.slice(idx, idx + take);
      idx += take;
    } else {
      res[i] = [];
    }
  }
  return res;
}

export default function QuizzesListPage() {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const catKey = (category || "").toLowerCase();

  // find category meta
  const categoryMeta = useMemo(() => {
    const cats = DAILY_QUIZZES?.categories || [];
    return cats.find((c) => String(c.key).toLowerCase() === catKey) || null;
  }, [catKey]);

  // find quizzes array to render:
  // if subcategory provided -> pick that subcategory's quizzes
  // else -> flatten all subcategories of this category
  const quizzesList = useMemo(() => {
    const subMap = (DAILY_QUIZZES.subcategories || {})[catKey] || [];

    if (subcategory) {
      const subKey = String(subcategory).toLowerCase();
      const subObj = subMap.find((s) => String(s.id).toLowerCase() === subKey);

      return (
        subObj && Array.isArray(subObj.quizzes) ? subObj.quizzes : []
      ).map((q) => {
        const quizId =
          q.id || `${q.title || "q"}-${Math.random().toString(36).slice(2, 7)}`;
        // build an internal href so clicking navigates
        const href = `/dailyquizzes/${catKey}/${subKey}/${quizId}`;
        return {
          ...q,
          id: quizId,
          title: q.title || "Untitled Quiz",
          date: q.date || q.publishedAt || null,
          href,
        };
      });
    }

    // no subcategory: flatten all subcategories of this category
    const flat = [];
    for (const s of subMap) {
      const subId = String(s.id || "").toLowerCase();
      const items = (s.quizzes || []).map((q) => {
        const quizId =
          q.id || `${subId || "sub"}-${Math.random().toString(36).slice(2, 7)}`;
        const href = `/dailyquizzes/${catKey}/${subId}/${quizId}`;
        return {
          ...q,
          id: quizId,
          title: q.title || "Untitled Quiz",
          date: q.date || q.publishedAt || null,
          href,
        };
      });
      flat.push(...items);
    }
    return flat;
  }, [catKey, subcategory]);

  // If quizzes have dates -> group by month-year (desc). Else chunk into up to 4 groups.
  const groups = useMemo(() => {
    if (!quizzesList || quizzesList.length === 0) return [];

    const hasDate = quizzesList.some((q) => !!q.date);
    if (hasDate) {
      const map = new Map();
      for (const q of quizzesList) {
        const key = monthYearKey(q.date) || "Unknown";
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(q);
      }
      // to sort groups by latest date in group (descending)
      const pairs = Array.from(map.entries()).map(([k, items]) => {
        const sortDate = items.reduce(
          (acc, it) => Math.max(acc, new Date(it.date || 0).getTime()),
          0
        );
        // sort items descending by date inside the group
        items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        return { key: k, items, sortDate };
      });
      pairs.sort((a, b) => b.sortDate - a.sortDate);
      // take up to 4 most recent groups (like your screenshot)
      return pairs.slice(0, 4);
    }

    // no dates: chunk the quizzes array into 4 roughly equal groups and label them
    const chunks = chunkIntoGroups(quizzesList, 4);
    return chunks
      .map((items, i) => ({
        key: `${(
          subcategory ||
          categoryMeta?.title ||
          catKey ||
          "Quizzes"
        ).toUpperCase()} - Part ${i + 1}`,
        items,
      }))
      .filter((g) => g.items && g.items.length > 0); // remove empty groups
  }, [quizzesList, categoryMeta, category, subcategory]);

  const headerTitle = categoryMeta?.title
    ? `${categoryMeta.title}${
        subcategory ? ` - ${String(subcategory).toUpperCase()}` : ""
      }`
    : "Daily Quizzes";

  const hero = categoryMeta?.hero || "/images/daily-quizzes-banner.png";

  // header colors (same palette used earlier)
  const headerColors = ["#F6B0C4", "#9AD8C8", "#F6D48A", "#9EC6E3"];

  // navigation handler for a quiz item
  const handleNavigate = (href, item = null) => {
    if (!href && item && item.href) href = item.href;
    if (!href) return;
    if (href.startsWith("/")) {
      // pass item (full quiz object) in navigation state so detail page can use it
      if (item) {
        const stateToPass = item.__raw ? item.__raw : item;
        navigate(href, { state: stateToPass });
      } else {
        navigate(href);
      }
    } else {
      window.open(href, "_blank", "noopener");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {hero && <Header imageSrc={hero} alt={headerTitle} />}

      <CategoryHeader
        title={headerTitle}
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

      <main className={styles.container}>
        <div className={styles.grid}>
          {groups.length > 0 ? (
            groups.map((g, idx) => (
              <QuizzesListCard
                key={g.key}
                title={g.key}
                items={g.items.map((it) => ({
                  id: it.id,
                  title: it.title,
                  href: it.href || it.url || null,
                  onClick: it.onClick || null,
                  // include the original quiz object so it can be passed via state
                  __raw: it,
                }))}
                color={headerColors[idx % headerColors.length]}
                boxShadow="0 6px 18px rgba(0,0,0,0.06)"
                logo={categoryMeta?.logo || "/images/lion.png"}
                // pass both href and the item object to handleNavigate
                onNavigate={(href, item) => handleNavigate(href, item)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              No quizzes found for this category/subcategory.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
