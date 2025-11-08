import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import QuizDetailsHeader from "../../../components/QuizDetailsHeader/QuizDetailsHeader";
import DAILY_QUIZZES from "../../../data/dailyQuizzes";
import styles from "./QuizPlayPage.module.css";

export default function QuizPlayPage() {
  const { category, subcategory, quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const quizData = useMemo(() => {
    const passed = location.state;
    if (passed && passed.questions) return passed;
    const catKey = String(category || "").toLowerCase();
    const subKey = String(subcategory || "").toLowerCase();
    const subList = DAILY_QUIZZES.subcategories?.[catKey] || [];
    const sub = subList.find((s) => String(s.id).toLowerCase() === subKey);
    return sub?.quizzes?.find((q) => String(q.id) === String(quizId)) || null;
  }, [category, subcategory, quizId, location.state]);

  const [answers, setAnswers] = useState({});

  // --- NEW: session keys for timing (do not change existing navigation/state) ---
  const startKey = `quiz_start_${quizId}`;
  const endKey = `quiz_end_${quizId}`;

  useEffect(() => {
    try {
      // set start timestamp if not already present
      if (!sessionStorage.getItem(startKey)) {
        sessionStorage.setItem(startKey, String(Date.now()));
      }
      // clear any previous end timestamp so result page reads fresh
      sessionStorage.removeItem(endKey);
    } catch (e) {
      // ignore storage errors (e.g. disabled)
      // console.warn("sessionStorage not available", e);
    }
    // keep this effect mount-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey, endKey]);

  if (!quizData) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>Quiz not found.</div>
      </div>
    );
  }

  // derive header timing props
  const { durationSeconds, durationHours, durationMinutes } = quizData || {};
  let headerHours = 0;
  let headerMinutes = 0;
  let headerInitialSeconds = null;

  if (typeof durationSeconds === "number") {
    headerInitialSeconds = Math.max(0, Math.floor(durationSeconds));
    headerHours = Math.floor(headerInitialSeconds / 3600);
    headerMinutes = Math.floor((headerInitialSeconds % 3600) / 60);
  } else if (
    typeof durationHours === "number" ||
    typeof durationMinutes === "number"
  ) {
    headerHours = Number(durationHours) || 0;
    headerMinutes = Number(durationMinutes) || 0;
    headerInitialSeconds = headerHours * 3600 + headerMinutes * 60;
  } else {
    headerHours = 1;
    headerMinutes = 0;
    headerInitialSeconds = 3600;
  }

  const handleSelect = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = () => {
    try {
      sessionStorage.setItem(endKey, String(Date.now()));
    } catch (e) {
      // ignore
    }

    navigate(`/dailyquizzes/${category}/${subcategory}/${quizId}/result`, {
      state: { quiz: quizData, answers },
    });
  };

  // dynamic visuals
  const logoUrl = quizData.logo || quizData.image || null;
  const accentColor = quizData.accentColor || null;
  const pillBg = quizData.pillBg || null;

  return (
    <div className={styles.wrapper}>
      {/* header in normal flow (non-sticky) */}
      <div className={styles.headerContainer}>
        <QuizDetailsHeader
          title={quizData.title}
          initialSeconds={headerInitialSeconds}
          hours={headerHours}
          minutes={headerMinutes}
          questionCount={quizData.questions?.length || 0}
          onTimeUp={() => {
            try {
              sessionStorage.setItem(endKey, String(Date.now()));
            } catch (e) {
              // ignore
            }
            navigate(
              `/dailyquizzes/${category}/${subcategory}/${quizId}/result`,
              { state: { quiz: quizData, answers } }
            );
          }}
          logo={logoUrl}
          accentColor={accentColor}
          pillBg={pillBg}
        />
      </div>

      <main className={styles.content}>
        <h3 className={styles.sectionTitle}>Questions :</h3>

        <form className={styles.quizForm} onSubmit={(e) => e.preventDefault()}>
          {quizData.questions?.map((q, idx) => (
            <section key={q.id || idx} className={styles.questionBlock}>
              <p className={styles.qtext}>
                {String.fromCharCode(65 + idx)}. {q.question}
              </p>

              {Array.isArray(q.options) && q.options.length > 0 ? (
                <div className={styles.options}>
                  {q.options.map((opt, i) => {
                    const optId = `q-${idx}-opt-${i}`;
                    return (
                      <label key={optId} className={styles.option}>
                        <input
                          id={optId}
                          type="radio"
                          name={`q-${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleSelect(idx, opt)}
                        />
                        <span className={styles.optText}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.openPrompt}>
                  <em>
                    Open answer / essay prompt — use the review screen to enter
                    answers (not supported in MCQ UI).
                  </em>
                </div>
              )}
            </section>
          ))}

          <div className={styles.submitRow}>
            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              Submit Quiz
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
