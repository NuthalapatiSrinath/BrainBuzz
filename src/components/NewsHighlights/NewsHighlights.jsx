import React from "react";
import PropTypes from "prop-types";
import styles from "./NewsHighlights.module.css";

/**
 * NewsHighlights
 * - items: [{ id, title, image, date }]
 * - max: number of items to show
 * - onOpen(item): called when an item is clicked
 *
 * This is intentionally lightweight and safe to drop into any header/card.
 */
export default function NewsHighlights({
  items = [],
  max = 3,
  onOpen = () => {},
}) {
  const visible = (items || []).slice(0, max);

  return (
    <div className={styles.wrap} role="region" aria-label="Today highlights">
      <div className={styles.title}>Highlights</div>

      <ul className={styles.list}>
        {visible.length === 0 ? (
          <li className={styles.empty}>No highlights</li>
        ) : (
          visible.map((it) => (
            <li key={it.id} className={styles.item}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => onOpen(it)}
                aria-label={it.title}
                title={it.title}
              >
                {it.image ? (
                  <img src={it.image} alt="" className={styles.thumb} />
                ) : (
                  <div className={styles.thumbPlaceholder} />
                )}

                <div className={styles.text}>
                  <div className={styles.headline}>{it.title}</div>
                  {it.date && <div className={styles.date}>{it.date}</div>}
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

NewsHighlights.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      date: PropTypes.string,
    })
  ),
  max: PropTypes.number,
  onOpen: PropTypes.func,
};
