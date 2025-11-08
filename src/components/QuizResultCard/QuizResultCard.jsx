import React from "react";
import PropTypes from "prop-types";
import styles from "./QuizResultCard.module.css";

/**
 * QuizResultCard
 *
 * Props:
 *  - correctCount (number)   : number of correct answers (left card)
 *  - totalQuestions (number) : total questions (left card)
 *  - timeTakenSeconds (number): seconds spent on quiz (middle card)
 *  - percentage (number|null) : optional percentage to display (right card). If null we'll compute it.
 *  - images (object) : optional overrides for images { check, clock, percent }
 */
export default function QuizResultCard({
  correctCount = 0,
  totalQuestions = 0,
  timeTakenSeconds = 0,
  percentage = null,
  images = {},
  className = "",
}) {
  // format time as M:SS or H:MM:SS if big
  function formatTime(sec) {
    sec = Math.max(0, Math.floor(Number(sec) || 0));
    const hh = Math.floor(sec / 3600);
    const mm = Math.floor((sec % 3600) / 60);
    const ss = sec % 60;

    if (hh > 0) {
      return `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(
        2,
        "0"
      )} h`;
    }
    return `${mm}:${String(ss).padStart(2, "0")} min`;
  }

  const pct =
    typeof percentage === "number"
      ? percentage
      : totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 10000) / 100 // rounded to 2 decimals
      : 0;

  const imgs = {
    check: "/images/check.png",
    clock: "/images/clock.png",
    percent: "/images/percent.png",
    ...images,
  };

  return (
    <div
      className={`${styles.row} ${className}`}
      role="region"
      aria-label="Quiz result summary"
    >
      {/* Left card */}
      <article className={styles.card}>
        <div className={styles.iconWrap}>
          <img src={imgs.check} alt="" className={styles.icon} />
        </div>

        <div className={styles.value}>
          <strong className={styles.big}>
            {correctCount} out {totalQuestions}
          </strong>
        </div>

        <div className={styles.subtitle}>Answers are correct</div>
      </article>

      {/* Middle card (dynamic time) */}
      <article className={styles.card}>
        <div className={styles.iconWrap}>
          <img src={imgs.clock} alt="" className={styles.icon} />
        </div>

        <div className={styles.value}>
          <strong className={styles.big}>{formatTime(timeTakenSeconds)}</strong>
        </div>

        <div className={styles.subtitle}>Time taken to take test</div>
      </article>

      {/* Right card */}
      <article className={styles.card}>
        <div className={styles.iconWrap}>
          <img src={imgs.percent} alt="" className={styles.icon} />
        </div>

        <div className={styles.value}>
          <strong className={styles.big}>{String(pct)}%</strong>
        </div>

        <div className={styles.subtitle}>Total percentage achieved</div>
      </article>
    </div>
  );
}

QuizResultCard.propTypes = {
  correctCount: PropTypes.number,
  totalQuestions: PropTypes.number,
  timeTakenSeconds: PropTypes.number,
  percentage: PropTypes.number,
  images: PropTypes.shape({
    check: PropTypes.string,
    clock: PropTypes.string,
    percent: PropTypes.string,
  }),
  className: PropTypes.string,
};
