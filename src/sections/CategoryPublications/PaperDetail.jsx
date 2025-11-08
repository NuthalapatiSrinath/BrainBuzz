// src/sections/PaperDetail/PaperDetail.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import CategoryHeader from "../../components/CategoryHeader/CategoryHeader";
import CurrentAffairsCard from "../../components/CurrentAffairsCard/CurrentAffairsCard";
import Button from "../../components/Button/Button";
import PREVIOUS_PAPERS from "../../data/previousPapers";
import styles from "./PaperDetail.module.css";

/*
  Route expected:
    /previous-papers/:mainCategory/:subCategory/:paperId
  Accepts alternate param names too (category / subcategory).
*/

export default function PaperDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const main = params.mainCategory || params.category;
  const sub = params.subCategory || params.subcategory;
  const paperId = params.paperId;

  const dataCategory = PREVIOUS_PAPERS[main] || null;
  const subcatObj = dataCategory?.subcategories?.[sub] || null;

  const paper = useMemo(() => {
    if (!subcatObj || !paperId) return null;
    // Compare as strings so numeric vs string id mismatch doesn't break lookup.
    return (
      subcatObj.papers?.find((p) => String(p.id) === String(paperId)) || null
    );
  }, [subcatObj, paperId]);

  // PDF field may be named pdfUrl or pdf in different data variants
  const pdfUrl = paper?.pdfUrl || paper?.pdf || null;

  const latestItems = dataCategory?.latest || [
    { id: 1, title: "No updates", href: "#" },
  ];

  // safe fallback if paper not found
  if (!paper) {
    return (
      <div style={{ padding: 48 }}>
        <h2>Paper not found</h2>
        <p>
          The requested paper could not be found under {main}/{sub}/{paperId}.
        </p>

        <p style={{ color: "#6b7280" }}>
          Debug tips:
          <br />• Check that <code>PREVIOUS_PAPERS[{main}]</code> exists and has
          a subcategory <code>{sub}</code>.
          <br />• Ensure each paper object has an <code>id</code> (string or
          number) and a <code>pdf</code> or <code>pdfUrl</code> pointing to a
          served path (e.g. <code>/pdfs/abc.pdf</code>).
        </p>

        <div style={{ marginTop: 16 }}>
          <Button label="Go back" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  // compute base for back nav (for breadcrumb/back)
  const backPath = `/previous-papers/${main}/${sub}`;

  return (
    <div className={styles.pageWrap}>
      {/* Header + category hero */}
      <Header
        imageSrc={dataCategory?.hero || "/images/default-hero.png"}
        alt={(main || "Category").toUpperCase()}
      />

      <CategoryHeader
        title={`${(sub || "")
          .toString()
          .toUpperCase()} - Previous Question Papers`}
        active="English"
      />

      <div className={styles.contentContainer}>
        {/* LEFT column: paper + viewer */}
        <div className={styles.leftColumn}>
          {/* Title row (keeps title separate) */}
          <div className={styles.topRow}>
            <div>
              <h1 className={styles.title}>{paper.title}</h1>
              {/* removed the metaSmall here to avoid duplicate date */}
            </div>
          </div>

          {/* Viewer card: viewer header (published date + download) and iframe */}
          <div className={styles.viewerCard}>
            <div className={styles.viewerHeader}>
              <div className={styles.published}>
                Published Date :{" "}
                <div>
                  {paper.publishedDate || paper.year || "Unknown"}
                </div>
              </div>

              <div className={styles.viewerActions}>
                {pdfUrl ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button label="Download" />
                  </a>
                ) : (
                  <Button
                    label="Download"
                    onClick={() => alert("No PDF available for download")}
                  />
                )}
              </div>
            </div>

            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title={paper.title}
                className={styles.pdfIframe}
              />
            ) : (
              <div className={styles.noPdf}>
                <p>No PDF available.</p>
                {paper.pdf ? (
                  <p>
                    Link:{" "}
                    <a
                      href={paper.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {paper.pdf}
                    </a>
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            <Button label="Back to list" onClick={() => navigate(backPath)} />
          </div>
        </div>

        {/* RIGHT column: latest/current affairs card */}
        <aside className={styles.rightColumn}>
          <CurrentAffairsCard
            title="Latest"
            items={latestItems}
            color="#9DE5E9"
          />
        </aside>
      </div>
    </div>
  );
}
