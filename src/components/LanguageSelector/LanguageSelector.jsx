import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguageSelector.module.css";

/**
 * LanguageSelector
 * - language: currently selected language (string)
 * - onChange: function to call with new language
 * - options: optional array of labels
 * - compact: optional boolean — render slightly smaller (useful for mobile header)
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
            onClick={() => onChange(opt)}
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
