import React from "react";
import PropTypes from "prop-types";
import styles from "./AboutUsCard.module.css";

/**
 * AboutUsCard Component
 * Props:
 * - title: string (main heading, e.g. "50 Online Courses")
 * - description: string (subtitle, e.g. "We have approximately 50 online courses")
 * - bgColor: string (CSS variable or hex color for background)
 * - icon: string | React node (image path or React element)
 */

export default function AboutUsCard({ title, description, bgColor, icon }) {
  return (
    <div className={styles.card} style={{ backgroundColor: bgColor }}>
      <div className={styles.iconWrapper}>
        {typeof icon === "string" ? (
          <img src={icon} alt={title} className={styles.iconImage} />
        ) : (
          icon
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

AboutUsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

AboutUsCard.defaultProps = {
  bgColor: "var(--Utility_Color3)", // fallback pinkish tone
  icon: null,
};
