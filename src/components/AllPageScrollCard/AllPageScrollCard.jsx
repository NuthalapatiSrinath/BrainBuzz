import React, { useRef } from "react";
import PropTypes from "prop-types";
import styles from "./AllPageScrollCard.module.css";
import CategoryCard from "../CategoryCard/CategoryCard";

/**
 * AllPageScrollCard
 * Props:
 *  - title (string)
 *  - items (array of tile objects: { id, title, logo, description, path })
 *  - onViewAll (fn) => called when View All clicked
 *  - onTileClick (fn(tile)) => tile click handler
 *  - showCount (bool) => show count badge if item.count present
 *  - limit (number) => number of tiles to show (overflow still scrollable)
 */
export default function AllPageScrollCard({
  title,
  items = [],
  onViewAll,
  onTileClick,
  showCount = true,
  limit = 8,
}) {
  const scrollRef = useRef(null);

  function scroll(delta) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
  }

  const visible = Array.isArray(items) ? items.slice(0, limit) : [];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={() => onViewAll && onViewAll()}
          >
            View All
          </button>

          <div className={styles.arrows}>
            <button
              type="button"
              className={`${styles.arrowBtn} ${styles.left}`}
              onClick={() => scroll(-320)}
              aria-label="Scroll left"
            >
              ◀
            </button>
            <button
              type="button"
              className={`${styles.arrowBtn} ${styles.right}`}
              onClick={() => scroll(320)}
              aria-label="Scroll right"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      <div className={styles.scrollerWrap}>
        <div className={styles.scroller} ref={scrollRef}>
          {visible.map((t) => (
            <div
              key={t.id}
              className={styles.tileWrap}
              onClick={() => onTileClick && onTileClick(t)}
            >
              <CategoryCard
                id={t.id}
                name={t.title}
                logo={t.logo}
                slug={t.id}
                description={t.description}
                count={showCount ? t.count : undefined}
                onClick={() => onTileClick && onTileClick(t)}
              />
            </div>
          ))}

          {visible.length === 0 && (
            <div className={styles.empty}>No items to show</div>
          )}
        </div>
      </div>
    </section>
  );
}

AllPageScrollCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  onViewAll: PropTypes.func,
  onTileClick: PropTypes.func,
  showCount: PropTypes.bool,
  limit: PropTypes.number,
};
