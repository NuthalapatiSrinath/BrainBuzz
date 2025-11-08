// src/pages/UPSC/UPSCPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import SearchBar from "../../../components/SearchBar/SearchBar";

import styles from "./UPSCPage.module.css";


export default function UPSCPage() {
  const navigate = useNavigate();

  // sample tiles (use your real images under /public/images/sub/...)
  const allTiles = [
    {
      id: "gpsc",
      title: "GPSC",
      logo: "/images/sub/gpsc.png",
      path: "/currentaffairs/upsc/gpsc",
    },
    {
      id: "ias",
      title: "IAS Exam",
      logo: "/images/sub/ias.png",
      path: "/currentaffairs/upsc/ias",
    },
    {
      id: "ifs",
      title: "IFS",
      logo: "/images/sub/ifs.png",
      path: "/currentaffairs/upsc/ifs",
    },
  ];

  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");

  const tiles = useMemo(() => {
    if (!query) return allTiles;
    const q = query.trim().toLowerCase();
    return allTiles.filter((t) => t.title.toLowerCase().includes(q));
  }, [query, allTiles]);

  return (
    <div className={styles.pageWrapper}>
      {/* hero with centered logo */}
      <Header imageSrc="/images/upsc.png" alt="UPSC Logo" />

      {/* thin white strip with title & language pills */}
      <CategoryHeader
        title="Master UPSC Course"
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={lang}
        onChange={(k) => setLang(k)}
        showDivider={false}
      />

      {/* Subcategories */}
      <section className={styles.subSection}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Sub Categories</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <p className={styles.subtitle}>
          Explore our carefully curated courses and unlock valuable knowledge
          that empowers your personal and professional growth
        </p>

        <div className={styles.searchRow}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search Categories"
          />
        </div>

        <div className={styles.grid}>
          {tiles.map((t) => (
            <button
              key={t.id}
              className={styles.card}
              onClick={() => navigate(t.path)}
              aria-label={`Open ${t.title}`}
            >
              <img src={t.logo} alt={t.title} className={styles.cardImage} />
              <div className={styles.cardTitle}>{t.title}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
