import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

/**
 * Reusable Button Component
 *
 * Props:
 * - label: string (text on button)
 * - variant: "primary" | "outline" (default: primary)
 * - fullWidth: boolean (default: false)
 * - onClick: function
 * - type: string ('button', 'submit', etc.)
 * - className: optional extra class
 */

export default function Button({
  label,
  variant = "primary",
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}) {
  const btnClass = `
    ${styles.btn} 
    ${variant === "outline" ? styles.outline : styles.primary} 
    ${fullWidth ? styles.fullWidth : ""} 
    ${className}
  `;

  return (
    <button type={type} onClick={onClick} className={btnClass.trim()}>
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "outline"]),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};
