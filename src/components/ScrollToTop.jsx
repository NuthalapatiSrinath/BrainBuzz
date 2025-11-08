// src/components/ScrollToTop/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Safe ScrollToTop:
 * - Tries several selectors (#Main, #main, first <main>)
 * - Uses requestAnimationFrame + small timeout to allow mounted elements
 * - Falls back to window.scrollTo
 */
export default function ScrollToTop({ behavior = "auto" }) {
    
    
    const { pathname, search, hash } = useLocation();
    useEffect(() => {
     const all = document.querySelectorAll("*");
     if (all && typeof all.scrollTo === "function") {
       all.scrollTo({ top: 0, behavior: "smooth" });
     } else {
       window.scrollTo({ top: 0, behavior: "smooth" });
     }



  }, [pathname, search, hash, behavior]);

  return null;
}
