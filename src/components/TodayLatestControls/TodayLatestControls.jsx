import React from "react";
import PropTypes from "prop-types";
import styles from "./TodayLatestControls.module.css";

/**
 * Small widget shown in the right side of the pink header row.
 * Props:
 * - selectedMonth: string | null  (e.g., "2025-09")
 * - total: number  (article count)
 * - onClearMonth: function  (reset back to today)
 */
export default function TodayLatestControls({
  selectedMonth = null,
  total = 0,
  onClearMonth = () => {},
}) {
  const monthLabel = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className={styles.wrap}>
      {monthLabel ? (
        <div className={styles.monthRow}>
          <span className={styles.label}>Viewing:</span>
          <span className={styles.month}>{monthLabel}</span>
        </div>
      ) : (
        <div className={styles.todayLabel}>Showing latest articles</div>
      )}

      <div className={styles.total}>
        <span className={styles.count}>{total}</span> Articles
      </div>

      {monthLabel && (
        <button className={styles.resetBtn} onClick={onClearMonth}>
          Show Today
        </button>
      )}
    </div>
  );
}

TodayLatestControls.propTypes = {
  selectedMonth: PropTypes.string,
  total: PropTypes.number,
  onClearMonth: PropTypes.func,
};
