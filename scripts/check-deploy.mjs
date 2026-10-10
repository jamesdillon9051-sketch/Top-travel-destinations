#!/usr/bin/env node
/**
 * Pre-deploy sanity check. Run it after `node build.mjs` (`npm test` does
 * both): it fails if what is committed would not deploy cleanly to the host.
 *
 * It checks the things that have broken or could break a deploy from main —
 * a missing index, hand-edited or stale .htaccess files, a domain that
 * disagrees between site.json / CNAME / sitemap / canonical tags, file names a
 * host might mangle, and links to localhost or to /docs/.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { docsHtaccess, rootHtaccess } from '../src/lib/htaccess.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = path.join(ROOT, 'docs');

const failures = [];
const notes = [];
const fail = (message) => failures.push(message);
const exists = (file) => stat(file).then(() => true, () => false);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const site = JSON.parse(await readFile(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const siteUrl = String(site.siteUrl || '').replace(/\/+$/, '');
if (!siteUrl) fail('site.json has no siteUrl, so canonical tags and the sitemap cannot be absolute');

// ---- 1. the files a host needs --------------------------------------------
for (const file of [
  'docs/index.html',
  'docs/404.html',
  'docs/robots.txt',
  'docs/sitemap.xml',
  'docs/assets/site.css',
  'docs/assets/site.js',
  'docs/.htaccess',
  '.htaccess'
]) {
  if (!(await exists(path.join(ROOT, file)))) fail(`missing ${file} — run \`node build.mjs\``);
}

// ---- 2. .htaccess files are generated, never hand-edited -------------------
const expected = [
  ['docs/.htaccess', docsHtaccess({ domain: site.customDomain })],
  ['.htaccess', rootHtaccess({ domain: site.customDomain })]
];
for (const [file, text] of expected) {
  const actual = await readFile(path.join(ROOT, file), 'utf8').catch(() => null);
  if (actual !== null && actual !== text) {
    fail(`${file} is out of date — run \`node build.mjs\` (edit src/lib/htaccess.mjs, not the file)`);
  }
}

// ---- 3. one domain, everywhere --------------------------------------------
if (site.customDomain) {
  if (siteUrl !== `https://${site.customDomain}`) {
    fail(`site.json siteUrl (${siteUrl}) and customDomain (${site.customDomain}) disagree`);
  }
  const cname = await readFile(path.join(DOCS, 'CNAME'), 'utf8').catch(() => '');
  if (cname.trim() !== site.customDomain) fail(`docs/CNAME is "${cname.trim()}", expected ${site.customDomain}`);
}
const robots = await readFile(path.join(DOCS, 'robots.txt'), 'utf8').catch(() => '');
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail('robots.txt does not point at the sitemap on siteUrl');

const home = await readFile(path.join(DOCS, 'index.html'), 'utf8').catch(() => '');
if (!home.includes(`rel="canonical" href="${siteUrl}/"`)) fail('the home page canonical tag is not siteUrl');

// ---- 4. every sitemap URL (page and image) points at a real file ------------
const sitemap = await readFile(path.join(DOCS, 'sitemap.xml'), 'utf8').catch(() => '');
const locs = [...sitemap.matchAll(/<(?:image:)?loc>([^<]+)<\/(?:image:)?loc>/g)].map((m) => m[1]);
let sitemapProblems = 0;
for (const loc of locs) {
  if (!loc.startsWith(`${siteUrl}/`)) {
    fail(`sitemap URL is not on ${siteUrl}: ${loc}`);
    sitemapProblems++;
  } else {
    const rel = decodeURIComponent(loc.slice(siteUrl.length + 1));
    const file = /\.[a-z0-9]{2,5}$/i.test(rel) ? rel : path.join(rel, 'index.html');
    if (!(await exists(path.join(DOCS, file)))) {
      fail(`sitemap lists ${loc} but docs/${file} does not exist`);
      sitemapProblems++;
    }
  }
  if (sitemapProblems >= 10) break;
}
if (!locs.length) fail('the sitemap lists no URLs');

// ---- 5. file names a host (or a URL) could mangle --------------------------
const files = (await exists(DOCS)) ? await walk(DOCS) : [];
let bytes = 0;
let biggest = { size: 0, file: '' };
for (const file of files) {
  const rel = path.relative(DOCS, file).split(path.sep).join('/');
  if (!/^[A-Za-z0-9._/-]+$/.test(rel) || rel.length > 180) {
    fail(`docs/${rel} has a name hosts or URLs can mangle (spaces, accents, symbols, or too long)`);
  }
  const { size } = await stat(file);
  bytes += size;
  if (size > biggest.size) biggest = { size, file: rel };
}

// ---- 6. pages must not link to localhost or to /docs/ ----------------------
let scanned = 0;
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  scanned++;
  const rel = path.relative(DOCS, file).split(path.sep).join('/');
  if (/https?:\/\/(?:localhost|127\.0\.0\.1)|file:\/\//i.test(html)) fail(`docs/${rel} links to localhost or file://`);
  if (/(?:href|src)="\/docs\//.test(html)) fail(`docs/${rel} links to /docs/ — the site is served from the web root`);
}

notes.push(
  `${files.length} files, ${(bytes / 1e9).toFixed(2)} GB in docs/ (largest: ${biggest.file}, ` +
    `${(biggest.size / 1e6).toFixed(1)} MB), ${scanned} pages scanned, ${locs.length} sitemap URLs checked`
);

if (failures.length) {
  console.error(`Deploy check failed (${failures.length}):`);
  for (const message of failures.slice(0, 25)) console.error(`  ✖ ${message}`);
  if (failures.length > 25) console.error(`  … and ${failures.length - 25} more`);
  process.exit(1);
}
console.log('Deploy check passed.');
for (const note of notes) console.log(`  ${note}`);
