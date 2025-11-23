// src/components/CategoryHeader/CategoryHeader.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./CategoryHeader.module.css";

/**
 * CLEAN VERSION — GOOGLE TRANSLATION REMOVED
 * -----------------------------------------------------
 * - Buttons now work only as language filters.
 * - Stores bb_lang_code = "en" | "hi" | "te"
 * - Parent receives onChange(langKey)
 */

export default function CategoryHeader({
  title,
  languages = [
    { key: "en", label: "English" },
    { key: "hi", label: "Hindi" },
    { key: "te", label: "Telugu" },
  ],
  active = "en",
  onChange = () => {},
  showDivider = true,
  className = "",
}) {
  const [selected, setSelected] = useState(active);

  // sync with parent
  useEffect(() => {
    if (active && active !== selected) setSelected(active);
  }, [active]);

  // load saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bb_lang_code");
      if (saved && saved !== selected) {
        setSelected(saved);
        onChange(saved);
      }
    } catch (e) {}
  }, []);

  const handleSelect = (key) => {
    setSelected(key);

    try {
      localStorage.setItem("bb_lang_code", key);
    } catch (e) {}

    onChange(key); // notify parent
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {showDivider && <div className={styles.topDivider} aria-hidden="true" />}

      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.right}>
          <div className={styles.langGroup} role="tablist">
            {languages.map((lang) => {
              const isActive = lang.key === selected;
              return (
                <button
                  key={lang.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.langBtn} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() => handleSelect(lang.key)}
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
