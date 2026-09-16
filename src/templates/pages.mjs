import { html, raw, esc } from '../lib/html.mjs';
import { url, absolute } from '../lib/url.mjs';
import { layout } from './layout.mjs';
import { section, prose, breadcrumbs } from './partials.mjs';

/** /about/ — who builds and maintains the site. */
export function renderAbout({ site }) {
  const content = html`
    <div class="page-head">
      <div class="wrap wrap--narrow">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'About' }])}
        <h1 class="page-head__title">About this site</h1>
        <p class="page-head__lead">
          Hi — I'm Turab. I'm 21, currently training as a student pilot in Kazakhstan, and I built
          ${site.title} on my own, one country at a time.
        </p>
      </div>
    </div>

    ${section({
      id: 'why',
      eyebrow: 'Why a pilot builds a travel site',
      title: 'Flight training and travel planning turned out to share a lot of DNA',
      body: prose([
        `Learning to fly means spending a lot of time thinking in routes, distances and timing —
         how far apart two places actually are, what the weather does at different times of year,
         how much margin to build into a plan before something goes wrong. That habit of thinking
         carried straight over into how I plan trips, and it's the same habit this site is built
         around: not the ten most-photographed spots in a country, but the ten that actually give
         you a useful, honest picture of it.`,
        `I started this as a personal project — a reference I wanted to exist and couldn't find
         anywhere else, built exactly the way I'd want to use it myself.`
      ])
    })}

    ${section({
      id: 'how-its-built',
      eyebrow: 'How it works',
      title: 'Hand-coded, on purpose',
      tone: 'section--tint',
      body: prose([
        `${site.title} is a static site, written from scratch — no CMS, no page builder, no
         plugins. Every destination page is built from the same structured content and the same
         templates, which is what keeps a hundred destinations across ten countries consistent
         instead of drifting in quality from page to page.`,
        raw(`Every photograph on the site comes from Wikimedia Commons under a free licence, with
         full photographer and licence attribution on the
         <a href="${url('image-credits')}">image credits page</a>. The source code is open —
         you're welcome to look through it on
         <a href="${esc(site.repoUrl)}" rel="noopener">GitHub</a>.`)
      ])
    })}

    ${section({
      id: 'get-in-touch',
      eyebrow: 'Get in touch',
      title: 'Found something wrong, or missing?',
      body: prose([
        raw(`This is a one-person project, so mistakes happen — a wrong detail, an outdated
         opening time, a broken link. If you spot one, the fastest way to reach me is to
         <a href="${esc(site.repoUrl)}" rel="noopener">open an issue on GitHub</a>.`)
      ])
    })}
  `;

  return layout({
    site,
    title: 'About',
    description: `Who builds ${site.title}: a hand-coded, one-person travel guide covering ten countries in depth, with no CMS and no plugins.`,
    path: 'about',
    bodyClass: 'page-simple',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `About ${site.title}`,
        url: absolute('about')
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('') },
          { '@type': 'ListItem', position: 2, name: 'About', item: absolute('about') }
        ]
      }
    ],
    content
  });
}

/** /privacy-policy/ — deliberately short, because the site collects almost nothing. */
export function renderPrivacyPolicy({ site }) {
  const updated = 'September 2026';

  const content = html`
    <div class="page-head">
      <div class="wrap wrap--narrow">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'Privacy Policy' }])}
        <h1 class="page-head__title">Privacy Policy</h1>
        <p class="page-head__lead">
          The short version: this site has no accounts and sets no cookies of its own, but it
          does run third-party advertising and analytics, both of which do. The full breakdown,
          including exactly what that means, is below. Last updated ${updated}.
        </p>
      </div>
    </div>

    ${section({
      id: 'what-we-collect',
      eyebrow: 'Data collection',
      title: 'What this site itself collects: nothing',
      body: prose([
        `${site.title} has no user accounts, no sign-up forms, no comment sections and no
         newsletter. There is nothing to fill in and nothing personal to submit, so nothing
         personal is stored by the site itself.`,
        `This site runs no analytics or advertising of its own, and sets no cookies of its own.
         Every stylesheet, script, font and image the site itself needs is served from this same
         domain — the analytics and advertising described in the next two sections are both
         separate, third-party things rather than something this site's own code does.`
      ])
    })}

    ${section({
      id: 'advertising',
      eyebrow: 'Advertising',
      title: 'Advertising',
      tone: 'section--tint',
      body: prose([
        raw(`${esc(site.title)} carries advertising served by
         <a href="https://adsterra.com/" rel="noopener">Adsterra</a>, a third-party ad network.
         Adsterra's own scripts load on every page except this one and the
         <a href="${url('about')}">About</a> page, and — like effectively any ad network — they
         may set their own cookies and use similar technologies to measure ad performance and
         limit how often you see the same ad. That data collection belongs to Adsterra, governed
         by Adsterra's own privacy policy, not by anything this site's code configures.`),
        `One of the ad formats in use is a popunder, which can open a new browser tab or window
         in the background as you browse. If that happens, closing the extra tab is all it takes
         — it doesn't affect anything on this site itself.`
      ])
    })}

    ${section({
      id: 'analytics',
      eyebrow: 'Analytics',
      title: 'Analytics',
      body: prose([
        raw(`${esc(site.title)} uses
         <a href="https://marketingplatform.google.com/about/analytics/" rel="noopener">Google Analytics</a>
         to see how many people visit and which pages get read, on every page including this one.
         Google Analytics sets its own cookies and collects standard technical information — pages
         viewed, approximate location, device and browser type — governed by
         <a href="https://policies.google.com/privacy" rel="noopener">Google's own privacy policy</a>,
         not by anything this site's code configures.`)
      ])
    })}

    ${section({
      id: 'hosting',
      eyebrow: 'Hosting',
      title: 'Hosting and server logs',
      tone: 'section--tint',
      body: prose([
        raw(`This site is hosted on GitHub Pages. Like effectively any web host, GitHub's servers
         process standard technical information to deliver each page — things like IP address,
         browser type and the page requested — the way any web server does. That happens at the
         hosting level, is standard for any website on the internet, and is governed by
         <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub's own privacy statement</a>,
         not by anything this site configures or controls.`)
      ])
    })}

    ${section({
      id: 'external-links',
      eyebrow: 'Leaving this site',
      title: 'External links',
      body: prose([
        `Pages link out to two kinds of external site: Wikimedia Commons, where every photograph
         on this site is sourced and credited, and GitHub, where the source code lives. Once you
         click through to either, you're on their site under their privacy policy — this policy
         only covers ${site.title} itself.`
      ])
    })}

    ${section({
      id: 'childrens-privacy',
      eyebrow: "Children's privacy",
      title: "Children's privacy",
      tone: 'section--tint',
      body: prose([
        `This site is general-audience travel content, not directed at children, and — per the
         section above — it doesn't knowingly collect personal information from anyone, child or
         adult, because it doesn't collect personal information at all.`
      ])
    })}

    ${section({
      id: 'changes',
      eyebrow: 'Updates',
      title: 'Changes to this policy',
      body: prose([
        `If what this site does ever changes in a way that affects your privacy — a new tracking
         partner, say, or a different ad network — this page would be updated to say so plainly,
         with the "last updated" date above changed to match. There is no mailing list to notify,
         because there is no mailing list.`
      ])
    })}

    ${section({
      id: 'contact',
      eyebrow: 'Questions',
      title: 'Contact',
      tone: 'section--tint',
      body: prose([
        raw(`Questions about this policy are welcome — the most direct way to reach me is to
         <a href="${esc(site.repoUrl)}" rel="noopener">open an issue on GitHub</a>.`)
      ])
    })}
  `;

  return layout({
    site,
    title: 'Privacy Policy',
    description: `Privacy policy for ${site.title}: no accounts and no cookies of our own — the exceptions are third-party advertising and analytics, both covered in full below.`,
    path: 'privacy-policy',
    bodyClass: 'page-simple',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy',
        url: absolute('privacy-policy')
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('') },
          { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: absolute('privacy-policy') }
        ]
      }
    ],
    content
  });
}
