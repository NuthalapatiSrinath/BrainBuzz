import React from "react";
import { useNavigate } from "react-router-dom";
import CurrentAffairsCard from "../../components/CurrentAffairsCard/CurrentAffairsCard";
import styles from "./LatestCurrentAffairsSection.module.css";

export default function LatestCurrentAffairsSection() {
  const navigate = useNavigate();

  // 🦁 The logo file should be in: public/images/lion.png
  // (not src/images) — so you can access it directly by /images/lion.png
  const lionLogo = "/images/lion.png";

  const categories = [
    {
      id: "upsc",
      title: "UPSC Current Affairs",
      shortName: "UPSC",
      color: "var(--Utility_Color3)", // pink from your index.css
      logo: lionLogo,
      items: [
        {
          id: "1",
          title: "Ladakh Protests over Statehood Demand",
          href: "/upsc/ladakh",
        },
        { id: "2", title: "Mission Sudarshan Chakra", href: "/upsc/sudarshan" },
        {
          id: "3",
          title: "2025 India–Pakistan Conflict / Operation Sindoor",
          href: "/upsc/sindoor",
        },
        {
          id: "4",
          title: "2025 Vice Presidential Election in India",
          href: "/upsc/vp",
        },
      ],
    },
    {
      id: "ssc",
      title: "SSC Current Affairs",
      shortName: "SSC",
      color: "var(--Utility_Color1)", // light blue
      logo: lionLogo,
      items: [
        {
          id: "1",
          title: "Ladakh Protests over Statehood Demand",
          href: "/ssc/ladakh",
        },
        { id: "2", title: "Mission Sudarshan Chakra", href: "/ssc/sudarshan" },
        {
          id: "3",
          title: "2025 India–Pakistan Conflict / Operation Sindoor",
          href: "/ssc/sindoor",
        },
        {
          id: "4",
          title: "2025 Vice Presidential Election in India",
          href: "/ssc/vp",
        },
      ],
    },
    {
      id: "appsc",
      title: "APPSC Current Affairs",
      shortName: "APPSC",
      color: "var(--Utility_Color2)", // green
      logo: lionLogo,
      items: [
        {
          id: "1",
          title: "Ladakh Protests over Statehood Demand",
          href: "/appsc/ladakh",
        },
        {
          id: "2",
          title: "Mission Sudarshan Chakra",
          href: "/appsc/sudarshan",
        },
        {
          id: "3",
          title: "2025 India–Pakistan Conflict / Operation Sindoor",
          href: "/appsc/sindoor",
        },
        {
          id: "4",
          title: "2025 Vice Presidential Election in India",
          href: "/appsc/vp",
        },
      ],
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Latest Current Affairs</h2>
        <span className={styles.headingUnderline}></span>
      </div>

      <p className={styles.subtitle}>
        Check the categories and choose the category that best fits your exam
        preparation path.
      </p>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <CurrentAffairsCard
            key={cat.id}
            title={cat.title}
            shortName={cat.shortName}
            color={cat.color}
            logo={cat.logo} // 🦁 comes from /public/images/lion.png
            items={cat.items}
            onNavigate={(href) => navigate(href)}
          />
        ))}
      </div>
    </section>
  );
}
