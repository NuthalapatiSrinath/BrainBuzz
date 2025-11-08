import React from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaLanguage } from "react-icons/fa";
import Button from "../Button/Button";
import styles from "./BookCard.module.css";

export default function BookCard({
  image,
  title,
  type,
  validity,
  medium,
  onView,
  onDownload,
}) {
  return (
    <div className={styles.card} data-component="book-card">
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
      </div>

      <div className={styles.textBlock}>
        <div className={styles.title}>{title}</div>
        {type && <div className={styles.typeBadge}>{type}</div>}
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <FaCalendarAlt className={styles.icon} />
          <span>
            <strong>Validity :</strong> {validity || "NA"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <FaLanguage className={styles.icon} />
          <span>
            <strong>Med :</strong> {medium || "Eng"}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          label="View"
          variant="outline"
          onClick={onView}
          className={styles.halfBtn}
        />
        <Button
          label="Download"
          onClick={onDownload}
          className={styles.halfBtn}
        />
      </div>
    </div>
  );
}

BookCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  validity: PropTypes.string,
  medium: PropTypes.string,
  onView: PropTypes.func,
  onDownload: PropTypes.func,
};
