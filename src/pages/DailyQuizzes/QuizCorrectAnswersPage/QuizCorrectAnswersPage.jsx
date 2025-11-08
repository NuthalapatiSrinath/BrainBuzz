// src/pages/DailyQuizzes/QuizCorrectAnswersPage/QuizCorrectAnswersPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import QuizDetailsHeader from "../../../components/QuizDetailsHeader/QuizDetailsHeader";
import Button from "../../../components/Button/Button";
import DAILY_QUIZZES from "../../../data/dailyQuizzes";
import styles from "./QuizCorrectAnswersPage.module.css";

/* Small helper to label options A, B, C... */
function optionLabel(i) {
  return String.fromCharCode(65 + i);
}

/* Inline small icons to avoid external deps */
function CorrectIcon() {
  return (
    <span className={styles.iconWrap} aria-hidden>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#E6F4EA" />
        <path
          d="M8.5 12.8l1.8 1.8L15.5 9"
          stroke="#1EA04A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
function WrongIcon() {
  return (
    <span className={styles.iconWrap} aria-hidden>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#FCECEC" />
        <path
          d="M9 9L15 15M15 9L9 15"
          stroke="#D64545"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
function NeutralBullet() {
  return (
    <span className={styles.fakeRadio} aria-hidden>
      <span className={styles.innerDot} />
    </span>
  );
}

export default function QuizCorrectAnswersPage() {
  const { category, subcategory, quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // resolve data (hooks at top level)
  const { quiz, answers } = useMemo(() => {
    const state = location.state || {};
    let resolvedQuiz = state.quiz || null;

    if (!resolvedQuiz) {
      const catKey = String(category || "").toLowerCase();
      const subKey = String(subcategory || "").toLowerCase();
      const subList = DAILY_QUIZZES.subcategories?.[catKey] || [];
      const sub = subList.find((s) => String(s.id).toLowerCase() === subKey);
      resolvedQuiz =
        sub?.quizzes?.find((q) => String(q.id) === String(quizId)) || null;
    }

    const resolvedAnswers = state.answers || {};
    return { quiz: resolvedQuiz, answers: resolvedAnswers };
  }, [category, subcategory, quizId, location.state]);

  if (!quiz) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>
          <h2>Quiz not found</h2>
          <p>Couldn't locate quiz data. Try returning to the quizzes list.</p>
          <Button
            label="Back"
            variant="outline"
            onClick={() =>
              navigate(`/dailyquizzes/${category || ""}/${subcategory || ""}`, {
                replace: true,
              })
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* optional banner header if you want it; keep it if you used it elsewhere */}
      {/* <Header imageSrc="/images/daily-quizzes-banner.png" alt={quiz.title} /> */}

      {/* Quiz header with no timer */}
      <div className={styles.headerContainer}>
        <QuizDetailsHeader
          title={quiz.title}
          questionCount={quiz.questions?.length || 0}
          logo={quiz.logo || quiz.image || null}
          accentColor={quiz.accentColor || null}
          pillBg={quiz.pillBg || null}
          showTimer={false}
        />
      </div>

      <main className={styles.container}>
        <h2 className={styles.pageTitle}>{quiz.title} — Review Answers</h2>

        <section className={styles.questionsList}>
          {quiz.questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const correct = q.correct;
            const isCorrect = userAnswer === correct;

            return (
              <article key={q.id || idx} className={styles.questionCard}>
                <div className={styles.qHeader}>
                  <div className={styles.qIndex}>Q{idx + 1}</div>
                  <div className={styles.qText}>{q.question}</div>
                </div>

                <div className={styles.options}>
                  {Array.isArray(q.options) && q.options.length > 0 ? (
                    q.options.map((opt, i) => {
                      const label = optionLabel(i);
                      const isSelected = userAnswer === opt;
                      const isRight = correct === opt;

                      let rowClass = styles.optionRow;
                      if (isRight)
                        rowClass = `${rowClass} ${styles.optionCorrect}`;
                      else if (isSelected && !isRight)
                        rowClass = `${rowClass} ${styles.optionWrong}`;

                      return (
                        <div key={i} className={rowClass}>
                          <div className={styles.leftCol}>
                            {/* mimic radio */}
                            {isRight ? (
                              <CorrectIcon />
                            ) : isSelected ? (
                              <WrongIcon />
                            ) : (
                              <NeutralBullet />
                            )}
                          </div>

                          <div className={styles.optionBody}>
                            <div className={styles.optLabel}>
                              <strong>{label}.</strong>&nbsp;
                              <span className={styles.optText}>{opt}</span>
                            </div>

                            <div className={styles.optMeta}>
                              {isRight && (
                                <span className={styles.okBadge}>
                                  Correct Answer
                                </span>
                              )}
                              {isSelected && !isRight && (
                                <span className={styles.badgeWrong}>
                                  Your Answer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.openPrompt}>
                      <em>
                        Open answer / essay question — answer shown below.
                      </em>
                      <div className={styles.yourResponse}>
                        <strong>Your Response:</strong> {userAnswer || "—"}
                      </div>
                    </div>
                  )}
                </div>

                {q.explanation ? (
                  <div className={styles.explainBox}>
                    <div className={styles.explainTitle}>Explanation :</div>
                    <div className={styles.explainText}>{q.explanation}</div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <div className={styles.actionsRow}>
          {/* Single button: Take Another Quiz -> goes back to subcategory listing */}
          <Button
            label="Take Another Quiz"
            variant="primary"
            onClick={() =>
              navigate(`/dailyquizzes/${category}/${subcategory}`, {
                replace: true,
              })
            }
          />
        </div>
      </main>
    </div>
  );
}
