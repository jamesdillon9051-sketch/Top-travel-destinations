import { html, join, plain } from '../lib/html.mjs';
import { url, absolute } from '../lib/url.mjs';
import { inlineName, displayName } from '../lib/text.mjs';
import { keywords as buildKeywords } from '../lib/seo.mjs';
import { layout } from './layout.mjs';
import {
  hero,
  sectionNav,
  section,
  prose,
  detailList,
  faqList,
  destinationGrid,
  advisoryBanner
} from './partials.mjs';

/**
 * Long-form country travel guide. Distinct from the country page: the country
 * page is a structured reference, the guide is the read-it-once planning piece
 * that ties the ten destinations into actual trips.
 */
export function renderGuide(guide, country, { site }) {
  const overview = country.mode === 'overview';
  const kind = overview ? 'Heritage overview' : 'Travel guide';
  const name = displayName(country);
  const inName = inlineName(country);
  const pagePath = `${country.slug}/travel-guide`;
  const description = plain(guide.summary, 158);
  const credit = guide.credit || country.credit;
  const keywords = overview
    ? buildKeywords(
        country.name,
        `${name} history`,
        `${name} heritage sites`,
        `${name} UNESCO World Heritage sites`,
        `is it safe to travel to ${inName}`,
        country.continent,
        country.places.map((place) => place.name)
      )
    : buildKeywords(
        country.name,
        `${name} travel guide`,
        `how to plan a trip to ${inName}`,
        `${name} itinerary`,
        `how many days in ${inName}`,
        `${name} travel tips`,
        `best time to visit ${inName}`,
        country.continent,
        country.places.map((place) => place.name)
      );

  const navItems = [
    ...guide.sections.map((s) => ({ id: s.id, label: s.navLabel || s.title })),
    { id: 'the-ten', label: 'The ten destinations' },
    ...(guide.faq ? [{ id: 'guide-faq', label: 'FAQ' }] : [])
  ];

  const content = html`
    ${hero({
      credit,
      alt: guide.image?.alt || country.image?.alt || country.name,
      eyebrow: `${name} · ${kind}`,
      title: guide.title,
      tagline: guide.subtitle,
      meta: [
        { label: 'Reading time', value: guide.readingTime },
        { label: 'Covers', value: overview ? `${country.places.length} heritage sites` : `${country.places.length} destinations` },
        { label: 'Updated', value: guide.updated }
      ].filter((m) => m.value),
      trail: [
        { label: 'Home', href: '' },
        { label: country.name, href: country.slug },
        { label: kind }
      ]
    })}

    ${overview ? advisoryBanner(country.advisory, { compact: true, moreHref: country.slug }) : ''}

    ${sectionNav(navItems)}

    <section class="section section--intro">
      <div class="wrap wrap--narrow">
        <p class="guide-summary">${guide.summary}</p>
      </div>
    </section>

    ${join(
      guide.sections.map((sec) =>
        html`<section class="section section--guide${sec.tone ? ` section--${sec.tone}` : ''}" id="${sec.id}">
          <div class="wrap wrap--narrow">
            <h2 class="section__title">${sec.title}</h2>
            ${sec.body ? prose(sec.body) : ''}
            ${sec.list ? detailList(sec.list, { numbered: Boolean(sec.numbered) }) : ''}
            ${sec.note ? html`<p class="note"><strong>${sec.noteLabel || 'Worth knowing'}:</strong> ${sec.note}</p>` : ''}
            ${sec.outro ? prose(sec.outro) : ''}
          </div>
        </section>`
      )
    )}

    ${section({
      id: 'the-ten',
      eyebrow: 'Reference',
      title: overview ? `The 10 sites in this overview` : `The 10 destinations in this guide`,
      lead: overview
        ? `Every place named above has its own page — its history, its key monuments and, importantly, what condition it is in today.`
        : `Every place named above has its own detailed guide — attractions, food, where to stay, how to get around and a suggested day-by-day plan.`,
      tone: 'section--tint',
      body: html`
        ${destinationGrid(country.places, { ranked: true })}
        <p class="section__more">
          <a class="btn btn--ghost" href="${url(country.slug)}">
            Back to the ${name} country page<span aria-hidden="true"> →</span>
          </a>
        </p>
      `
    })}

    ${guide.faq
      ? section({
          id: 'guide-faq',
          eyebrow: 'FAQ',
          title: overview ? `${name}: common questions` : `Planning a trip to ${inName}`,
          body: faqList(guide.faq)
        })
      : ''}
  `;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: plain(guide.title),
      description,
      about: country.name,
      image: credit ? absolute(credit.hero) : undefined,
      mainEntityOfPage: absolute(pagePath),
      author: { '@type': 'Organization', name: site.title },
      publisher: { '@type': 'Organization', name: site.title }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('') },
        { '@type': 'ListItem', position: 2, name: country.name, item: absolute(country.slug) },
        { '@type': 'ListItem', position: 3, name: kind, item: absolute(pagePath) }
      ]
    }
  ];

  return layout({
    site,
    title: plain(guide.title),
    description,
    path: pagePath,
    image: credit ? { src: credit.hero } : null,
    bodyClass: 'page-guide',
    schema,
    keywords,
    content
  });
}
