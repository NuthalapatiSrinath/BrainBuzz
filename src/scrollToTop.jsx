// src/components/ScrollToTop/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 *
 * Automatically scrolls the window to the top whenever the route changes.
 * Works for path, query, and hash changes.
 *
 * Usage:
 * Place <ScrollToTop /> inside your main layout component
 * (e.g., DashboardLayout or App.js) so it runs for all routes.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  
  useEffect(() => {
    // Scroll to top instantly — change to "smooth" for smooth scroll
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  }, [pathname, search, hash]);

  return null;
}
