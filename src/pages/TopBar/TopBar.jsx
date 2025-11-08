// src/components/Topbar/Topbar.jsx
import React, { useEffect, useRef, useState } from "react";
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import Dropdown from "../../components/Dropdown/Dropdown";
import TopbarPanel from "./TopbarPanel";
import styles from "./Topbar.module.css";

/* TOP_NAV & BOTTOM_NAV same as before */
const TOP_NAV = [
  { key: "home", label: "Home", href: "/" },
  {
    key: "follow",
    label: "Follow Us",
    dropdown: [
      { label: "Facebook", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
];

const BOTTOM_NAV = [
  {
    key: "current",
    label: "Current Affairs",
    dropdown: [
      {
        label: "UPSC",
        href: "/currentaffairs/upsc",
        icon: "/images/upsc.png",
      },
      {
        label: "CGL",
        href: "/currentaffairs/cgl",
        icon: "/images/cgl.png",
      },
      {
        label: "CHSL",
        href: "/currentaffairs/chsl",
        icon: "/images/chsl.png",
      },
      {
        label: "APPSC",
        href: "/currentaffairs/appsc",
        icon: "/images/appsc.png",
      },
      {
        label: "TSPSC",
        href: "/currentaffairs/tspsc",
        icon: "/images/tspsc.png",
      },
      {
        label: "AP Police SI",
        href: "/currentaffairs/appolice",
        icon: "/images/appolice.png",
      },
      {
        label: "TS Police SI",
        href: "/currentaffairs/tspolice",
        icon: "/images/tspolice.png",
      },
      {
        label: "State Bank of India",
        href: "/currentaffairs/sbi",
        icon: "/images/sbi.png",
      },
      {
        label: "IBPS",
        href: "/currentaffairs/ibps",
        icon: "/images/ibps.png",
      },
      {
        label: "Railways",
        href: "/currentaffairs/railways",
        icon: "/images/railway.png",
      },
    ],
  },
  {
    key: "quizzes",
    label: "Daily Quizzes",
    dropdown: [
      {
        label: "UPSC",
        href: "/dailyquizzes/upsc",
        icon: "/images/upsc.png",
      },
      {
        label: "CGL",
        href: "/dailyquizzes/cgl",
        icon: "/images/cgl.png",
      },
      {
        label: "CHSL",
        href: "/dailyquizzes/chsl",
        icon: "/images/chsl.png",
      },
      {
        label: "APPSC",
        href: "/dailyquizzes/appsc",
        icon: "/images/appsc.png",
      },
      {
        label: "TSPSC",
        href: "/dailyquizzes/tspsc",
        icon: "/images/tspsc.png",
      },
      {
        label: "AP Police SI",
        href: "/dailyquizzes/appolice",
        icon: "/images/appolice.png",
      },
      {
        label: "TS Police SI",
        href: "/dailyquizzes/tspolice",
        icon: "/images/tspolice.png",
      },
      {
        label: "State Bank of India",
        href: "/dailyquizzes/sbi",
        icon: "/images/sbi.png",
      },
      {
        label: "IBPS",
        href: "/dailyquizzes/ibps",
        icon: "/images/ibps.png",
      },
      {
        label: "Railways",
        href: "/dailyquizzes/railways",
        icon: "/images/railway.png",
      },
    ],
  },

  { key: "ebooks", label: "E-Books", href: "/ebooks" },
  {
    key: "prev",
    label: "Previous Question Papers",
    href: "/previous-papers", // <-- absolute (leading slash) to avoid relative-url bug
  },
  { key: "courses", label: "Online Courses", href: "#" },
  { key: "test", label: "Test Series", href: "#" },
  { key: "about", label: "About Us", href: "/aboutus" },
  { key: "contact", label: "Contact Us", href: "/contactus" },
];

function langCodeToLabel(code) {
  if (!code) return "English";
  const c = String(code).toLowerCase();
  if (c === "hi") return "Hindi";
  if (c === "te") return "Telugu";
  return "English";
}

/**
 * Normalize href strings so they are absolute paths (start with "/")
 * Leaves absolute URLs and hashes untouched.
 */
function normalizeHref(href) {
  if (!href) return "#";
  // keep external full urls and hashes untouched
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#")
  )
    return href;
  // ensure it starts with a single leading slash
  return href.startsWith("/") ? href : `/${href}`;
}

export default function Topbar() {
  // initialize language from localStorage (bb_lang_code set by translate helper)
  const initialLanguage = (() => {
    try {
      const code = localStorage.getItem("bb_lang_code");
      return langCodeToLabel(code);
    } catch (e) {
      return "English";
    }
  })();

  const [language, setLanguage] = useState(initialLanguage);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({}); // for mobile dropdowns

  // NEW: which panel is open (null | 'current' | 'quizzes')
  const [showPanelKey, setShowPanelKey] = useState(null);

  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setShowSearchModal(false);
        setShowPanelKey(null); // close panel when clicking outside
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setShowSearchModal(false);
        setMobileOpen(false);
        setShowPanelKey(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Sync language state on mount (in case page reloaded by translate helper)
  useEffect(() => {
    try {
      const code = localStorage.getItem("bb_lang_code");
      const label = langCodeToLabel(code);
      if (label !== language) setLanguage(label);
    } catch (e) {
      // ignore
    }
    // also listen for storage changes from other tabs
    function onStorage(e) {
      if (e.key === "bb_lang_code") {
        const label = langCodeToLabel(e.newValue);
        setLanguage(label);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once on mount

  function toggleMobile() {
    setMobileOpen((s) => !s);
    // close any open search modal or panel
    setShowSearchModal(false);
    setShowPanelKey(null);
  }

  function toggleAccordion(key) {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Helper to toggle panel open/close (if same key, close)
  function togglePanel(key) {
    setShowPanelKey((prev) => (prev === key ? null : key));
    // ensure search modal closed
    setShowSearchModal(false);
  }

  return (
    <>
      <header className={styles.topbar} ref={rootRef}>
        <div className={styles.container}>
          {/* LEFT: logo + mobile hamburger */}
          <div className={styles.left}>
            <div className={styles.logoAndHam}>
              {/* MOBILE: hamburger first */}
              <button
                className={`${styles.hamburger} ${
                  mobileOpen ? styles.open : ""
                }`}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={toggleMobile}
                type="button"
              >
                <span className={styles.hamBar} />
                <span className={styles.hamBar} />
                <span className={styles.hamBar} />
              </button>

              {/* logo next */}
              <div className={styles.logoWrap}>
                <img src="/favicon.svg" alt="logo" className={styles.logo} />
              </div>
            </div>
          </div>

          {/* CENTER: desktop navs (unchanged) */}
          <div className={styles.center}>
            <div className={styles.topRow}>
              <nav className={styles.topNav} aria-label="Primary navigation">
                <ul className={styles.topNavList}>
                  {TOP_NAV.map((it) => (
                    <li key={it.key} className={styles.topNavItem}>
                      {it.dropdown ? (
                        <Dropdown
                          label={it.label}
                          // pass items with normalized hrefs
                          items={(it.dropdown || []).map((d) => ({
                            ...d,
                            href: normalizeHref(d.href),
                          }))}
                          align="center"
                        />
                      ) : (
                        <a
                          href={normalizeHref(it.href)}
                          className={styles.topLink}
                        >
                          {it.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className={styles.badgesGroup}>
                <img
                  src="/googleplaystore.svg"
                  alt="Google Play"
                  className={styles.badge}
                />
                <img
                  src="/appstore.svg"
                  alt="App Store"
                  className={styles.badge}
                />

                <button
                  className={styles.searchBtn}
                  aria-label="Open search"
                  onClick={() => setShowSearchModal(true)}
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M21 21l-4.35-4.35"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="11"
                      cy="11"
                      r="6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </button>

                <div className={styles.langWrapper}>
                  <LanguageSelector
                    language={language}
                    onChange={setLanguage}
                  />
                </div>
              </div>
            </div>

            <div className={styles.bottomRow}>
              <nav
                className={styles.bottomNav}
                aria-label="Secondary navigation"
              >
                <ul className={styles.bottomNavList}>
                  {BOTTOM_NAV.map((it) => (
                    <li key={it.key} className={styles.bottomNavItem}>
                      {it.dropdown ? (
                        // For current/quizzes we render a custom label + caret toggle that opens TopbarPanel on desktop.
                        it.key === "current" || it.key === "quizzes" ? (
                          <div className={styles.panelTriggerWrap}>
                            {/* parent link */}
                            <a
                              href={
                                it.key === "current"
                                  ? normalizeHref("/currentaffairs")
                                  : normalizeHref("/dailyquizzes")
                              }
                              className={styles.bottomLink}
                            >
                              {it.label}
                            </a>

                            {/* caret/toggle (desktop) */}
                            <button
                              type="button"
                              aria-haspopup="dialog"
                              aria-expanded={showPanelKey === it.key}
                              onClick={(e) => {
                                e.preventDefault();
                                togglePanel(it.key);
                              }}
                              className={styles.panelToggleBtn}
                              title={`Open ${it.label} panel`}
                            >
                              {/* caret icon could go here */}
                            </button>

                            {/* Panel (desktop-only styles are inside TopbarPanel.module.css) */}
                            {showPanelKey === it.key && (
                              <TopbarPanel
                                type={it.key}
                                items={(it.dropdown || []).map((d) => ({
                                  ...d,
                                  href: normalizeHref(d.href),
                                }))}
                                onClose={() => setShowPanelKey(null)}
                              />
                            )}
                          </div>
                        ) : (
                          <Dropdown
                            label={it.label}
                            items={(it.dropdown || []).map((d) => ({
                              ...d,
                              href: normalizeHref(d.href),
                            }))}
                            align="center"
                          />
                        )
                      ) : (
                        <a
                          href={normalizeHref(it.href)}
                          className={styles.bottomLink}
                        >
                          {it.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.langAndToggle}></div>
          </div>
        </div>
      </header>

      {/* Mobile menu (renders only on mobile; CSS controls visibility) */}
      {mobileOpen && (
        <div
          className={styles.mobileMenuWrap}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div
            className={styles.mobileMenuBackdrop}
            onClick={() => setMobileOpen(false)}
          />

          <aside
            className={`${styles.mobileMenuPanel} ${
              mobileOpen ? styles.open : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  className={styles.logoWrap}
                  style={{ width: 48, height: 48 }}
                >
                  <img src="/favicon.svg" alt="logo" className={styles.logo} />
                </div>
                <div style={{ fontWeight: 700 }}>Menu</div>
              </div>

              <button
                className={`${styles.hamburger} ${
                  mobileOpen ? styles.open : ""
                }`}
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                <span className={styles.hamBar} />
                <span className={styles.hamBar} />
                <span className={styles.hamBar} />
              </button>
            </div>

            {/* Search row inside mobile menu */}
            <div>
              <button
                className={styles.mobileAccBtn}
                type="button"
                onClick={() => {
                  setShowSearchModal(true);
                  setMobileOpen(false);
                }}
              >
                <span>Search Categories</span>
                <span aria-hidden>›</span>
              </button>
            </div>

            {/* Top nav items (with mobile accordion for dropdowns) */}
            <div className={styles.mobileListWrap}>
              <ul className={styles.mobileMenuList}>
                {TOP_NAV.map((it) =>
                  it.dropdown ? (
                    <li key={it.key}>
                      <button
                        className={styles.mobileAccBtn}
                        onClick={() => toggleAccordion(it.key)}
                        aria-expanded={!!openAccordions[it.key]}
                      >
                        <span>{it.label}</span>
                        <span>{openAccordions[it.key] ? "−" : "+"}</span>
                      </button>
                      <div
                        className={`${styles.mobileAccBody} ${
                          openAccordions[it.key] ? styles.open : ""
                        }`}
                      >
                        {it.dropdown.map((d, idx) => (
                          <a
                            key={idx}
                            href={normalizeHref(d.href)}
                            className={styles.mobileAccItem}
                            onClick={() => setMobileOpen(false)}
                          >
                            {d.label}
                          </a>
                        ))}
                      </div>
                    </li>
                  ) : (
                    <li key={it.key}>
                      <a
                        href={normalizeHref(it.href)}
                        onClick={() => setMobileOpen(false)}
                      >
                        {it.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <hr />

            {/* Bottom nav */}
            <div>
              <ul className={styles.mobileMenuList}>
                {BOTTOM_NAV.map((it) =>
                  it.dropdown ? (
                    <li key={it.key}>
                      <div className={styles.mobileBottomItem}>
                        {/* parent link (single visible label) */}
                        <a
                          href={
                            it.key === "current"
                              ? normalizeHref("/currentaffairs")
                              : it.key === "quizzes"
                              ? normalizeHref("/dailyquizzes")
                              : normalizeHref(it.href)
                          }
                          className={styles.mobileAccItem}
                          onClick={() => setMobileOpen(false)}
                        >
                          {it.label}
                        </a>

                        {/* expand/collapse control (separate, so label isn't duplicated) */}
                        <button
                          className={styles.mobileAccToggle}
                          onClick={() => toggleAccordion(it.key)}
                          aria-expanded={!!openAccordions[it.key]}
                          aria-label={
                            openAccordions[it.key]
                              ? `Collapse ${it.label}`
                              : `Expand ${it.label}`
                          }
                        >
                          {openAccordions[it.key] ? "−" : "+"}
                        </button>
                      </div>

                      <div
                        className={`${styles.mobileAccBody} ${
                          openAccordions[it.key] ? styles.open : ""
                        }`}
                      >
                        {(it.dropdown || []).map((d, idx) => (
                          <a
                            key={idx}
                            href={normalizeHref(d.href)}
                            className={styles.mobileAccItem}
                            onClick={() => setMobileOpen(false)}
                          >
                            {d.label}
                          </a>
                        ))}
                      </div>
                    </li>
                  ) : (
                    <li key={it.key}>
                      <a
                        href={normalizeHref(it.href)}
                        onClick={() => setMobileOpen(false)}
                      >
                        {it.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <hr />

            {/* badges, language */}
            <div className={styles.mobileBadgesRow}>
              <img
                src="/googleplaystore.svg"
                alt="Google Play"
                className={styles.badge}
                style={{ height: 44 }}
              />
              <img
                src="/appstore.svg"
                alt="App Store"
                className={styles.badge}
                style={{ height: 44 }}
              />
              <div style={{ marginLeft: "auto" }}>
                <LanguageSelector language={language} onChange={setLanguage} />
              </div>
            </div>

            {/* bottom links */}
            <div className={styles.mobileBottomLinks}>
              <a
                href={normalizeHref("/aboutus")}
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </a>
              <a
                href={normalizeHref("/contactus")}
                onClick={() => setMobileOpen(false)}
              >
                Contact Us
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Search modal (desktop behavior unchanged) */}
      {showSearchModal && (
        <div
          className={styles.searchOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Search categories"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className={styles.searchModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              aria-label="Close search"
              onClick={() => setShowSearchModal(false)}
            >
              ×
            </button>
            <div className={styles.modalContent}>
              <div className={styles.modalTitle}>Search Categories</div>
              <div className={styles.modalSearchRow}>
                <svg
                  className={styles.modalIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <input
                  autoFocus
                  className={styles.modalInput}
                  placeholder="Search Categories"
                  aria-label="Search categories"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
