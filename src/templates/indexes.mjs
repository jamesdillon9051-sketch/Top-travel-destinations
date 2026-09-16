import { html, join, plain } from '../lib/html.mjs';
import { url, absolute } from '../lib/url.mjs';
import { CATEGORY_ORDER, categoryLabel } from '../lib/taxonomy.mjs';
import { inlineName, displayName } from '../lib/text.mjs';
import { keywords as buildKeywords } from '../lib/seo.mjs';
import { layout } from './layout.mjs';
import { section, destinationGrid, articleCard, filterBar, breadcrumbs } from './partials.mjs';

/** /destinations/ — every destination on the site, filterable by type. */
export function renderDestinationsIndex({ site, countryList, destinationList }) {
  const usedCategories = CATEGORY_ORDER.filter((slug) =>
    destinationList.some((place) => (place.categories || []).includes(slug))
  );

  const content = html`
    <div class="page-head">
      <div class="wrap">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'Destinations' }])}
        <h1 class="page-head__title">All ${destinationList.length} destinations</h1>
        <p class="page-head__lead">
          Ten hand-picked places in each of ${countryList.length} countries — major cities, historic
          sites, coastlines, national parks and a few places most lists leave out. Filter by the
          kind of trip you want, or jump straight to a country.
        </p>
        <ul class="chip-row">
          ${join(
            countryList.map(
              (country) => html`<li><a class="chip" href="#${country.slug}">${country.name}</a></li>`
            )
          )}
        </ul>
      </div>
    </div>

    <div class="wrap">${filterBar(usedCategories)}</div>

    ${join(
      countryList.map((country) =>
        section({
          id: country.slug,
          eyebrow: country.continent,
          title: `Best places to visit in ${inlineName(country)}`,
          lead: country.tagline,
          body: html`
            ${destinationGrid(country.places, { ranked: true })}
            <p class="section__more">
              <a class="btn btn--ghost" href="${url(country.slug)}">
                ${displayName(country)} country guide<span aria-hidden="true"> →</span>
              </a>
              <a class="btn btn--ghost" href="${url(`${country.slug}/travel-guide`)}">
                ${displayName(country)} travel guide<span aria-hidden="true"> →</span>
              </a>
            </p>
          `
        })
      )
    )}
  `;

  return layout({
    site,
    title: `All ${destinationList.length} Destinations`,
    description: `Every destination on ${site.title}: ten hand-picked places to visit in each of ${countryList.length} countries, from major cities to national parks and quieter corners worth the detour.`,
    path: 'destinations',
    bodyClass: 'page-index',
    keywords: buildKeywords(
      'travel destinations',
      'best places to visit',
      'things to do',
      'travel guide',
      countryList.map((c) => c.name),
      usedCategories.map((slug) => categoryLabel(slug))
    ),
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `All ${destinationList.length} destinations`,
        url: absolute('destinations')
      }
    ],
    content
  });
}

/** /articles/ */
export function renderArticlesIndex({ site, articleList }) {
  const content = html`
    <div class="page-head">
      <div class="wrap">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'Articles' }])}
        <h1 class="page-head__title">Travel articles</h1>
        <p class="page-head__lead">
          Practical planning pieces that cut across countries — when to go, how to move
          around, what a week actually costs, and how to choose between places that look
          similar on a map but feel nothing alike.
        </p>
      </div>
    </div>

    <div class="wrap section">
      <div class="mini-grid mini-grid--wide">
        ${join(articleList.map((article) => articleCard(article)))}
      </div>
    </div>
  `;

  return layout({
    site,
    title: 'Travel Articles',
    description: `Planning articles from ${site.title}: seasons, budgets, rail travel, road trips and how to choose between destinations.`,
    path: 'articles',
    bodyClass: 'page-index',
    keywords: buildKeywords(
      'travel articles',
      'travel planning',
      'travel tips',
      'trip planning guide',
      articleList.map((a) => plain(a.title))
    ),
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Travel articles',
        url: absolute('articles')
      }
    ],
    content
  });
}

/** /image-credits/ — the attribution page every CC BY-SA image requires. */
export function renderCredits({ site, credits, countryList, destinationList, articleList }) {
  const rows = [];
  // `anchor` is appended after url() resolves href, not before — url() always
  // adds a trailing slash to whatever string it is given, which would land
  // after a fragment baked into href (".../rome#attractions/") if passed in.
  const push = (file, context, href, anchor) => {
    const credit = credits[file];
    if (credit) rows.push({ file, credit, context, href, anchor });
  };

  /** The optional per-item images on attractions/thingsToDo/foods, linked to their section. */
  const pushItems = (items, anchor, place, href) => {
    for (const item of items || []) {
      if (item.image?.file) push(item.image.file, `${item.name || item.title} — ${place}`, href, anchor);
    }
  };

  if (site.hero?.file) push(site.hero.file, 'Home page', '');
  for (const country of countryList) {
    if (country.image?.file) push(country.image.file, country.name, country.slug);
    pushItems(country.thingsToDo, 'things-to-do', country.name, country.slug);
    pushItems(country.foods, 'food', country.name, country.slug);
  }
  for (const destination of destinationList) {
    const place = `${destination.name}, ${destination.countryData?.name ?? ''}`.replace(/,\s*$/, '');
    const href = `${destination.country}/${destination.slug}`;
    if (destination.image?.file) push(destination.image.file, place, href);
    pushItems(destination.attractions, 'attractions', place, href);
    pushItems(destination.thingsToDo, 'things-to-do', place, href);
    pushItems(destination.foods, 'food', place, href);
  }
  for (const article of articleList) {
    if (article.image?.file) push(article.image.file, plain(article.title), `articles/${article.slug}`);
  }

  const content = html`
    <div class="page-head">
      <div class="wrap">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'Image credits' }])}
        <h1 class="page-head__title">Image credits</h1>
        <p class="page-head__lead">
          Every photograph on this site comes from Wikimedia Commons under a free licence —
          public domain, CC0, CC BY or CC BY-SA. Each entry below links to the original file
          and to the licence it was released under. ${rows.length} images in total.
        </p>
      </div>
    </div>

    <div class="wrap section">
      <div class="table-scroll">
        <table class="credits-table">
          <thead>
            <tr><th scope="col">Used on</th><th scope="col">Photographer</th><th scope="col">Licence</th><th scope="col">Source</th></tr>
          </thead>
          <tbody>
            ${join(
              rows.map(
                (row) => html`<tr>
                  <td><a href="${url(row.href)}${row.anchor ? `#${row.anchor}` : ''}">${row.context}</a></td>
                  <td>${row.credit.artist || 'Unknown'}</td>
                  <td>
                    ${row.credit.licenseUrl
                      ? html`<a href="${row.credit.licenseUrl}" rel="noopener nofollow license">${row.credit.license}</a>`
                      : html`${row.credit.license}`}
                  </td>
                  <td>
                    <a href="${row.credit.sourceUrl}" rel="noopener nofollow">Wikimedia Commons</a>
                  </td>
                </tr>`
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return layout({
    site,
    title: 'Image Credits',
    description: 'Photographer and licence attribution for every image used on this site.',
    path: 'image-credits',
    bodyClass: 'page-index',
    keywords: buildKeywords('image credits', 'photo attribution', 'Wikimedia Commons', 'free licence photography'),
    content
  });
}

/** 404.html — GitHub Pages serves this for unknown paths. */
export function renderNotFound({ site, countryList }) {
  const content = html`
    <div class="page-head page-head--center">
      <div class="wrap wrap--narrow center">
        <p class="page-head__eyebrow">Error 404</p>
        <h1 class="page-head__title">This page has wandered off</h1>
        <p class="page-head__lead">
          The page you were looking for is not here. Try one of the country guides, or
          browse every destination on the site.
        </p>
        <p class="hero__actions">
          <a class="btn btn--primary" href="${url('destinations')}">All destinations</a>
          <a class="btn btn--ghost" href="${url()}">Back to the home page</a>
        </p>
        <ul class="chip-row chip-row--center">
          ${join(
            countryList.map(
              (country) => html`<li><a class="chip" href="${url(country.slug)}">${country.name}</a></li>`
            )
          )}
        </ul>
      </div>
    </div>
  `;

  return layout({
    site,
    title: 'Page not found',
    description: 'The page you were looking for could not be found.',
    path: '404.html',
    bodyClass: 'page-404',
    robots: 'noindex, follow',
    content
  });
}
