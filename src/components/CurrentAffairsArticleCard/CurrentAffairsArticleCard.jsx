import React from "react";
import PropTypes from "prop-types";
import styles from "./CurrentAffairsArticleCard.module.css";

export default function CurrentAffairsArticleCard({
  image,
  title,
  description,
  dateTime,
  category, // "National" | "State" | "International"
  onClick,
  compact = false, // NEW
}) {
  // ✅ fallback image if none provided
  const imageSrc =
    image && image.trim() !== "" ? image : "/images/worldcup.png";

  return (
    <article
      className={`${styles.card} ${compact ? styles.compact : ""}`}
      onClick={onClick}
      data-component="current-affairs-article-card"
    >
      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={title || "Current Affairs"}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
          {category && (
            <span
              className={`${styles.badge} ${
                styles[category.toLowerCase()] || ""
              }`}
            >
              {category}
            </span>
          )}
        </div>

        {description && (
          <p className={styles.description}>
            {description.length > 180
              ? `${description.slice(0, 180)}...`
              : description}
          </p>
        )}

        {dateTime && <div className={styles.date}>{dateTime}</div>}
      </div>
    </article>
  );
}

CurrentAffairsArticleCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  dateTime: PropTypes.string,
  category: PropTypes.oneOf(["National", "State", "International"]),
  onClick: PropTypes.func,
  compact: PropTypes.bool,
};
