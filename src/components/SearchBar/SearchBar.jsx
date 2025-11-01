import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search Categories",
}) {
  return (
    <div className={styles.wrapper}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
        <path
          d="M21 21l-4.35-4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <input
        className={styles.input}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
