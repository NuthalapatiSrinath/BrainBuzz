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
  onButtonClick,
  ariaLabel,
  hideLogo = false, // new prop to explicitly hide logo
}) {
  const hasLogo = !!logo && !hideLogo;

  return (
    <div className={styles.card} aria-label={ariaLabel || name}>
      <div className={styles.inner}>
        {hasLogo && (
          <div className={styles.logoWrap} data-slug={slug}>
            <img src={logo} alt={name} className={styles.logo} />
          </div>
        )}

        <h3 className={styles.title}>{name}</h3>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.cta}
            onClick={() => onButtonClick && onButtonClick(slug)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onButtonClick && onButtonClick(slug);
              }
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {/* Make entire card clickable via onClick (card body) */}
      {onClick && (
        <button
          type="button"
          className={styles.cardOverlayButton}
          onClick={() => onClick(slug)}
          aria-label={`Open ${name}`}
        />
      )}
    </div>
  );
}
