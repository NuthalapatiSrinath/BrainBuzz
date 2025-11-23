// src/api/currentAffairs.js
import api from "./apiClient";

/**
 * Helper - build query string from an object (skips null/undefined)
 */
function buildQuery(query = {}) {
  const qp = new URLSearchParams();
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((x) => qp.append(k, String(x)));
    } else {
      qp.set(k, String(v));
    }
  });
  const s = qp.toString();
  return s ? `?${s}` : "";
}

/**
 * Get all categories
 * GET /currentaffairs/categories
 */
export async function getCategories(opts = {}) {
  try {
    console.log("[API] getCategories()", opts);
    const url = `/currentaffairs/categories${buildQuery(opts)}`;
    const res = await api.get(url);
    console.log("[API] getCategories() ->", res?.data);
    return res.data; // { success: true, data: [...] }
  } catch (err) {
    console.error("[API] getCategories() failed:", err);
    throw err;
  }
}

/**
 * Get category landing (subcategories + counts)
 * GET /currentaffairs/:categoryKey
 */
export async function getCategoryLanding(categoryKey, opts = {}) {
  try {
    console.log(`[API] getCategoryLanding(${categoryKey})`, opts);
    const url = `/currentaffairs/${encodeURIComponent(categoryKey)}${buildQuery(
      opts
    )}`;
    const res = await api.get(url);
    console.log(`[API] getCategoryLanding(${categoryKey}) ->`, res?.data);
    return res.data;
  } catch (err) {
    console.error(`[API] getCategoryLanding(${categoryKey}) failed:`, err);
    throw err;
  }
}

/**
 * Get articles list for subcategory
 * GET /currentaffairs/:categoryKey/:subId/articles
 * query: { q, month, page, limit, lang }
 */
export async function getArticlesList(categoryKey, subId, query = {}) {
  try {
    console.log(
      `[API] getArticlesList(${categoryKey}, ${subId})`,
      JSON.stringify(query)
    );
    const url = `/currentaffairs/${encodeURIComponent(
      categoryKey
    )}/${encodeURIComponent(subId)}/articles${buildQuery(query)}`;
    const res = await api.get(url);
    console.log(
      `[API] getArticlesList(${categoryKey}, ${subId}) ->`,
      res?.data
    );
    return res.data;
  } catch (err) {
    console.error(
      `[API] getArticlesList(${categoryKey}, ${subId}) failed:`,
      err
    );
    throw err;
  }
}

/**
 * Get article detail
 * GET /currentaffairs/:categoryKey/:subId/:articleId
 */
export async function getArticleDetail(
  categoryKey,
  subId,
  articleId,
  opts = {}
) {
  try {
    console.log(
      `[API] getArticleDetail(${categoryKey}, ${subId}, ${articleId})`,
      opts
    );
    const url = `/currentaffairs/${encodeURIComponent(
      categoryKey
    )}/${encodeURIComponent(subId)}/${encodeURIComponent(
      articleId
    )}${buildQuery(opts)}`;
    const res = await api.get(url);
    console.log(
      `[API] getArticleDetail(${categoryKey}, ${subId}, ${articleId}) ->`,
      res?.data
    );
    return res.data;
  } catch (err) {
    console.error(
      `[API] getArticleDetail(${categoryKey}, ${subId}, ${articleId}) failed:`,
      err
    );
    throw err;
  }
}
