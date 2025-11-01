import React from "react";
import styles from "./UPSCHeader.module.css";

export default function UPSCHeader() {
  return (
    <div className={styles.heroSection}>
      <div className={styles.logoBox}>
        <img src="/images/upsc.png" alt="UPSC Logo" className={styles.logo} />
      </div>
    </div>
  );
}
