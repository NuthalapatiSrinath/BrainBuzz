// src/pages/CategoryPublications/CategoryPublications.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import CategoryHeader from "../../components/CategoryHeader/CategoryHeader";
import DropdownAllwhere from "../../components/DropdownAllwhere/DropdownAllwhere";
import CurrentAffairsCard from "../../components/CurrentAffairsCard/CurrentAffairsCard";
import Button from "../../components/Button/Button";
import PreviousPapersCard from "../../components/PreviousPapersCard/PreviousPapersCard";
import styles from "./CategoryPublications.module.css";
import PREVIOUS_PAPERS from "../../data/previousPapers"; // single source

function safeYearFromDateString(d) {
  if (!d) return null;
  if (/^\d{4}$/.test(String(d))) return String(d);
  const parsed = Date.parse(d);
  if (Number.isNaN(parsed)) return null;
  return String(new Date(parsed).getFullYear());
}

export default function CategoryPublications() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // support both param names
  const mainCategory = params.mainCategory || params.category;
  const subCategory = params.subCategory || params.subcategory;

  // local filter controls (these change when user picks dropdowns)
  const [exam, setExam] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");

  // results shown on page (only updated when Search clicked)
  const [results, setResults] = useState([]);

  // source data for main/sub
  const dataCategory = useMemo(() => {
    if (!mainCategory) return null;
    return PREVIOUS_PAPERS[mainCategory] || null;
  }, [mainCategory]);

  const subcatObj = useMemo(() => {
    if (!dataCategory || !subCategory) return null;
    return dataCategory.subcategories?.[subCategory] || null;
  }, [dataCategory, subCategory]);

  const papers = subcatObj?.papers || [];

  // dropdown options derived from source
  const examOptions = useMemo(() => {
    if (!mainCategory) return [];
    return [{ value: mainCategory, label: (mainCategory || "").toUpperCase() }];
  }, [mainCategory]);

  const yearOptions = useMemo(() => {
    const years = new Set();
    for (const p of papers) {
      if (p.year) years.add(String(p.year));
      else {
        const y = safeYearFromDateString(p.publishedDate);
        if (y) years.add(y);
      }
    }
    const arr = Array.from(years).sort((a, b) => Number(b) - Number(a));
    if (arr.length === 0) return [{ value: "all", label: "All" }];
    return [
      { value: "all", label: "All" },
      ...arr.map((y) => ({ value: y, label: y })),
    ];
  }, [papers]);

  const subjectOptions = useMemo(() => {
    const subs = new Set();
    for (const p of papers) if (p.subject) subs.add(p.subject);
    if (subs.size === 0)
      return [
        { value: "all", label: "All" },
        { value: "general", label: "General" },
      ];
    return [
      { value: "all", label: "All" },
      ...Array.from(subs).map((s) => ({ value: s, label: s })),
    ];
  }, [papers]);

  // default results load when category changes
  useEffect(() => {
    setResults(papers.slice());
    // reset filters (optional)
    setExam("");
    setYear("");
    setSubject("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategory, subCategory, JSON.stringify(papers)]);

  // compute filtered set when Search clicked
  function applyFilters() {
    let out = papers.slice();
    if (exam && exam !== "all")
      out = out.filter((p) => !exam || (p.exam ? p.exam === exam : true));
    if (year && year !== "all")
      out = out.filter(
        (p) =>
          String(p.year || safeYearFromDateString(p.publishedDate)) ===
          String(year)
      );
    if (subject && subject !== "all")
      out = out.filter((p) => (p.subject || "general") === subject);
    setResults(out);
  }

  // base for detail page navigation e.g. /previous-papers/upsc/prelims
  const baseForDetail = useMemo(() => {
    const segs = (location.pathname || "").split("/").filter(Boolean);
    if (segs.length >= 3) return "/" + segs.slice(0, 3).join("/");
    if (mainCategory && subCategory)
      return `/previous-papers/${mainCategory}/${subCategory}`;
    return location.pathname;
  }, [location.pathname, mainCategory, subCategory]);

  const latestItems = dataCategory?.latest || [
    { id: 1, title: "No updates", href: "#" },
  ];
  const headerImage = dataCategory?.hero || "/images/default-hero.png";

  return (
    <div className={styles.pageWrap}>
      <Header
        imageSrc={headerImage}
        alt={(mainCategory || "Category").toUpperCase()}
      />
      <CategoryHeader
        title={`${(subCategory || "")
          .toString()
          .toUpperCase()} - Previous Question Papers`}
        active="English"
      />

      <div className={styles.contentContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.filterCard}>
            {/* Row 1: two half-width dropdowns */}
            <div className={styles.filtersRow}>
              <DropdownAllwhere
                label="Exam"
                options={examOptions}
                value={exam}
                onChange={(v) => setExam(v)}
              />
              <DropdownAllwhere
                label="Year"
                options={yearOptions}
                value={year}
                onChange={(v) => setYear(v)}
              />
            </div>

            {/* Row 2: left dropdown + Search button aligned to right half start */}
            <div className={`${styles.filtersRow} ${styles.filtersRowBottom}`}>
              <DropdownAllwhere
                label="Subject"
                options={subjectOptions}
                value={subject}
                onChange={(v) => setSubject(v)}
              />
              {/* The Button will be placed at start of the right half */}
              <div>
                <Button label="Search" onClick={applyFilters} />
              </div>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {results && results.length > 0 ? (
              results.map((p) => (
                <PreviousPapersCard
                  key={p.id}
                  paper={p}
                  href={`${baseForDetail}/${p.id}`} // normal link navigation
                  className={styles.cardOverride}
                />
              ))
            ) : (
              <div className={styles.noPapers}>
                <p>
                  No papers found for{" "}
                  {subCategory ? subCategory.toUpperCase() : "this category"}.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className={styles.rightColumn}>
          <CurrentAffairsCard
            title="Latest"
            items={latestItems}
            color="#9DE5E9"
          />
        </aside>
      </div>
    </div>
  );
}
