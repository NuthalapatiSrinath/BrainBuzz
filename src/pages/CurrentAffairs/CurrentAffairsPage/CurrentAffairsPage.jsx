import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ navigation hook
import styles from "./CurrentAffairsPage.module.css";

export default function CurrentAffairsPage() {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "UPSC", logo: "/images/upsc.png", slug: "upsc" },
    { id: 2, name: "CGL", logo: "/images/cgl.png", slug: "cgl" },
    { id: 3, name: "CHSL", logo: "/images/chsl.png", slug: "chsl" },
    { id: 4, name: "APPSC", logo: "/images/appsc.png", slug: "appsc" },
    { id: 5, name: "TSPSC", logo: "/images/tspsc.png", slug: "tspsc" },
    {
      id: 6,
      name: "AP POLICE SI",
      logo: "/images/appolice.png",
      slug: "appolice",
    },
    {
      id: 7,
      name: "TS POLICE SI",
      logo: "/images/tspolice.png",
      slug: "tspolice",
    },
    {
      id: 8,
      name: "State Bank of India PO",
      logo: "/images/sbi.png",
      slug: "sbi",
    },
    { id: 9, name: "IBPS", logo: "/images/ibps.png", slug: "ibps" },
    { id: 10, name: "Railways", logo: "/images/railway.png", slug: "railways" },
    { id: 11, name: "OTHERS…", logo: "/images/brainbuzz.png", slug: "others" },
  ];

  // ✅ Navigate to subcategory page
  const handleNavigate = (slug) => {
    navigate(`/currentaffairs/${slug}`);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextBox}>
            <h1 className={styles.heroTitle}>Current Affairs</h1>
          </div>

          <div className={styles.heroImageBox}>
            <img
              src="/images/current-affairs-banner.png"
              alt="Current Affairs"
              className={styles.heroImage}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={styles.categories}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Categories</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <p className={styles.subtitle}>
          Check the categories and please choose the category that you are
          striving to reach your desired career path in this competitive world.
        </p>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={styles.card}
              onClick={() => handleNavigate(cat.slug)} // ✅ Click to navigate
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleNavigate(cat.slug);
              }}
              aria-label={`Go to ${cat.name} current affairs`}
            >
              <img src={cat.logo} alt={cat.name} className={styles.cardImage} />
              <div className={styles.cardTitle}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
