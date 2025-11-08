// src/pages/BookDetailPage/BookDetailPage.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import CategoryHeader from "../../../components/CategoryHeader/CategoryHeader";
import Button from "../../../components/Button/Button";
import EBOOKS_DATA from "../../../data/ebooks";
import styles from "./BookDetailPage.module.css";

export default function BookDetailPage() {
  const { id, category, subcategory } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");

  const catKey = category?.toLowerCase();
  const subKey = subcategory?.toLowerCase();

  const catInfo = useMemo(
    () => EBOOKS_DATA.categories.find((c) => c.key === catKey),
    [catKey]
  );

  const book = useMemo(() => {
    const subs = EBOOKS_DATA.subcategories[catKey] || [];
    const sub = subs.find((s) => s.id === subKey);
    return sub?.books?.find((b) => String(b.id) === String(id)) || null;
  }, [catKey, subKey, id]);

  if (!book) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: 40 }}>
          <h2>Book not found</h2>
          <p>
            We couldn’t find the requested book: <strong>{id}</strong>.
          </p>
          <button type="button" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const headerTitle = `${catInfo?.title || "E-Books"} – ${
    subcategory?.toUpperCase() || ""
  }`;

  // Download handler
  const handleDownloadClick = () => {
    if (!book.pdfUrl) {
      alert("No PDF available for this book.");
      return;
    }

    try {
      const a = document.createElement("a");
      a.href = book.pdfUrl;
      const safeTitle = (book.title || "ebook")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      a.download = `${safeTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      window.open(book.pdfUrl, "_blank", "noopener");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header
        imageSrc={catInfo?.hero || "/images/ebooks-hero.png"}
        alt={`${headerTitle} hero`}
      />

      <CategoryHeader
        title={headerTitle}
        languages={[
          { key: "en", label: "English" },
          { key: "hi", label: "Hindi" },
          { key: "te", label: "Telugu" },
        ]}
        active={localStorage.getItem("bb_lang_code") || "en"}
        onChange={(k) => localStorage.setItem("bb_lang_code", k)}
        showDivider
      />

      <main className={styles.contentArea}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab === "description" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab === "book" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("book")}
          >
            Book
          </button>
        </div>

        <section className={styles.panel}>
          {activeTab === "description" ? (
            <div className={styles.description}>
              <div className={styles.aboutbook}>About Book:</div>
              <p className={styles.descText}>
                {book.description ||
                  "This resource provides structured study material, practice questions, and strategy guidance for exam preparation."}
              </p>

            <div className={styles.whatwillyouget}>What you will get:</div>
              <ul className={styles.bullets}>
                <li>Comprehensive syllabus coverage</li>
                <li>Expert-led interactive classes</li>
                <li>Time management & exam strategies</li>
                <li>Doubt-solving sessions</li>
                <li>Mock tests & performance analysis</li>
              </ul>

             <div className={styles.downloadthestructure}>Download the Structure:</div>
              <div className={styles.pdfCard}>
                <div className={styles.pdfIcon}>
                  <img
                    src="/images/pdf-icon.png"
                    alt="PDF"
                    onError={(e) =>
                      (e.currentTarget.src = "/images/pdf-placeholder.png")
                    }
                  />
                </div>

                <div className={styles.pdfMeta}>
                  <div className={styles.pdfTitle}>{book.title}</div>

                  <div className={styles.pdfActions}>
                    {/* Reduced-size Download Button */}
                    <Button
                      label="Download"
                      onClick={handleDownloadClick}
                      className={styles.smallDownload}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.bookViewer}>
              {book.pdfUrl ? (
                <iframe
                  src={book.pdfUrl}
                  title={book.title}
                  className={styles.pdfIframe}
                />
              ) : (
                <div className={styles.noPdf}>
                  <p>No preview available for this book.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
