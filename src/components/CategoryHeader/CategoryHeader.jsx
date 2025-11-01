import React from "react";
import PropTypes from "prop-types";
import styles from "./CategoryHeader.module.css";

/**
 * Props
 * - title: string (required) - left heading text
 * - languages: array of { key: string, label: string } (optional)
 * - active: string (optional) - key of active language
 * - onChange: function(newKey) (optional) - called when user selects a language
 * - showDivider: boolean (optional) - small top divider line (default true)
 * - className: string (optional) - extra className
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
              const isActive = lang.key === active;
              return (
                <button
                  key={lang.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.langBtn} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() => onChange(lang.key)}
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
