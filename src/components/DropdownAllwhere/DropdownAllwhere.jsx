import React from "react";
import styles from "./DropdownAllwhere.module.css";

export default function DropdownAllwhere({
  label = "Select Option",
  options = [],
  value = "",
  onChange = () => {},
  disabled = false,
  className = "",
}) {
  return (
    <div className={`${styles.dropdownContainer} ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={styles.dropdown}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <span className={styles.arrowDown}>▼</span>
    </div>
  );
}
