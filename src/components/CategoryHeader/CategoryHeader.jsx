// src/components/CategoryHeader/CategoryHeader.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./CategoryHeader.module.css";
import {
  translatePage,
  getCurrentTranslatedLang,
} from "../../utils/googleTranslate";

/**
 * Props
 * - title: string
 * - languages: [{ key, label }]  (we will use label for display)
 * - active: string label ("English","Hindi","Telugu")
 * - onChange: fn(label)
 * - showDivider, className
 *
 * NOTE: This component keeps a small internal selected state so the visual 'active'
 * remains correct after translatePage() triggers a full reload (which is expected).
 */
export default function CategoryHeader({
  title,
  languages = [
    { key: "en", label: "English" },
    { key: "hi", label: "Hindi" },
    { key: "te", label: "Telugu" },
  ],
  active = "English",
  onChange = () => {},
  showDivider = true,
  className = "",
}) {
  // map label <-> code helpers
  const labelToCode = (label) => {
    if (!label) return "en";
    const l = String(label).toLowerCase();
    if (l === "hindi") return "hi";
    if (l === "telugu") return "te";
    return "en";
  };
  const codeToLabel = (code) => {
    if (!code) return "English";
    const c = String(code).toLowerCase();
    if (c === "hi") return "Hindi";
    if (c === "te") return "Telugu";
    return "English";
  };

  // internal selected label so visual persists after page reload
  const [selected, setSelected] = useState(active);

  // Sync selected from prop 'active' when it changes
  useEffect(() => {
    if (active && active !== selected) setSelected(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // On mount, read persisted bb_lang_code (if any) so after reload the correct button is highlighted
  useEffect(() => {
    try {
      const code = getCurrentTranslatedLang(); // reads cookie then localStorage fallback
      const label = codeToLabel(code);
      if (label && label !== selected) setSelected(label);
    } catch (e) {
      // ignore
    }

    // also listen for storage events (other tabs or components may change language)
    function onStorage(e) {
      if (e.key === "bb_lang_code") {
        const newLabel = codeToLabel(e.newValue);
        setSelected(newLabel);
      }
      if (e.key === "bb_lang_label") {
        // if someone set the label directly
        setSelected(e.newValue);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (label) => {
    const code = labelToCode(label);

    // keep original behaviour of storing label (optional)
    try {
      localStorage.setItem("bb_lang_label", label);
    } catch (e) {
      // ignore
    }

    // store canonical code used by other parts (Topbar, helpers)
    try {
      localStorage.setItem("bb_lang_code", code);
    } catch (e) {
      // ignore
    }

    // update local visual state immediately
    setSelected(label);

    // notify parent with the label (preserves existing API)
    onChange(label);

    // call helper with language code (translatePage expects codes like 'en','hi','te')
    translatePage(code);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {showDivider && <div className={styles.topDivider} aria-hidden="true" />}
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.right}>
          <div
            className={styles.langGroup}
            role="tablist"
            aria-label="Languages"
          >
            {languages.map((lang) => {
              const isActive = lang.label === selected;
              return (
                <button
                  key={lang.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.langBtn} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() => handleSelect(lang.label)}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

CategoryHeader.propTypes = {
  title: PropTypes.string.isRequired,
  languages: PropTypes.array,
  active: PropTypes.string,
  onChange: PropTypes.func,
  showDivider: PropTypes.bool,
  className: PropTypes.string,
};
