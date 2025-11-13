// src/components/LatestCurrentAffairsSection/LatestCurrentAffairsSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CurrentAffairsCard from "../../components/CurrentAffairsCard/CurrentAffairsCard";
import styles from "./LatestCurrentAffairsSection.module.css";

/**
 * Home section that shows many category cards.
 * Each card's items point to /currentaffairs/:category/:subId
 */
export default function LatestCurrentAffairsSection() {
  const navigate = useNavigate();
  const lionLogo = "/images/lion.png";

  const categories = [
    {
      id: "upsc",
      title: "UPSC Current Affairs",
      color: "#f2b6c3",
      subId: "ias",
    },
    {
      id: "cgl",
      title: "SSC CGL Current Affairs",
      color: "#bfe6ee",
      subId: "general",
    },
    {
      id: "ssc",
      title: "SSC Current Affairs",
      color: "#9fd8c7",
      subId: "general",
    },
    {
      id: "appsc",
      title: "APPSC Current Affairs",
      color: "#c9f0e1",
      subId: "appsc-1",
    },
    {
      id: "banking",
      title: "Banking Current Affairs",
      color: "#efe6ff",
      subId: "banking-news",
    },
    {
      id: "state",
      title: "State Current Affairs",
      color: "#fff0e0",
      subId: "state-general",
    },
    {
      id: "international",
      title: "International Current Affairs",
      color: "#e8f8ff",
      subId: "world",
    },
    {
      id: "books",
      title: "Books & Authors",
      color: "#fff6e6",
      subId: "books-authors",
    },
    {
      id: "sports",
      title: "Sports Current Affairs",
      color: "#f9f0ff",
      subId: "sports-main",
    },
    {
      id: "awards",
      title: "Awards Current Affairs",
      color: "#f0fff4",
      subId: "awards-list",
    },
    {
      id: "economy",
      title: "Economy Current Affairs",
      color: "#f4f7ff",
      subId: "economy-main",
    },
    {
      id: "science",
      title: "Science & Tech",
      color: "#eef9ff",
      subId: "science-tech",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Latest Current Affairs</h2>
        <span className={styles.headingUnderline} />
      </div>

      <p className={styles.subtitle}>
        Select a category to view the latest items for that exam or topic.
      </p>

      <div className={styles.grid}>
        {categories.map((cat) => {
          const href = `/currentaffairs/${cat.id}/${cat.subId}`;
          // show 4 dummy list items per card (you can customize later)
          const items = [
            {
              id: `${cat.id}-1`,
              title: "Ladakh Protests over Statehood Demand",
              href,
            },
            { id: `${cat.id}-2`, title: "Mission Sudarshan Chakra", href },
            {
              id: `${cat.id}-3`,
              title: "2025 India–Pakistan Conflict / Operation Sindoor",
              href,
            },
            {
              id: `${cat.id}-4`,
              title: "2025 Vice Presidential Election in India",
              href,
            },
          ];

          return (
            <div key={cat.id} className={styles.gridItem}>
              <CurrentAffairsCard
                title={cat.title}
                color={cat.color}
                logo={lionLogo}
                items={items.map((it) => ({
                  id: it.id,
                  title: it.title,
                  onClick: () => navigate(it.href),
                  href: it.href,
                }))}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
