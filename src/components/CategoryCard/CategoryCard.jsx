import React from "react";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({
  id,
  name,
  logo,
  slug,
  description = "",
  buttonLabel = "View Courses",
  onClick,
  ariaLabel,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick && onClick(slug);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => onClick && onClick(slug)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `Go to ${name} current affairs`}
    >
      <div className={styles.inner}>
        <div className={styles.logoWrap}>
          <img src={logo} alt={name} className={styles.logo} />
        </div>

        <h3 className={styles.title}>{name}</h3>

        <p className={styles.description}>{description}</p>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.cta}
            onClick={(e) => {
              // stop outer div click only if the button has its own action,
              // but keep default to call parent's onClick too (consistent with old behavior)
              e.stopPropagation();
              onClick && onClick(slug);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick && onClick(slug);
              }
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
