import React from "react";
import PropTypes from "prop-types";
import styles from "./Input.module.css";

/**
 * Reusable Input Component
 *
 * Props:
 * - type: string ('text', 'email', 'number', etc.)
 * - placeholder: string
 * - value: string
 * - onChange: function
 * - textarea: boolean (if true, renders <textarea>)
 * - className: string (optional custom class)
 */

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  textarea = false,
  className = "",
}) {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {textarea ? (
        <textarea
          className={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={5}
        />
      ) : (
        <input
          type={type}
          className={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  textarea: PropTypes.bool,
  className: PropTypes.string,
};
