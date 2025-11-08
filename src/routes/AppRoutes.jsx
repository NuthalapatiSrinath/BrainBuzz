// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ ADD THIS
import ScrollToTop from "../components/ScrollToTop";

// Layout
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

// Core pages
import HomePage from "../pages/HomePage/HomePage";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import ContactUs from "../pages/ContactUs/ContactUs";

// ========================
// CURRENT AFFAIRS FLOW
// ========================
import CurrentAffairsPage from "../pages/CurrentAffairs/CurrentAffairsPage/CurrentAffairsPage.jsx";
import CurrentAffairsSubcategories from "../pages/CurrentAffairs/CurrentAffairsSubcategories/CurrentAffairsSubcategories.jsx";
import CurrentAffairsArticlePage from "../pages/CurrentAffairs/CurrentAffairsArticlePage/CurrentAffairsArticlePage.jsx";
import CurrentAffairsArticlesPage from "../pages/CurrentAffairs/CurrentAffairsArticlesPage/CurrentAffairsArticlesPage.jsx";

// ========================
// DAILY QUIZZES FLOW
// ========================
import DailyQuizzesPage from "../pages/DailyQuizzes/DailyQuizzesPage/DailyQuizzesPage.jsx";
import DailyQuizzesSubcategories from "../pages/DailyQuizzes/DailyQuizzesSubcategories/DailyQuizzesSubcategories.jsx";
import QuizzesListPage from "../pages/DailyQuizzes/QuizzesListPage/QuizzesListPage.jsx";
import QuizDescriptionPage from "../pages/DailyQuizzes/QuizDescriptionPage/QuizDescriptionPage.jsx";
import QuizPlayPage from "../pages/DailyQuizzes/QuizPlayPage/QuizPlayPage.jsx";
import QuizResultPage from "../pages/DailyQuizzes/QuizResultPage/QuizResultPage.jsx";
import QuizCorrectAnswersPage from "../pages/DailyQuizzes/QuizCorrectAnswersPage/QuizCorrectAnswersPage.jsx";

// ========================
// EBOOKS FLOW (PUBLICATIONS)
// ========================
import EbooksPage from "../pages/Ebooks/EbooksPage/EbooksPage.jsx";
import EbooksSubcategories from "../pages/Ebooks/EbooksSubcategories/EbooksSubcategories.jsx";
import PublicationsPage from "../pages/Ebooks/PublicationsPage/PublicationsPage.jsx";
import BookDetailPage from "../pages/Ebooks/BookDetailPage/BookDetailPage.jsx";

// ========================
// PREVIOUS PAPERS FLOW
// ========================
import PreviousQuestionPapers from "../pages/PreviousQuesitonPapers/PreviousQuestionPapers/PreviousQuestionPapers.jsx";
import PreviousPapersSubcategories from "../pages/PreviousQuesitonPapers/PreviousPapersSubcategories/PreviousPapersSubcategories.jsx";
import CategoryPublications from "../sections/CategoryPublications/CategoryPublications";
import PaperDetail from "../sections/CategoryPublications/PaperDetail";

function AppRoutes() {
  return (
    <>
      {/* 👇 This ensures window scrolls to top whenever route changes */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Home */}
          <Route index element={<HomePage />} />

          {/* ============================================================
              📰 CURRENT AFFAIRS
          ============================================================ */}
          <Route path="currentaffairs" element={<CurrentAffairsPage />} />
          <Route
            path="currentaffairs/:category"
            element={<CurrentAffairsSubcategories />}
          />
          <Route
            path="currentaffairs/:category/:subId"
            element={<CurrentAffairsArticlesPage />}
          />
          <Route
            path="currentaffairs/:category/:subId/:articleId"
            element={<CurrentAffairsArticlePage />}
          />

          {/* ============================================================
              📝 DAILY QUIZZES FLOW
          ============================================================ */}
          <Route path="dailyquizzes" element={<DailyQuizzesPage />} />
          <Route
            path="dailyquizzes/:category"
            element={<DailyQuizzesSubcategories />}
          />
          <Route
            path="dailyquizzes/:category/:subcategory"
            element={<QuizzesListPage />}
          />
          <Route
            path="dailyquizzes/:category/:subcategory/:quizId"
            element={<QuizDescriptionPage />}
          />
          <Route
            path="dailyquizzes/:category/:subcategory/:quizId/play"
            element={<QuizPlayPage />}
          />
          <Route
            path="dailyquizzes/:category/:subcategory/:quizId/result"
            element={<QuizResultPage />}
          />
          <Route
            path="dailyquizzes/:category/:subcategory/:quizId/review"
            element={<QuizCorrectAnswersPage />}
          />

          {/* ============================================================
              📚 E-BOOKS (PUBLICATIONS)
          ============================================================ */}
          <Route path="ebooks" element={<EbooksPage />} />
          <Route path="ebooks/:category" element={<EbooksSubcategories />} />
          <Route
            path="ebooks/:category/:subcategory"
            element={<PublicationsPage />}
          />
          <Route
            path="ebooks/:category/:subcategory/:id"
            element={<BookDetailPage />}
          />

          {/* ============================================================
              📄 PREVIOUS QUESTION PAPERS
          ============================================================ */}
          <Route path="previous-papers" element={<PreviousQuestionPapers />} />
          <Route
            path="previous-papers/:category"
            element={<PreviousPapersSubcategories />}
          />
          <Route
            path="previous-papers/:category/:subcategory"
            element={<CategoryPublications />}
          />
          <Route
            path="previous-papers/:category/:subcategory/:paperId"
            element={<PaperDetail />}
          />

          {/* ============================================================
              🧭 ABOUT & CONTACT
          ============================================================ */}
          <Route path="aboutus" element={<AboutUsPage />} />
          <Route path="contactus" element={<ContactUs />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>404 Not Found</div>}
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
