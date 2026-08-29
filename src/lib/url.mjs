/**
 * Every link on the site goes through `url()`.
 *
 * The site is served from the domain root, so every generated href, asset
 * link and image src is root-relative (starts with `/`). Set BASE_PATH to
 * override this at build time — e.g. for previewing under a sub-path.
 */

let basePath = '/';
let origin = '';

export function configureUrls({ base, siteUrl }) {
  const raw = process.env.BASE_PATH ?? base ?? '/';
  basePath = raw.startsWith('/') ? raw : `/${raw}`;
  if (!basePath.endsWith('/')) basePath += '/';
  origin = (siteUrl ?? '').replace(/\/+$/, '');
}

export function getBasePath() {
  return basePath;
}

/** Site-relative URL. `url('france/paris')` → `/france/paris/`. */
export function url(path = '') {
  const clean = String(path).replace(/^\/+/, '');
  if (!clean) return basePath;
  // Directory-style URLs for pages; anything with a file extension is left alone.
  const needsSlash = !/\.[a-z0-9]{2,5}$/i.test(clean) && !clean.endsWith('/');
  return basePath + clean + (needsSlash ? '/' : '');
}

/** Absolute URL, for canonical tags, Open Graph and the sitemap. */
export function absolute(path = '') {
  return origin + url(path);
}

/** Filesystem-relative output path for a site path. */
export function outputPath(path = '') {
  const clean = String(path).replace(/^\/+/, '').replace(/\/+$/, '');
  if (!clean) return 'index.html';
  if (/\.[a-z0-9]{2,5}$/i.test(clean)) return clean;
  return `${clean}/index.html`;
}

/** Convert an arbitrary string to a URL-safe slug. */
export function slugify(value) {
  return String(value)
    .replace(/[İı]/g, 'i') // Turkish dotted/dotless I survives NFD intact
    .replace(/ß/g, 'ss')
    .replace(/æ/gi, 'ae')
    .replace(/ø/gi, 'o')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
