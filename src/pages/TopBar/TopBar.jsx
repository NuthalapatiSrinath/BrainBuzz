import React, { useEffect, useRef, useState } from "react";
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";
import Dropdown from "../../components/Dropdown/Dropdown";
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
      { label: "UPSC", href: "/currentaffairs/upsc" },
      { label: "CGL", href: "/currentaffairs/cgl" },
      { label: "CHSL", href: "currentaffairs/chsl" },

      { label: "APPSC", href: "/currentaffairs/appsc" },
      { label: "TSPSC", href: "currentaffairs/tspsc" },
      { label: "AP Police SI", href: "/currentaffairs/appolice" },
      { label: "TS Police SI", href: "/currentaffairs/tspolice" },
      { label: "State Bank of India", href: "currentaffairs/sbi" },
      { label: "IBPS", href: "/currentaffairs/ibps" },
      { label: "Railways", href: "currentaffairs/railways" },
    ],
  },
  {
    key: "quizzes",
    label: "Daily Quizzes",
    dropdown: [
      { label: "UPSC", href: "/dailyquizzes/upsc" },
      { label: "CGL", href: "/dailyquizzes/cgl" },
      { label: "CHSL", href: "dailyquizzes/chsl" },

      { label: "APPSC", href: "/dailyquizzes/appsc" },
      { label: "TSPSC", href: "/dailyquizzes/tspsc" },
      { label: "AP Police SI", href: "/dailyquizzes/appolice" },
      { label: "TS Police SI", href: "/dailyquizzes/tspolice" },
      { label: "State Bank of India", href: "dailyquizzes/sbi" },
      { label: "IBPS", href: "/dailyquizzes/ibps" },
      { label: "Railways", href: "dailyquizzes/railways" },
    ],
  },
  { key: "ebooks", label: "E-Books", href: "#" },
  { key: "prev", label: "Previous Question Papers", href: "#" },
  { key: "courses", label: "Online Courses", href: "#" },
  { key: "test", label: "Test Series", href: "#" },
  { key: "about", label: "About Us", href: "#" },
  { key: "contact", label: "Contact Us", href: "#" },
];

export default function Topbar() {
  const [language, setLanguage] = useState("English");
  const [searchValue, setSearchValue] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({}); // for mobile dropdowns
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setShowSearchModal(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setShowSearchModal(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function toggleMobile() {
    setMobileOpen((s) => !s);
    // close any open search modal
    setShowSearchModal(false);
  }

  function toggleAccordion(key) {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
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
                          items={it.dropdown}
                          align="center"
                        />
                      ) : (
                        <a href={it.href} className={styles.topLink}>
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
                        <Dropdown
                          // for Current Affairs & Daily Quizzes: provide a clickable label that navigates to the parent page,
                          // while Dropdown still provides the hover/click menu items
                          label={
                            it.key === "current" ? (
                              <a
                                href="/currentaffairs"
                                className={styles.bottomLink}
                              >
                                {it.label}
                              </a>
                            ) : it.key === "quizzes" ? (
                              <a
                                href="/dailyquizzes"
                                className={styles.bottomLink}
                              >
                                {it.label}
                              </a>
                            ) : (
                              it.label
                            )
                          }
                          items={it.dropdown}
                          align="center"
                        />
                      ) : (
                        <a href={it.href} className={styles.bottomLink}>
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

              {/* replicate close (hamburger in open state shows X) but provide explicit accessible button */}
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
                            href={d.href}
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
                      <a href={it.href} onClick={() => setMobileOpen(false)}>
                        {it.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <hr />

            {/* Bottom nav */}
            {/* Bottom nav (mobile) - single parent row + toggle to reveal submenu */}
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
                              ? "/currentaffairs"
                              : it.key === "quizzes"
                              ? "/dailyquizzes"
                              : it.href
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
                        {it.dropdown.map((d, idx) => (
                          <a
                            key={idx}
                            href={d.href}
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
                      <a href={it.href} onClick={() => setMobileOpen(false)}>
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
              <a href="/about" onClick={() => setMobileOpen(false)}>
                About Us
              </a>
              <a href="/contact" onClick={() => setMobileOpen(false)}>
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
