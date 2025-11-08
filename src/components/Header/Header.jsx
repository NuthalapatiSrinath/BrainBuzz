import React from "react";
import PropTypes from "prop-types";
import styles from "./Header.module.css";

/**
 * Reusable header section for subcategory pages
 * Props:
 *  - imageSrc: string (required)  → Path of the logo/image
 *  - alt: string → Alt text for accessibility
 */
export default function Header({ imageSrc, alt = "Logo" }) {
  return (
    <div className={styles.heroSection}>
      <div className={styles.logoBox}>
        <img src={imageSrc} alt={alt} className={styles.logo} />
      </div>
    </div>
  );
}

Header.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  alt: PropTypes.string,
};
