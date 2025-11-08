// src/utils/googleTranslate.js
// Helper to programmatically switch Google Website Translator languages.
// Keeps previous API but avoids trying to set root domain cookie on 'localhost' or plain IPs.

/**
 * setCookie - small helper to set cookie with optional domain
 * Exported so other code (if any) can call it.
 */
export function setCookie(name, value, days, domain = null) {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + d.toUTCString();
  }
  const domainStr = domain ? "; domain=" + domain : "";
  // ensure we don't accidentally append "null"
  document.cookie = name + "=" + (value || "") + expires + "; path=/" + domainStr;
}

function isValidRootDomainForCookie(hostname) {
  if (!hostname) return false;
  // avoid setting root domain cookie on localhost or numeric IPs
  if (hostname === "localhost") return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return false;
  return true;
}

/**
 * translatePage(lang)
 * lang: 'en' | 'hi' | 'te'
 * Sets cookies + localStorage and forces a small reload so the Google widget picks it up.
 */
export function translatePage(lang) {
  if (!lang) return;

  try {
    // persist for future full-loads
    localStorage.setItem("bb_lang_code", lang);

    const googtrans = `/en/${lang}`;

    // set cookie for current host
    setCookie("googtrans", googtrans, 7);

    // set cookie for root domain only when valid (skip for localhost / IPs)
    try {
      const hostname = window.location.hostname;
      if (isValidRootDomainForCookie(hostname)) {
        setCookie("googtrans", googtrans, 7, "." + hostname);
      }
    } catch (e) {
      // ignore domain cookie failures
      // some environments may throw when attempting domain operations
    }
  } catch (e) {
    console.warn("translatePage cookie write failed", e);
  }

  // Try to re-load google translate script in hidden iframe then force page reload.
  // Reload is required for Google widget to detect the cookie change.
  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://translate.google.com/translate_a/element.js";
    document.body.appendChild(iframe);
    setTimeout(() => {
      // use replace so user history isn't polluted
      window.location.replace(window.location.href);
    }, 350);
  } catch (e) {
    // fallback
    window.location.replace(window.location.href);
  }
}

/**
 * getCurrentTranslatedLang - attempts to read current language:
 * checks cookie first then localStorage fallback.
 */
export function getCurrentTranslatedLang() {
  const m = document.cookie.match(/(?:^|; )googtrans=(?:\/[a-z]{2}\/)?([a-z]{2})/i);
  if (m && m[1]) return m[1];
  return localStorage.getItem("bb_lang_code") || "en";
}
