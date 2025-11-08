import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DAILY_QUIZZES from "../../../data/dailyQuizzes";
import Button from "../../../components/Button/Button";
import styles from "./QuizDescriptionPage.module.css";

function formatDate(d) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function QuizDescriptionPage() {
  const { category, subcategory, quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passed = location.state || null;

  // fallback lookup from js file
  const quiz = useMemo(() => {
    if (passed) return passed;
    const catKey = String(category || "").toLowerCase();
    const subKey = String(subcategory || "").toLowerCase();
    const subList = DAILY_QUIZZES.subcategories?.[catKey] || [];
    const subObj = subList.find((s) => String(s.id).toLowerCase() === subKey);
    return (
      subObj?.quizzes?.find((q) => String(q.id) === String(quizId)) || null
    );
  }, [passed, category, subcategory, quizId]);

  if (!quiz) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <h2 className={styles.notFound}>Quiz not found</h2>
          <Button
            label="Go Back"
            variant="outline"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  // dynamic values & defaults
  const postedDate = quiz.date ? formatDate(quiz.date) : null;
  const introText =
    quiz.description ||
    `${
      quiz.title
    } — This quiz contains several curated questions designed to help you revise important topics. Attempt the quiz to check your understanding and track progress. (Posted on ${
      postedDate || "recently"
    }.)`;

  // second section heading (Why Participate)
  const whyHeading = `Why Participate in the ${quiz.title}?`;
  const whyText =
    quiz.why ||
    `Participating in ${quiz.title} helps reinforce your understanding, improves recall, and highlights areas needing improvement. Regular practice with such quizzes will boost confidence and help with targeted revision.`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.left}>
            {/* small title-like breadcrumb/link */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={styles.titleLink}
            >
              {quiz.title}
            </a>
          </div>

          <div className={styles.right}>
            {postedDate && (
              <div className={styles.date}>Posted on : {postedDate}</div>
            )}
          </div>
        </div>

        <div className={styles.body}>
          {/* Lead paragraph (dynamic/default) */}
          <p className={styles.excerpt}>{introText}</p>

          {/* Secondary heading + paragraph */}
          <h3 className={styles.whyHeading}>{whyHeading}</h3>
          <p className={styles.whyText}>{whyText}</p>

          <div className={styles.actions}>
            <Button
              label="Take Quiz"
              variant="primary"
              onClick={() =>
                navigate(
                  `/dailyquizzes/${category}/${subcategory}/${quizId}/play`,
                  { state: quiz }
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
