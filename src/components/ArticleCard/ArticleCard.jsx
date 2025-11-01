import React from "react";
import styles from "./ArticleCard.module.css";

export default function ArticleCard({
  image,
  title,
  excerpt,
  datetime,
  tag,
  onClick = () => {},
}) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <img src={image} alt="" className={styles.thumb} />
        ) : (
          <div className={styles.thumbPlaceholder} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          <button className={styles.titleBtn} onClick={onClick}>
            {title}
          </button>
        </h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.row}>
          <time className={styles.time}>{datetime}</time>
        </div>
      </div>

      {tag && <span className={styles.tag}>{tag}</span>}
    </article>
  );
}
