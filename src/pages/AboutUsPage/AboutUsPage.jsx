import React from "react";
import AboutUsCard from "../../components/AboutUsCard/AboutUsCard";
import styles from "./AboutUsPage.module.css";
import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  Video,
  FileText,
  Lightbulb,
} from "lucide-react";

const cards = [
  {
    title: "50 Online Courses",
    description: "We have approximately 50 online courses",
    bgColor: "var(--Utility_Color3)",
    icon: "/images/aboutus/icons/online-courses.png",
  },
  {
    title: "50 Test Series",
    description: "We have approximately 50 Test Series",
    bgColor: "var(--Utility_Color1)",
    icon: "/images/aboutus/icons/test-series.png",
  },
  {
    title: "Daily Quizzes",
    description: "We Conduct daily quizzes every day",
    bgColor: "#F6D49A",
    icon: "/images/aboutus/icons/quiz.png",
  },
  {
    title: "Live Classes",
    description: "Live Classes and those are youtube integration",
    bgColor: "#93D6C7",
    icon: "/images/aboutus/icons/live-class.png",
  },
  {
    title: "Question Papers",
    description: "Check the previously written question papers",
    bgColor: "var(--Utility_Color3)",
    icon: "/images/aboutus/icons/question-paper.png",
  },
  {
    title: "Current affairs",
    description: "View up to date current affairs here",
    bgColor: "var(--Utility_Color1)",
    icon: "/images/aboutus/icons/current-affairs.png",
  },
];

export default function AboutUsPage() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>About Us</h2>
        </header>

        {/* Hero images directly from public folder */}
        <div className={styles.heroRow}>
          <div className={styles.heroItem}>
            <img
              src="/images/aboutus/aboutus1.webp"
              alt="students studying"
              className={styles.heroImg}
            />
          </div>
          <div className={styles.heroItem}>
            <img
              src="/images/aboutus/about3.webp"
              alt="student on laptop"
              className={styles.heroImg}
            />
          </div>
        </div>
        <div className={styles.aboutText}>
          <h3>Welcome to Brain Buzz Academy</h3>
          <p>
            Brain Buzz Academy is a dedicated learning platform designed to help
            students achieve success in competitive examinations. Our mission is
            to simplify learning through structured courses, high-quality study
            material, test series, quizzes, and current affairs – all crafted by
            experienced educators.
          </p>

          <p>
            Whether you’re preparing for UPSC, SSC, Banking, State PSC, Police
            exams, or simply want to strengthen your general knowledge, Brain
            Buzz provides well-organized, easy-to-understand resources to guide
            your learning journey.
          </p>

          <p>
            With engaging video lessons, daily practice quizzes, previous
            question papers, and interactive live sessions, we aim to make exam
            preparation more effective, accessible, and enjoyable.
          </p>
        </div>

        <p className={styles.subtitle}>Every Thing you need to know</p>

        <div className={styles.cardsGrid}>
          {cards.map((c, idx) => (
            <AboutUsCard
              key={idx}
              title={c.title}
              description={c.description}
              bgColor={c.bgColor}
              icon={c.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
