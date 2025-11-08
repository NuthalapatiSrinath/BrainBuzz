// src/pages/DailyQuizzes/QuizResultPage/QuizResultPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import QuizDetailsHeader from "../../../components/QuizDetailsHeader/QuizDetailsHeader";
import QuizResultCard from "../../../components/QuizResultCard/QuizResultCard";
import Button from "../../../components/Button/Button";
import DAILY_QUIZZES from "../../../data/dailyQuizzes";
import styles from "./QuizResultPage.module.css";

/* small helper for safe session reads */
function safeNumberFromStorage(key) {
  try {
    const v = sessionStorage.getItem(key);
    return v ? Number(v) : null;
  } catch (err) {
    return null;
  }
}

export default function QuizResultPage() {
  const { category, subcategory, quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { quiz, answers, timeTakenSeconds } = useMemo(() => {
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

    let start = safeNumberFromStorage(`quiz_start_${quizId}`);
    let end = safeNumberFromStorage(`quiz_end_${quizId}`);

    let timeTaken = null;
    if (start && end && end >= start) {
      timeTaken = Math.floor((end - start) / 1000);
    } else if (start && !end) {
      timeTaken = Math.floor((Date.now() - start) / 1000);
    }

    return {
      quiz: resolvedQuiz,
      answers: resolvedAnswers,
      timeTakenSeconds: timeTaken,
    };
  }, [category, subcategory, quizId, location.state]);

  const score = useMemo(() => {
    if (!quiz || !quiz.questions) return 0;
    return quiz.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
      0
    );
  }, [quiz, answers]);

  if (!quiz) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>
          <h2>No result data.</h2>
          <p>Quiz not found for the provided URL/state.</p>
          <Button
            label="Back"
            onClick={() =>
              navigate(`/dailyquizzes/${category || ""}/${subcategory || ""}`, {
                replace: true,
              })
            }
            variant="outline"
          />
        </div>
      </div>
    );
  }

  const images = {
    check: "/images/result/check.png",
    clock: "/images/result/clock.png",
    percent: "/images/result/percentage.png",
  };

  return (
    <div className={styles.wrapper}>
      {/* removed main banner header */}
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

      <div className={styles.container}>
        <h2 className={styles.title}>Your Results</h2>

        <QuizResultCard
          correctCount={score}
          totalQuestions={quiz.questions.length}
          timeTakenSeconds={timeTakenSeconds || 0}
          images={images}
          className={styles.resultsRow}
        />

        <div className={styles.summaryText}>
          You've reached <strong>{score}</strong> out of{" "}
        {quiz.questions.length} questions
        </div>

        <div className={styles.actions}>
          <Button
            label="Restart Quiz"
            variant="primary"
            onClick={() =>
              navigate(
                `/dailyquizzes/${category}/${subcategory}/${quizId}/play`,
                { replace: true }
              )
            }
          />

          <Button
            label="View Answers"
            variant="outline"
            onClick={() =>
              navigate(
                `/dailyquizzes/${category}/${subcategory}/${quizId}/review`,
                { state: { quiz, answers } }
              )
            }
            className={styles.viewAnswersBtn}
          />
        </div>
      </div>
    </div>
  );
}
