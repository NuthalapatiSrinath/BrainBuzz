// src/pages/DailyQuizzes/QuizResultPage/QuizResultPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import QuizDetailsHeader from "../../../components/QuizDetailsHeader/QuizDetailsHeader";
import QuizResultCard from "../../../components/QuizResultCard/QuizResultCard";
import Button from "../../../components/Button/Button";
import DAILY_QUIZZES from "../../../data/dailyQuizzes";
import styles from "./QuizResultPage.module.css";

function safeNumberFromStorage(key) {
  try {
    const v = sessionStorage.getItem(key);
    return v ? Number(v) : null;
  } catch {
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
      const catKey = String(category).toLowerCase();
      const subKey = String(subcategory).toLowerCase();
      const subList = DAILY_QUIZZES.subcategories?.[catKey] || [];
      const sub = subList.find((s) => String(s.id).toLowerCase() === subKey);
      resolvedQuiz =
        sub?.quizzes?.find((q) => String(q.id) === String(quizId)) || null;
    }

    const resolvedAnswers = state.answers || {};

    let start = safeNumberFromStorage(`quiz_start_${quizId}`);
    let end = safeNumberFromStorage(`quiz_end_${quizId}`);

    let timeTaken = null;
    if (start && end && end >= start)
      timeTaken = Math.floor((end - start) / 1000);

    return {
      quiz: resolvedQuiz,
      answers: resolvedAnswers,
      timeTakenSeconds: timeTaken,
    };
  }, [category, subcategory, quizId, location.state]);

  const score = useMemo(() => {
    if (!quiz?.questions) return 0;
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
          <Button
            label="Back"
            variant="outline"
            onClick={() =>
              navigate(`/dailyquizzes/${category}/${subcategory}`, {
                replace: true,
              })
            }
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

  // Dynamic Rank values (replace with real data)
  const rank = 24;
  const totalMembers = 1000;
  const rankImage = "/images/result/rank.png";

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerContainer}>
        <QuizDetailsHeader
          title={quiz.title}
          questionCount={quiz.questions.length}
          logo={quiz.logo}
          showTimer={false}
        />
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>Your Results</h2>

        {/* Combined row wrapper — updated so both sides stretch to same height */}
        <div className="results-combined-row" style={{ width: "100%" }}>
          {/* left: the existing QuizResultCard (renders the 3 small cards) */}
          <div className="results-combined-left">
            <QuizResultCard
              correctCount={score}
              totalQuestions={quiz.questions.length}
              timeTakenSeconds={timeTakenSeconds || 0}
              images={images}
              className={styles.resultsRow}
            />
          </div>

          {/* right: one single Rank card using your existing .card styles */}
          <div className="results-combined-right">
            {/* Make the rank card fill the same height as the left component.
                We use inline styles to avoid touching module CSS. */}
            <div
              className={styles.card}
              style={{
                width: 220,
                /* Let this card stretch to same height as left pane */
                height: "90%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <img src={rankImage} className={styles.cardIcon} alt="rank" />

              <div className={styles.cardValue}>Rank {rank}</div>

              <div className={styles.cardLabel}>
                Out of {totalMembers} members
              </div>
            </div>
          </div>
        </div>

        {/* Scoped styles: keep both panes same height on desktop, wrap on mobile */}
        <style>{`
          .results-combined-row{
            display:flex;
            gap:28px;
            justify-content:center;
            align-items:stretch;   /* <-- important: stretch children to same height */
            flex-wrap:wrap;        /* allow wrap on smaller screens */
            margin-bottom: 18px;
          }

          /* Left pane should shrink/grow to fit content but maintain height */
          .results-combined-left{
            flex: 0 0 auto;
            display:flex;
            align-items:stretch; /* ensure child QuizResultCard stretches vertically */
            justify-content:center;
            min-width: 0;
          }

          /* Right pane sized for a single card, allow it to stretch to same height */
          .results-combined-right{
            flex: 0 0 auto;
            display:flex;
            align-items:stretch;
            justify-content:center;
          }

          /* MOBILE: stack and center each row */
          @media (max-width: 900px){
            .results-combined-row{
              gap:16px;
            }
            .results-combined-left, .results-combined-right {
              flex: 1 1 100%;
              justify-content:center;
            }
            /* ensure the rank card doesn't become excessively tall on small screens */
            .results-combined-right .${styles.card ? "" : ""} {
              /* no-op placeholder */
            }
          }
        `}</style>

        <div className={styles.summaryText}>
          You've reached <strong>{score}</strong> out of {quiz.questions.length}{" "}
          questions
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
          />
        </div>
      </div>
    </div>
  );
}
