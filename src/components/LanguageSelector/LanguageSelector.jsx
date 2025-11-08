// src/components/LanguageSelector/LanguageSelector.jsx
import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguageSelector.module.css";
import { translatePage } from "../../utils/googleTranslate";

/**
 * A single canonical LanguageSelector. Use this component everywhere
 * (Topbar, CategoryHeader, etc.) so behavior is identical.
 */
export default function LanguageSelector({
  language,
  onChange,
  options = ["English", "Telugu", "Hindi"],
  compact = false,
}) {
  const wrapperCls = [styles.wrapper, compact ? styles.compact : ""]
    .join(" ")
    .trim();

  const handleClick = (opt) => {
    onChange(opt);
    const langCode = opt === "Hindi" ? "hi" : opt === "Telugu" ? "te" : "en";
    translatePage(langCode);
  };

  return (
    <div className={wrapperCls} role="tablist" aria-label="Language selector">
      {options.map((opt, idx) => {
        const active = language === opt;
        const cls = [
          styles.tab,
          active ? styles.active : "",
          idx === 0 ? styles.first : "",
          idx === options.length - 1 ? styles.last : "",
        ]
          .join(" ")
          .trim();

        return (
          <button
            key={opt}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => handleClick(opt)}
            className={cls}
          >
            <span className={styles.label}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

LanguageSelector.propTypes = {
  language: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  compact: PropTypes.bool,
};
