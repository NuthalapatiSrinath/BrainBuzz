import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HomePage.module.css";
import LatestCurrentAffairsSection from "../../sections/LatestCurrentAffairsSection/LatestCurrentAffairsSection";

export default function HomePage() {
  const [active, setActive] = useState(0); // 0 => hero1 front, 1 => hero2 front

  const imgs = [
    { id: 0, src: "/images/goals.png", alt: "Hero 1" },
    { id: 1, src: "/images/hero2.jpg", alt: "Hero 2" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive((s) => (s === 0 ? 1 : 0)), 3000);
    return () => clearInterval(t);
  }, []);

  // Front image motion variant
  const frontImage = {
    initial: { opacity: 0, y: 12, scale: 0.99 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1.02,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
        y: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 6,
          ease: "easeInOut",
        },
        scale: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 6.5,
          ease: "easeInOut",
        },
      },
    },
    exit: {
      opacity: 0,
      y: -14,
      scale: 0.98,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  // Back image motion variant
  const backImage = {
    initial: { opacity: 0, y: -6, scale: 0.96 },
    animate: {
      opacity: 1,
      y: -16,
      scale: 0.98,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
        y: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 7.5,
          ease: "easeInOut",
        },
        scale: {
          repeat: Infinity,
          repeatType: "mirror",
          duration: 8,
          ease: "easeInOut",
        },
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <div className={styles.container} aria-hidden="false">
        <div className={styles.stack}>
          <AnimatePresence initial={false} mode="popLayout">
            {/* FRONT clipping frame */}
            <div
              key={`frame-front-${imgs[active].id}`}
              className={`${styles.card} ${styles.front}`}
              aria-hidden="true"
            >
              <motion.img
                key={`img-front-${imgs[active].id}`}
                src={imgs[active].src}
                alt={imgs[active].alt}
                className={styles.image}
                variants={frontImage}
                initial="initial"
                animate="animate"
                exit="exit"
              />
            </div>

            {/* BACK clipping frame */}
            <div
              key={`frame-back-${imgs[active === 0 ? 1 : 0].id}`}
              className={`${styles.card} ${styles.back}`}
              aria-hidden="true"
            >
              <motion.img
                key={`img-back-${imgs[active === 0 ? 1 : 0].id}`}
                src={imgs[active === 0 ? 1 : 0].src}
                alt={imgs[active === 0 ? 1 : 0].alt}
                className={styles.image}
                variants={backImage}
                initial="initial"
                animate="animate"
                exit="exit"
              />
            </div>
          </AnimatePresence>
        </div>
      </div>

      {/* Current Affairs Section */}
      <div className={styles.currentAffairs}>
        <LatestCurrentAffairsSection />
      </div>
    </div>
  );
}
