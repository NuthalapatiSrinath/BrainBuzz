// src/components/QuizDetailsHeader/QuizDetailsHeader.jsx
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./QuizDetailsHeader.module.css";
import { FaRegClock, FaListUl } from "react-icons/fa";

/* helpers */
function pad(n) {
  return String(n).padStart(2, "0");
}
function toParts(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return { hh: pad(hh), mm: pad(mm), ss: pad(ss) };
}

/* FlipUnit used for HH/MM/SS */
function FlipUnit({ value, flipping }) {
  const cardClass = `${styles.card} ${flipping ? styles.flipping : ""}`.trim();

  return (
    <div className={styles.flipUnit}>
      <div className={cardClass}>
        <div className={`${styles.cardFace} ${styles.cardFaceFront}`}>
          <div className={styles.faceValue}>{value}</div>
        </div>
        <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
          <div className={styles.faceValue}>{value}</div>
        </div>
      </div>
    </div>
  );
}
FlipUnit.propTypes = {
  value: PropTypes.string.isRequired,
  flipping: PropTypes.bool,
};

export default function QuizDetailsHeader({
  title = "Quiz Title",
  hours = 0,
  minutes = 0,
  initialSeconds = null,
  showTimer = true,
  questionCount = null,
  onTimeUp = null,
  rightNodes = null,
  resetKey = null,
  className = "",
  logo = null,
  accentColor = null,
  pillBg = null,
}) {
  const initial =
    initialSeconds != null
      ? Math.max(0, Math.floor(initialSeconds))
      : Math.max(0, (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60);

  const [remaining, setRemaining] = useState(initial);
  const intervalRef = useRef(null);

  const [flipHH, setFlipHH] = useState(false);
  const [flipMM, setFlipMM] = useState(false);
  const [flipSS, setFlipSS] = useState(false);

  const prevPartsRef = useRef(toParts(initial));

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRemaining(initial);
    prevPartsRef.current = toParts(initial);

    // if showTimer is false we still keep the center spacer; don't start timer
    if (!showTimer) return undefined;

    if (initial <= 0) {
      if (typeof onTimeUp === "function") onTimeUp();
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [initial, resetKey, showTimer, onTimeUp]);

  useEffect(() => {
    const curr = toParts(remaining);
    const prev = prevPartsRef.current;

    if (curr.ss !== prev.ss) setFlipSS((f) => !f);
    if (curr.mm !== prev.mm) setFlipMM((f) => !f);
    if (curr.hh !== prev.hh) setFlipHH((f) => !f);

    prevPartsRef.current = curr;

    if (remaining === 0 && typeof onTimeUp === "function") onTimeUp();
  }, [remaining, onTimeUp]);

  const parts = toParts(remaining);

  const totalSeconds =
    (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60;
  let totalTimeLabel = "";
  if (totalSeconds >= 3600) {
    const h = Math.floor(totalSeconds / 3600);
    totalTimeLabel = `${h} ${h > 1 ? "Hours" : "Hour"}`;
  } else if (totalSeconds >= 60) {
    const m = Math.floor(totalSeconds / 60);
    totalTimeLabel = `${m} ${m > 1 ? "Minutes" : "Minute"}`;
  } else if (totalSeconds > 0) {
    totalTimeLabel = `${totalSeconds} Seconds`;
  } else {
    totalTimeLabel = "Timed Quiz";
  }

  const titleStyle = accentColor ? { color: accentColor } : undefined;
  const pillStyle = pillBg ? { background: pillBg } : undefined;

  const defaultRight = (
    <div className={styles.rightNodes}>
      <div className={styles.metaItem}>
        <span className={styles.metaIcon} aria-hidden="true" style={pillStyle}>
          <FaRegClock className={styles.metaIconReact} />
        </span>
        <span className={styles.metaLabel}>{totalTimeLabel}</span>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.metaItem}>
        <span className={styles.metaIcon} aria-hidden="true" style={pillStyle}>
          <FaListUl className={styles.metaIconReact} />
        </span>
        <span className={styles.metaLabel}>
          {questionCount != null ? `${questionCount} Questions` : "—"}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`${styles.headerWrap} ${className}`.trim()}>
      <div className={styles.left}>
        <div className={styles.titleRow}>
          {logo ? (
            <img src={logo} alt={`${title} logo`} className={styles.logo} />
          ) : null}

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={styles.titleLink}
            title={title}
            style={titleStyle}
          >
            {title}
          </a>
        </div>
      </div>

      {/* KEEP the center element in DOM so .right stays right.
          If showTimer is false we render an empty spacer (aria-hidden) */}
      <div className={styles.center} aria-hidden={!showTimer}>
        {showTimer ? (
          <div className={styles.timerRow}>
            <div className={styles.timerLabel}>Remaining Time</div>

            <div
              className={styles.timerControls}
              role="timer"
              aria-live="polite"
            >
              <FlipUnit value={parts.hh} flipping={flipHH} />
              <div className={styles.midColon}>:</div>
              <FlipUnit value={parts.mm} flipping={flipMM} />
              <div className={styles.midColon}>:</div>
              <FlipUnit value={parts.ss} flipping={flipSS} />
            </div>
          </div>
        ) : (
          // invisible spacer — keeps layout consistent
          <div style={{ width: "100%", height: 1, visibility: "hidden" }} />
        )}
      </div>

      <div className={styles.right}>
        {rightNodes ? rightNodes : defaultRight}
      </div>
    </div>
  );
}

QuizDetailsHeader.propTypes = {
  title: PropTypes.string,
  hours: PropTypes.number,
  minutes: PropTypes.number,
  initialSeconds: PropTypes.number,
  showTimer: PropTypes.bool,
  questionCount: PropTypes.number,
  onTimeUp: PropTypes.func,
  rightNodes: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  resetKey: PropTypes.any,
  className: PropTypes.string,
  logo: PropTypes.string,
  accentColor: PropTypes.string,
  pillBg: PropTypes.string,
};
