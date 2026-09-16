/**
 * Builds a page's `<meta name="keywords">` list from the same structured
 * content already used to render it — never invented terms, just the real
 * names, regions, categories and highlights that are already on the page.
 */

/** Strips wikilink markup ([[slug|Label]] -> Label) and HTML-escapes-unsafe chars for a plain keyword phrase. */
function clean(value) {
  return String(value)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Flattens the given values (strings, arrays of strings, or falsy filler),
 * cleans each, drops empties/duplicates (case-insensitive) while keeping
 * first-seen casing, and caps the result — a "keywords" tag with hundreds of
 * terms reads as spam, not signal, so this keeps lists generous but real.
 * The cap is high enough that the homepage can list every country covered.
 */
export function keywords(...groups) {
  const seen = new Set();
  const out = [];
  for (const group of groups) {
    const values = Array.isArray(group) ? group : [group];
    for (const raw of values) {
      if (!raw) continue;
      const text = clean(raw);
      if (!text) continue;
      const key = text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(text);
    }
  }
  return out.slice(0, 45);
}
