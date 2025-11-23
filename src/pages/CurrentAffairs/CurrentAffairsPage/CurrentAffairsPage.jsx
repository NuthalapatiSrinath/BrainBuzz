// src/pages/CurrentAffairsPage/CurrentAffairsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CurrentAffairsPage.module.css";
import CategoryCard from "../../../components/CategoryCard/CategoryCard";
import { getCategories } from "../../../api/currentAffairs";
import api from "../../../api/apiClient"; // used to resolve absolute URLs for logos

export default function CurrentAffairsPage() {
  const navigate = useNavigate();

  const STATIC_CATEGORIES = [
    {
      _id: "upsc",
      title: "UPSC",
      logo: "/images/upsc.png",
      slug: "upsc",
      description:
        "Explore structured UPSC current affairs, updates and exam-specific topics.",
    },
    {
      _id: "cgl",
      title: "CGL",
      logo: "/images/cgl.png",
      slug: "cgl",
      description:
        "Explore structured SSC CGL current affairs, updates and exam-specific topics.",
    },
    {
      _id: "chsl",
      title: "CHSL",
      logo: "/images/chsl.png",
      slug: "chsl",
      description:
        "Explore structured SSC CHSL current affairs, updates and exam-specific topics.",
    },
    {
      _id: "appsc",
      title: "APPSC",
      logo: "/images/appsc.png",
      slug: "appsc",
      description:
        "Explore structured APPSC current affairs, updates and exam-specific topics.",
    },
    {
      _id: "tspsc",
      title: "TSPSC",
      logo: "/images/tspsc.png",
      slug: "tspsc",
      description:
        "Explore structured TSPSC current affairs, updates and exam-specific topics.",
    },
    {
      _id: "ap_police_si",
      title: "AP POLICE SI",
      logo: "/images/appolice.png",
      slug: "ap_police_si",
      description: "Explore AP Police SI current affairs and updates.",
    },
    {
      _id: "ts_police_si",
      title: "TS POLICE SI",
      logo: "/images/tspolice.png",
      slug: "ts_police_si",
      description: "Explore TS Police SI current affairs and updates.",
    },
    {
      _id: "sbi",
      title: "State Bank of India PO",
      logo: "/images/sbi.png",
      slug: "sbi",
      description: "SBI PO related current affairs and exam focused updates.",
    },
    {
      _id: "ibps",
      title: "IBPS",
      logo: "/images/ibps.png",
      slug: "ibps",
      description: "IBPS related current affairs and exam updates.",
    },
    {
      _id: "railways",
      title: "Railways",
      logo: "/images/railway.png",
      slug: "railways",
      description: "Railways exam current affairs and updates.",
    },
    {
      _id: "others",
      title: "OTHERS…",
      logo: "/images/brainbuzz.png",
      slug: "others",
      description: "Other categories and miscellaneous current affairs.",
    },
  ];

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Small helper: accept slug string, object, or event
  const extractSlug = (payload) => {
    if (!payload) return null;
    // If called as event (e.g. SyntheticEvent), try to read dataset
    if (payload?.currentTarget?.dataset?.slug) {
      return payload.currentTarget.dataset.slug;
    }
    if (typeof payload === "string") return payload;
    if (typeof payload === "object")
      return payload.slug || payload.id || payload._id || null;
    return null;
  };

  // Card-level navigation (card body click) — accepts slug|string or object
  const handleCardClicked = (payload) => {
    const slug = extractSlug(payload) || "";
    const path = `/currentaffairs/${slug}`;
    console.log(
      "[CurrentAffairsPage] card clicked ->",
      path,
      "payload:",
      payload
    );
    navigate(path);
  };

  // Button-specific navigation (View Courses)
  const handleViewCoursesClicked = (payload) => {
    const slug = extractSlug(payload) || "";
    const path = `/currentaffairs/${slug}`;
    console.log(
      "[CurrentAffairsPage] View Courses clicked ->",
      path,
      "payload:",
      payload
    );
    navigate(path);
  };

  // "All Categories" card click -> show special "All categories" page
  const handleAllCategories = () => {
    console.log(
      "[CurrentAffairsPage] All Categories clicked -> /currentaffairs/all"
    );
    navigate("/currentaffairs/all");
  };

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      console.log("[CurrentAffairsPage] -> fetching categories from API...");
      setLoading(true);
      setError(null);

      try {
        const res = await getCategories();
        console.log(
          "[CurrentAffairsPage] API response for getCategories:",
          res
        );

        if (!mounted) return;

        const apiBase =
          (api && api.defaults && api.defaults.baseURL) ||
          window.location.origin;
        const base = String(apiBase).replace(/\/$/, "");

        if (
          res &&
          res.success &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          const normalized = res.data.map((c, idx) => {
            const id = c._id || c.id || c.slug || `cat_${idx}`;
            const title = c.title || c.name || c.label || "";
            const rawLogo =
              c.logo || c.image || c.icon || "/images/placeholder.png";
            const logo =
              typeof rawLogo === "string" && rawLogo.startsWith("/")
                ? `${base}${rawLogo}`
                : rawLogo;
            const description = c.description || c.excerpt || "";
            const slug =
              c.slug || id || (title || "").toLowerCase().replace(/\s+/g, "_");
            return { _id: id, title, logo, description, slug };
          });

          const allCard = {
            _id: "all_categories_card",
            title: "All Categories",

            description: "Browse every category in one place.",
            slug: "all",
          };

          setCategories([allCard, ...normalized]);
        } else {
          console.warn(
            "[CurrentAffairsPage] API returned empty categories, using static fallback."
          );

          const resolvedStatic = STATIC_CATEGORIES.map((c) => ({
            ...c,
            logo:
              typeof c.logo === "string" && c.logo.startsWith("/")
                ? `${base}${c.logo}`
                : c.logo,
          }));

          const allCard = {
            _id: "all_categories_card",
            title: "All Categories",
            logo:
              typeof "/images/all-categories.png" === "string" &&
              "/images/all-categories.png".startsWith("/")
                ? `${base}/images/all-categories.png`
                : "/images/all-categories.png",
            description: "Browse every category in one place.",
            slug: "all",
          };
          setCategories([allCard, ...resolvedStatic]);
        }
      } catch (err) {
        console.error("[CurrentAffairsPage] getCategories failed:", err);
        if (!mounted) return;
        setError(err?.message || "Failed to load categories");

        const apiBase =
          (api && api.defaults && api.defaults.baseURL) ||
          window.location.origin;
        const base = String(apiBase).replace(/\/$/, "");
        const resolvedStatic = STATIC_CATEGORIES.map((c) => ({
          ...c,
          logo:
            typeof c.logo === "string" && c.logo.startsWith("/")
              ? `${base}${c.logo}`
              : c.logo,
        }));

        const allCard = {
          _id: "all_categories_card",
          title: "All Categories",
          logo:
            typeof "/images/all-categories.png" === "string" &&
            "/images/all-categories.png".startsWith("/")
              ? `${base}/images/all-categories.png`
              : "/images/all-categories.png",
          description: "Browse every category in one place.",
          slug: "all",
        };
        setCategories([allCard, ...resolvedStatic]);
      } finally {
        if (mounted) setLoading(false);
        console.log("[CurrentAffairsPage] fetch finished");
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
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

      <section className={styles.categories}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Categories</h2>
          <span className={styles.headingUnderline}></span>
        </div>

        <p className={styles.subtitle}>
          Check the categories and please choose the category that you are
          striving to reach your desired career path in this competitive world.
        </p>

        {loading ? (
          <div style={{ padding: 24, color: "#666" }}>
            Loading categories...
          </div>
        ) : (
          <div className={styles.grid}>
            {categories.map((cat) => {
              // special case for All Categories card: make its card click open /currentaffairs/all
              if (cat._id === "all_categories_card") {
                return (
                  // ... inside render for all_categories_card
                  <CategoryCard
                    key={cat._id}
                    id={cat._id}
                    name={cat.title}
                    /* don't pass logo */
                    slug={cat.slug}
                    description={cat.description}
                    onClick={() => handleAllCategories()}
                    onButtonClick={() => handleAllCategories()}
                    buttonLabel="View All"
                    data-slug={cat.slug}
                    hideLogo={true} // <-- explicitly hide logo here
                  />
                );
              }

              // pass slug explicitly so CategoryCard internals don't have to provide it
              return (
                <CategoryCard
                  key={cat._id}
                  id={cat._id}
                  name={cat.title}
                  logo={cat.logo}
                  slug={cat.slug}
                  description={cat.description}
                  onClick={() => handleCardClicked(cat.slug)}
                  onButtonClick={() => handleViewCoursesClicked(cat.slug)}
                  buttonLabel="View Courses"
                  data-slug={cat.slug}
                />
              );
            })}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, color: "crimson" }}>
            Something went wrong loading categories. See console for details.
          </div>
        )}
      </section>
    </div>
  );
}
