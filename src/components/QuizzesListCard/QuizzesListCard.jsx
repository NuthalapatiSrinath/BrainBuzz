import React from "react";
import styles from "./QuizzesListCard.module.css";

/**
 * Props:
 * - title: string
 * - items: [{ id, title, href, onClick }]
 * - color: any CSS color string (for header background)
 * - boxShadow: optional custom shadow
 * - logo: optional watermark image (defaults to Ashoka logo)
 * - className: optional extra class
 * - onNavigate: optional navigation override (react-router)
 */
export default function QuizzesListCard({
  title = "Current Affairs",
  items = [],
  color = "var(--Utility_Color3)",
  boxShadow = null,
  logo = "/images/lion.png", // ✅ default logo (replace path as needed)
  className = "",
  onNavigate = null,
}) {
  const handleClick = (item) => {
    if (typeof item.onClick === "function") return item.onClick(item);
    if (typeof onNavigate === "function") return onNavigate(item.href, item);
    if (item.href) window.location.href = item.href;
  };

  const inline = {
    "--header-color": color,
    boxShadow: boxShadow || undefined,
    "--logo-url": `url(${logo})`,
  };

  return (
    <aside
      className={`${styles.cardWrap} ${className}`}
      aria-label={title}
      style={inline}
    >
      {/* Background logo watermark */}
      <div className={styles.logoBg} aria-hidden="true"></div>

      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </header>

      <ul className={styles.list} role="list">
        {items && items.length > 0 ? (
          items.map((it) => (
            <li key={it.id} className={styles.listItem}>
              <button
                type="button"
                className={styles.itemBtn}
                onClick={() => handleClick(it)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(it);
                  }
                }}
                aria-label={it.title}
              >
                <span className={styles.chev} aria-hidden="true">
                  ›
                </span>
                <span className={styles.itemText}>{it.title}</span>
              </button>
            </li>
          ))
        ) : (
          <li className={styles.empty}>No items</li>
        )}
      </ul>
    </aside>
  );
}
