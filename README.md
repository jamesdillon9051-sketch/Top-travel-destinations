# Travel Vault

A static travel-planning site: **ten hand-picked destinations in every country it covers**,
each with its own full guide. Live at <https://travelvault.online>.

Each destination page covers what is actually worth seeing, what to eat and where, which
neighbourhood to sleep in, how to get around, when to go, a day-by-day itinerary, travel
tips and an FAQ. Each country gets a structured country page listing its ten destinations
plus a separate long-form travel guide that ties them into real trips. Cross-country
articles cover seasons, budgets and trains.

The country list lives in `src/data/countries/`. Every count shown on the site (countries,
destinations, pages) is derived from that data at build time, so nothing needs updating by
hand when a country is added.

## How it works

A zero-dependency Node generator. Content lives as JSON in `src/data`, templates are
plain functions returning HTML strings, and the output is static HTML written to `docs/`.
There is no framework, no `node_modules` and no build step for the reader.

```
build.mjs                      load → validate → render → write docs/ (+ the .htaccess files)
scripts/fetch-images.mjs       Wikimedia Commons → licence check → WebP → credits.json
scripts/check-links.mjs        assert every internal link resolves to a built file
scripts/check-deploy.mjs       pre-deploy checks: domain, sitemap, file names, .htaccess
scripts/search-commons.mjs     authoring aid: find licence-clean image candidates
src/lib/                       html helpers, URLs, content loading, validation, markup,
                               htaccess.mjs (the Apache/LiteSpeed config, see Deploying)
src/templates/                 layout, partials, home, country, guide, destination,
                               article, index pages
src/assets/                    hand-written CSS and progressive-enhancement JS
src/data/
  site.json                    site config (domain, base path) and home page content
  countries/<slug>.json        country pages
  guides/<slug>.json           long-form country travel guides
  destinations/<country>/*.json
  articles/*.json
content/images/                committed WebP renditions + credits.json
docs/                          build output — committed, and what the web host serves
.htaccess                      generated web-server config for the repo root (see Deploying)
```

## Commands

```bash
npm run build        # build to docs/ using the production base path
npm run build:local  # build with BASE_PATH=/ so docs/ can be served directly
npm run serve        # build locally and serve docs/ at http://localhost:8080
npm run check        # verify every internal link resolves
npm run check:deploy # verify the committed output is deployable (see Deploying)
npm test             # build + link check + deploy check
npm run images       # fetch any missing images from Wikimedia Commons
```

`DEV=1` downgrades content-rule failures to warnings, which is useful while a country is
half-written. A normal build is strict.

## Content rules

`src/lib/validate.mjs` fails the build rather than letting fifty pages drift. It enforces
that each country lists exactly ten destinations that exist and belong to it, that things
to do and foods to try are five to seven items on both country and destination pages,
that every required section is present and non-empty, that every internal reference
resolves, and that **no image is reused between two destinations**.

Authored copy can link to other pages inline with a `[[slug]]` token — `[[paris]]`,
`[[paris|the capital]]`, `[[c:france]]` for a country, `[[a:europe-by-train]]` for an
article. An unknown target fails the build.

## Images and licensing

Every photograph comes from Wikimedia Commons under a free licence — public domain, CC0,
CC BY or CC BY-SA. `scripts/fetch-images.mjs` queries the Commons API for each file's
licence metadata, **rejects anything outside that allowlist**, downloads via
`Special:FilePath`, converts to WebP at two sizes with Pillow, and records photographer,
licence and source URL in `content/images/credits.json`.

Attribution renders as a credit line beneath every image and on the `/image-credits/`
page. The images are committed, so the fetch script only needs to run when new content is
added. It needs Python with Pillow; without it, source JPEGs are kept and a warning is
printed.

`scripts/search-commons.mjs "<query>"` lists licence-clean, high-resolution candidates
when adding a new destination.

## Deploying

The site is static and **`main` is what gets deployed**: the production host (Hostinger →
GitHub auto-deploy, branch `main`, domain `travelvault.online`) redeploys on every push to
`main`. `docs/` is committed build output, so the host never has to build anything.

### Publishing a change

1. Edit `src/data`, `src/templates` or `src/assets`.
2. Run `npm test`. It rebuilds `docs/`, checks every internal link and runs the deploy check.
3. Commit the source **and** the regenerated `docs/` (plus `.htaccess` if it changed) and
   merge to `main`.

`.github/workflows/ci.yml` repeats step 2 on every push and pull request, and also fails if
the committed `docs/` is stale — the one way a deploy from `main` can go quietly wrong is
publishing source changes without the rebuilt output.

### How `main` becomes the web root

Hostinger's Git deploy copies the repository into `public_html`, so the repo root is the
web root even though the site lives in `docs/`. The generated **root `.htaccess`** bridges
that: it serves `docs/` as the site root, blocks `src/`, `content/`, `scripts/`, the build
files and every dotfile (`.git` included), and answers `/docs/...` with a redirect to the
clean URL. **`docs/.htaccess`** carries the same shared rules (clean 404 page, compression,
caching, security headers, https and no-www redirects for the production domain) for hosts
that deploy `docs/` directly — if the deploy screen offers a source folder, set it to
`docs` and nothing else needs to change.

Both files are written by `node build.mjs` from `src/lib/htaccess.mjs`. Edit that module,
never the generated files; `npm run check:deploy` fails if either has drifted.

### Things to know

- `docs/` is wiped and rebuilt on every build. Anything placed there by hand disappears;
  add it to `build.mjs` instead (that is how `CNAME`, `.htaccess` and `robots.txt` are made).
- The domain comes from `src/data/site.json` (`siteUrl`, `customDomain`); canonical tags,
  the sitemap, `robots.txt`, `CNAME` and the redirects all follow it.
- The deploy check enforces ASCII file names, a sitemap that matches the built files, and
  no links to `localhost` or `/docs/`.
- GitHub Pages still works: **Settings → Pages → Deploy from a branch → `main` / `/docs`**.
