import React from "react";
import PropTypes from "prop-types";
import styles from "./PreviousPapersCard.module.css";

export default function PreviousPapersCard({
  paper,
  href,
  onClick,
  className = "",
}) {
  const title = paper?.title || "Untitled";
  const thumb = paper?.thumb || "/images/defaultthumb.png";

  // Allow keyboard activation too
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (href) window.location.href = href;
      else onClick && onClick();
    }
  }

  const Wrapper = href ? "a" : "article";

  return (
    <Wrapper
      href={href}
      onClick={!href ? onClick : undefined}
      className={`${styles.card} ${className}`}
      role={!href ? "button" : undefined}
      tabIndex={!href ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.thumbWrap}>
        <img src={thumb} alt={title} className={styles.thumb} loading="lazy" />
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{title}</p>
      </div>
    </Wrapper>
  );
}

PreviousPapersCard.propTypes = {
  paper: PropTypes.object.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
