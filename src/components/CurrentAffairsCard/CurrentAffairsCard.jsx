import React from "react";
import styles from "./CurrentAffairsCard.module.css";
import CurrentAffairsArticleCard from "../CurrentAffairsArticleCard/CurrentAffairsArticleCard";

/**
 * Props:
 * - title, items, color, boxShadow, logo, className, onNavigate, underline
 * - topArticles (data), topArticleNodes (JSX)
 * - activeItemId: optional id string to mark a specific item active (underline)
 * - style: inline style object applied to aside (page can pass width/maxWidth)
 */
export default function CurrentAffairsCard({
  title = "Current Affairs",
  items = [],
  color = "var(--Utility_Color3)",
  boxShadow = null,
  logo = "/images/lion.png",
  className = "",
  onNavigate = null,
  underline = false,
  topArticles = [],
  topArticleNodes = [],
  activeItemId = null,
  style: styleProp = {},
}) {
  const handleClick = (item) => {
    if (typeof item.onClick === "function") return item.onClick(item);
    if (typeof onNavigate === "function") return onNavigate(item.href, item);
    if (item.href) window.location.href = item.href;
  };

  const inlineVars = {
    "--header-color": color,
    boxShadow: boxShadow || undefined,
    "--logo-url": `url(${logo})`,
  };

  const finalStyle = { ...inlineVars, ...styleProp };

  return (
    <aside
      className={`${styles.cardWrap} ${className}`}
      aria-label={title}
      style={finalStyle}
    >
      <div className={styles.logoBg} aria-hidden="true"></div>

      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </header>

      {Array.isArray(topArticleNodes) && topArticleNodes.length > 0 ? (
        <div className={styles.topArticles} aria-hidden="false">
          {topArticleNodes.map((node, i) => (
            <div key={i} className={styles.topArticleItem}>
              {node}
            </div>
          ))}
        </div>
      ) : Array.isArray(topArticles) && topArticles.length > 0 ? (
        <div className={styles.topArticles} aria-hidden="false">
          {topArticles.map((a) => (
            <div key={a.id} className={styles.topArticleItem}>
              <CurrentAffairsArticleCard
                compact={true}
                image={a.image}
                title={a.title}
                description={a.description}
                dateTime={a.dateTime}
                category={a.category}
                onClick={() =>
                  typeof a.onClick === "function" ? a.onClick() : handleClick(a)
                }
              />
            </div>
          ))}
        </div>
      ) : null}

      {Array.isArray(items) && items.length > 0 && (
        <ul className={styles.list} role="list">
          {items.map((it) => {
            // determine per-item underline: if this item id matches activeItemId, apply underline.
            // we still support the old "underline" boolean to underline all items if desired.
            const isActive = activeItemId && it.id === activeItemId;
            return (
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
                  <span
                    className={`${styles.itemText} ${
                      underline || isActive ? styles.underline : ""
                    }`}
                  >
                    {it.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!topArticles.length && !topArticleNodes.length && !items.length && (
        <div className={styles.empty}>No items</div>
      )}
    </aside>
  );
}
