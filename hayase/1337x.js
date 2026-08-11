/**
 * 1337x Torrent Provider Extension for Hayase
 * Supports search, category filtering, mirror resolution, and magnet extraction.
 */

export const metadata = {
  id: "1337x",
  name: "1337x",
  version: "1.0.0",
  description: "Searches torrents on 1337x with mirror support, seeders sorting, and magnet link resolution.",
  icon: "https://1337x.to/favicon.ico",
  types: ["anime", "movie", "show", "games", "music", "apps", "other", "all"],
  defaultMirror: "https://1337x.to",
  mirrors: [
    "https://1337x.to",
    "https://1337x.st",
    "https://1337x.ws",
    "https://1337x.eu",
    "https://1337x.se",
    "https://1337x.is",
    "https://1337x.gd"
  ]
};

/**
 * Standard HTTP headers to avoid standard scrapers blocks
 */
function getHeaders() {
  return {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  };
}

/**
 * Clean up HTML text entities and surrounding whitespace
 */
function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Maps Hayase categories to 1337x category names
 */
function mapCategory(category) {
  if (!category) return null;
  const c = String(category).toLowerCase();
  if (c === "anime") return "Anime";
  if (c === "movie" || c === "movies") return "Movies";
  if (c === "show" || c === "shows" || c === "tv") return "TV";
  if (c === "games" || c === "game") return "Games";
  if (c === "music") return "Music";
  if (c === "apps" || c === "software") return "Apps";
  if (c === "other") return "Other";
  return null;
}

/**
 * Parses search result HTML table into structured torrent array
 */
export function parseSearchResultsHtml(html, baseUrl) {
  const results = [];
  if (!html || typeof html !== "string") return results;

  // 1. Browser DOMParser implementation
  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rows = doc.querySelectorAll("table.table-list tbody tr");

      rows.forEach((row, index) => {
        try {
          const nameTd = row.querySelector("td.coll-1.name");
          if (!nameTd) return;

          const links = nameTd.querySelectorAll("a");
          // Second link is usually the title link (first might be category icon)
          let titleEl = null;
          for (let i = 0; i < links.length; i++) {
            const href = links[i].getAttribute("href") || "";
            if (href.includes("/torrent/")) {
              titleEl = links[i];
              break;
            }
          }
          if (!titleEl) return;

          const title = cleanText(titleEl.textContent);
          const path = titleEl.getAttribute("href");
          const fullUrl = path.startsWith("http") ? path : `${baseUrl.replace(/\/$/, "")}${path}`;

          const seedsEl = row.querySelector("td.coll-2.seeds");
          const leechesEl = row.querySelector("td.coll-3.leeches");
          const dateEl = row.querySelector("td.coll-4.date");
          const sizeTd = row.querySelector("td.coll-5.size");
          const uploaderEl = row.querySelector("td.coll-6.uploader a");

          const seeders = seedsEl ? parseInt(seedsEl.textContent.trim(), 10) || 0 : 0;
          const leechers = leechesEl ? parseInt(leechesEl.textContent.trim(), 10) || 0 : 0;
          const date = dateEl ? cleanText(dateEl.textContent) : "";
          
          let size = "";
          if (sizeTd) {
            // Remove nested seeds element if inside size td
            const cloneSize = sizeTd.cloneNode(true);
            const nestedSeeds = cloneSize.querySelector(".seeds");
            if (nestedSeeds) cloneSize.removeChild(nestedSeeds);
            size = cleanText(cloneSize.textContent);
          }

          const uploader = uploaderEl ? cleanText(uploaderEl.textContent) : "";
          const torrentId = path.match(/\/torrent\/(\d+)\//)?.[1] || `1337x-${index}`;

          results.push({
            id: `1337x:${torrentId}`,
            title,
            url: fullUrl,
            path,
            seeders,
            leechers,
            size,
            date,
            uploader,
            provider: "1337x",
            magnet: null
          });
        } catch (err) {
          // Ignore individual row parse error
        }
      });

      if (results.length > 0) return results;
    } catch (e) {
      // Fallback to regex parser
    }
  }

  // 2. Regex parser fallback (for Node.js or environments without DOMParser)
  try {
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match;
    let index = 0;

    while ((match = trRegex.exec(html)) !== null) {
      const trContent = match[1];
      if (!trContent.includes('coll-1') && !trContent.includes('/torrent/')) continue;

      const linkMatch = trContent.match(/<a[^>]+href="(\/torrent\/\d+\/[^"]+\/?)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;

      const path = linkMatch[1];
      const rawTitle = linkMatch[2].replace(/<[^>]+>/g, "");
      const title = cleanText(rawTitle);
      const fullUrl = path.startsWith("http") ? path : `${baseUrl.replace(/\/$/, "")}${path}`;

      const seedsMatch = trContent.match(/class="coll-2 seeds"[^>]*>(\d+)</i);
      const leechesMatch = trContent.match(/class="coll-3 leeches"[^>]*>(\d+)</i);
      const dateMatch = trContent.match(/class="coll-4 date"[^>]*>([^<]+)</i);
      const sizeMatch = trContent.match(/class="coll-5 size[^"]*"[^>]*>([\s\S]*?)(?:<span|<\/td>)/i);
      const uploaderMatch = trContent.match(/class="coll-6 uploader"[^>]*><a[^>]*>([^<]+)</i);

      const seeders = seedsMatch ? parseInt(seedsMatch[1], 10) || 0 : 0;
      const leechers = leechesMatch ? parseInt(leechesMatch[1], 10) || 0 : 0;
      const date = dateMatch ? cleanText(dateMatch[1]) : "";
      
      let size = sizeMatch ? sizeMatch[1].replace(/<[^>]+>/g, "") : "";
      size = cleanText(size);

      const uploader = uploaderMatch ? cleanText(uploaderMatch[1]) : "";
      const torrentId = path.match(/\/torrent\/(\d+)\//)?.[1] || `1337x-${index++}`;

      results.push({
        id: `1337x:${torrentId}`,
        title,
        url: fullUrl,
        path,
        seeders,
        leechers,
        size,
        date,
        uploader,
        provider: "1337x",
        magnet: null
      });
    }
  } catch (err) {
    // Regex parsing failed
  }

  return results;
}

/**
 * Searches 1337x for torrents matching query and parameters
 * @param {Object} options Search options
 * @param {string} options.query Search query term
 * @param {string} [options.category] Optional category ('anime', 'movie', 'show', 'games', 'music', 'apps', 'other')
 * @param {string} [options.mirror] Optional mirror base URL (defaults to metadata.defaultMirror)
 * @param {number} [options.page=1] Page number
 * @param {Function} [options.fetchFn] Custom fetch implementation
 * @returns {Promise<Array>} List of torrent result objects
 */
export async function search({ query, category, mirror, page = 1, fetchFn }) {
  if (!query || typeof query !== "string" || !query.trim()) {
    return [];
  }

  const fetcher = fetchFn || (typeof fetch !== "undefined" ? fetch : null);
  if (!fetcher) {
    console.error("[1337x Extension] No fetch API implementation available.");
    return [];
  }

  const baseUrl = (mirror || metadata.defaultMirror).replace(/\/$/, "");
  const catName = mapCategory(category);
  const cleanQuery = encodeURIComponent(query.trim());
  
  // Construct search URL
  let targetUrl = "";
  if (catName) {
    targetUrl = `${baseUrl}/sort-category-search/${cleanQuery}/${catName}/seeders/desc/${page}/`;
  } else {
    targetUrl = `${baseUrl}/sort-search/${cleanQuery}/seeders/desc/${page}/`;
  }

  try {
    let response = await fetcher(targetUrl, {
      method: "GET",
      headers: getHeaders()
    });

    // Fallback if sorted search yields non-200
    if (!response || !response.ok) {
      const fallbackUrl = catName 
        ? `${baseUrl}/category-search/${cleanQuery}/${catName}/${page}/`
        : `${baseUrl}/search/${cleanQuery}/${page}/`;

      response = await fetcher(fallbackUrl, {
        method: "GET",
        headers: getHeaders()
      });
    }

    if (!response || !response.ok) {
      console.warn(`[1337x Extension] HTTP error: ${response ? response.status : 'No response'} for ${targetUrl}`);
      return [];
    }

    const html = await response.text();
    return parseSearchResultsHtml(html, baseUrl);
  } catch (err) {
    console.error("[1337x Extension] Search failed safely:", err.message || err);
    return [];
  }
}

/**
 * Resolves magnet URI from a 1337x torrent detail page
 * @param {string} detailUrl Full detail page URL or relative path
 * @param {Object} [options] Options object
 * @param {string} [options.mirror] Mirror base URL if relative path provided
 * @param {Function} [options.fetchFn] Custom fetch implementation
 * @returns {Promise<string|null>} Magnet link or null if not found
 */
export async function resolveMagnet(detailUrl, { mirror, fetchFn } = {}) {
  if (!detailUrl) return null;

  const fetcher = fetchFn || (typeof fetch !== "undefined" ? fetch : null);
  if (!fetcher) return null;

  const baseUrl = (mirror || metadata.defaultMirror).replace(/\/$/, "");
  const fullUrl = detailUrl.startsWith("http") ? detailUrl : `${baseUrl}${detailUrl.startsWith('/') ? '' : '/'}${detailUrl}`;

  try {
    const response = await fetcher(fullUrl, {
      method: "GET",
      headers: getHeaders()
    });

    if (!response || !response.ok) return null;

    const html = await response.text();

    // 1. Try regex extraction for magnet link
    const magnetMatch = html.match(/(magnet:\?xt=urn:btih:[^"'\s>]+)/i);
    if (magnetMatch && magnetMatch[1]) {
      return cleanText(magnetMatch[1]);
    }

    // 2. DOMParser fallback if browser context
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const magnetA = doc.querySelector('a[href^="magnet:"]');
      if (magnetA) {
        return magnetA.getAttribute("href");
      }
    }
  } catch (err) {
    console.error("[1337x Extension] resolveMagnet failed:", err.message || err);
  }

  return null;
}

// Module export object for universal compatibility
const extension = {
  metadata,
  search,
  resolveMagnet,
  parseSearchResultsHtml
};

// Global attachment for Hayase/Shiru extension loader environments
if (typeof globalThis !== "undefined") {
  globalThis.Hayase1337x = extension;
}

export default extension;
