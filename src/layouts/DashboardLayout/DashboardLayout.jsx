import React, { useEffect, useRef, useState } from "react";
import styles from "./DashboardLayout.module.css";
import { Outlet } from "react-router";
import TopBar from "../../pages/TopBar/TopBar";

function DashboardLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const topbarRef = useRef(null);
  const measurerRef = useRef({ raf: 0, mo: null, ro: null });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const setCssTopbarHeight = (heightPx) => {
      document.documentElement.style.setProperty(
        "--topbar-height",
        `${heightPx}px`
      );
    };

    const measureAndSet = () => {
      if (!topbarRef.current) return;
      // measure the actual rendered height
      const measured = topbarRef.current.getBoundingClientRect().height || 0;

      // get min/max from CSS custom props (they include "px" so parse)
      const rootStyle = getComputedStyle(document.documentElement);
      const min = parseInt(
        rootStyle.getPropertyValue("--topbar-min") || "56",
        10
      );
      const max = parseInt(
        rootStyle.getPropertyValue("--topbar-max") || "140",
        10
      );

      const height = clamp(Math.round(measured), min, max);
      setCssTopbarHeight(height);
    };

    // schedule measurement on next frame (gives chance for layout to settle)
    const scheduleMeasure = () => {
      cancelAnimationFrame(measurerRef.current.raf);
      measurerRef.current.raf = requestAnimationFrame(measureAndSet);
    };

    // initial measurement (try fonts.ready first)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          scheduleMeasure();
        })
        .catch(() => scheduleMeasure());
    } else {
      scheduleMeasure();
    }

    // update on resize
    window.addEventListener("resize", scheduleMeasure, { passive: true });

    // ResizeObserver: watches for size changes of the topbar element
    if (typeof ResizeObserver !== "undefined") {
      measurerRef.current.ro = new ResizeObserver(scheduleMeasure);
      if (topbarRef.current) measurerRef.current.ro.observe(topbarRef.current);
    }

    // MutationObserver: watches for DOM changes inside TopBar (icons, menu, language pill renders)
    if (typeof MutationObserver !== "undefined") {
      measurerRef.current.mo = new MutationObserver(scheduleMeasure);
      if (topbarRef.current)
        measurerRef.current.mo.observe(topbarRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
        });
    }

    return () => {
      window.removeEventListener("resize", scheduleMeasure);
      cancelAnimationFrame(measurerRef.current.raf);
      if (measurerRef.current.ro) measurerRef.current.ro.disconnect();
      if (measurerRef.current.mo) measurerRef.current.mo.disconnect();
    };
  }, []);

  return (
    <div className={styles.DashboardLayout}>
      <div className={styles.LeftSection} />
      <div className={styles.RightSection}>
        <div
          ref={topbarRef}
          className={`${styles.TopbarFixed} ${
            isScrolled ? styles.TopbarScrolled : ""
          }`}
        >
          <TopBar />
        </div>

        <main className={styles.Main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
