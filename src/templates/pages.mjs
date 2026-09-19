import { html, raw, esc } from '../lib/html.mjs';
import { url, absolute } from '../lib/url.mjs';
import { layout } from './layout.mjs';
import { section, prose, breadcrumbs, calloutList } from './partials.mjs';

/** /about/ — who builds and maintains the site. */
export function renderAbout({ site }) {
  const content = html`
    <div class="page-head">
      <div class="wrap wrap--narrow">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'About' }])}
        <h1 class="page-head__title">Hi, I'm Turab — I go looking for both the chaos and the quiet</h1>
        <p class="page-head__lead">
          I'm based in Pakistan, and ${site.title} exists because of one habit: I can't leave a
          country having only seen its big cities, and I can't leave it having only seen the
          countryside either. I want both, on the same trip, and most travel writing makes you
          choose.
        </p>
      </div>
    </div>

    ${section({
      id: 'backstory',
      eyebrow: 'The short version',
      title: 'Cities one week, villages the next',
      body: prose([
        `If you asked me to describe my ideal trip, it would involve getting completely lost in a
         city of ten million people on Monday and not seeing another tourist for four days
         straight by Friday. That contrast is basically the whole reason I travel. A big city
         shows you a country's present — the traffic, the money, the noisy, funny energy of
         everyone moving at once. A village a few hours outside it shows you something closer to
         the country's actual pace: food before it became a menu item, hospitality before anyone
         thought to charge for it. I don't think either one is the "real" version of a place. I
         think you need both, and most trips only budget for one.`,
        raw(`That's the idea behind every guide on this site: ten destinations per country, picked
         so they cover that range rather than just the five names everyone already knows. It's
         hand-built — no CMS, no page builder — with every photo sourced and credited from
         Wikimedia Commons on the <a href="${url('image-credits')}">image credits page</a>, and
         the code itself is open on
         <a href="${esc(site.repoUrl)}" rel="noopener">GitHub</a> if you're curious how it's put
         together.`)
      ])
    })}

    ${section({
      id: 'what-to-expect',
      eyebrow: 'Coming up',
      title: 'What you can expect next',
      tone: 'section--tint',
      body: prose([
        `This November, I'm doing something the site hasn't done before: a 15-day trip through
         Indonesia, and instead of writing it up afterward as one more polished guide, I'm going
         to document it as it actually happens. Real day-by-day itineraries, real costs, the
         places that looked good on paper and weren't, and the ones nobody told me about that
         turned out to be the best three days of the whole trip.`,
        `Everything else on the site stays exactly as it is — the destination guides you'll find
         across all 26 countries aren't going anywhere, and they'll stay just as thorough. The
         Indonesia trip is new territory for me specifically: writing about a place while I'm
         still standing in it, rather than months later. I'm genuinely curious how it turns out,
         and if you're planning your own Indonesia trip, this is the place the itineraries will
         land first.`
      ])
    })}

    ${section({
      id: 'stay-in-the-loop',
      eyebrow: 'Stick around',
      title: 'Bookmark it — that\'s the best way to catch it',
      body: prose([
        `There's no newsletter and no account system on this site, so a bookmark on this page or
         the homepage is genuinely the most reliable way to catch the Indonesia posts as they go
         up through November.`,
        raw(`And since this is a one-person project, mistakes happen — a wrong detail, an outdated
         opening time, a broken link. If you spot one, the fastest way to reach me is to
         <a href="${esc(site.repoUrl)}" rel="noopener">open an issue on GitHub</a>.`)
      ])
    })}
  `;

  return layout({
    site,
    title: 'Meet Turab — Why I Built This Site',
    description:
      'Based in Pakistan and hooked on contrast — packed cities one week, quiet villages the next. This November: 15 days in Indonesia, documented live.',
    path: 'about',
    keywords: [
      'Turab',
      'about Turab',
      'Travel Vault founder',
      'Pakistan travel enthusiast',
      'Indonesia trip itinerary',
      'Indonesia 15 day itinerary',
      'Indonesia November trip',
      'who runs Travel Vault',
      'independent travel guide'
    ],
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
        '@type': 'Person',
        name: 'Turab',
        description: `Travel enthusiast based in Pakistan and creator of ${site.title}.`,
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
  const siteName = 'TravelVault.online';
  const contactEmail = 'contact@travelvault.online';

  const content = html`
    <div class="page-head">
      <div class="wrap wrap--narrow">
        ${breadcrumbs([{ label: 'Home', href: '' }, { label: 'Privacy Policy' }])}
        <h1 class="page-head__title">Privacy Policy</h1>
        <p class="page-head__lead">
          The short version: ${siteName} has no accounts and sets no cookies of its own, but it
          does run third-party advertising and analytics, both of which do, and this page covers
          exactly what that means, including your rights under GDPR and CCPA. Last updated
          ${updated}.
        </p>
      </div>
    </div>

    ${section({
      id: 'what-we-collect',
      eyebrow: 'Data collection',
      title: 'What this site itself collects: nothing',
      body: prose([
        `${siteName} has no user accounts, no sign-up forms, no comment sections and no
         newsletter. There is nothing to fill in and nothing personal to submit, so nothing
         personal is stored by the site itself.`,
        `This site runs no analytics or advertising of its own, and sets no cookies of its own.
         Every stylesheet, script, font and image the site itself needs is served from this same
         domain — the log data, cookies, and advertising and analytics partners described below
         are all separate, third-party things rather than something this site's own code does.`
      ])
    })}

    ${section({
      id: 'log-data',
      eyebrow: 'Server logs',
      title: 'Log data',
      tone: 'section--tint',
      body: prose([
        raw(`Like virtually every website, when you visit ${siteName} our hosting provider
         (GitHub Pages) automatically collects information that your browser sends whenever you
         visit. This log data may include your device's Internet Protocol ("IP") address, browser
         type and version, the pages of the site that you visit, the time and date of your visit,
         the time spent on those pages, and other statistics. This happens at the hosting level —
         it is standard for any website on the internet — and is governed by
         <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub's own privacy statement</a>,
         not by anything ${siteName} configures or controls.`)
      ])
    })}

    ${section({
      id: 'cookies-and-web-beacons',
      eyebrow: 'Cookies',
      title: 'Cookies and web beacons',
      body: prose([
        `${siteName} itself does not set any cookies of its own — there are no accounts, logins
         or saved preferences on this site to remember. However, like most websites that carry
         advertising, the third-party services embedded here (described in Advertising Partners
         and Analytics below) may use cookies and web beacons (small tracking graphics, also
         called tracking pixels) to collect information and improve their own services.`,
        `A cookie is a small file placed on your device; a web beacon is typically a tiny,
         invisible image used to track whether a page was viewed or an email was opened. You can
         choose to accept or decline cookies through your individual browser settings, and most
         browsers let you refuse cookies automatically or notify you when a site sets one.
         Declining cookies may prevent some parts of embedded third-party content (such as ads)
         from functioning correctly, but it will not affect your ability to read anything on
         ${siteName} itself.`
      ])
    })}

    ${section({
      id: 'advertising-partners',
      eyebrow: 'Advertising partners',
      title: 'Advertising partners',
      tone: 'section--tint',
      body: prose([
        `${siteName} works with third-party advertising companies to serve ads when you visit
         this site. These companies may use information about your visits here and to other
         websites — but not your name, address, email address or telephone number — to provide
         advertisements about goods and services that may interest you. This is commonly called
         interest-based or "personalized" advertising.`,
        raw(`${siteName}'s current advertising partner is
         <a href="https://adsterra.com/" rel="noopener">Adsterra</a>. Adsterra's own scripts load
         on every page except this one and the <a href="${url('about')}">About</a> page, and —
         like effectively any ad network — may set their own cookies and use similar technologies
         to send ads and links directly to your browser, measure ad performance, and limit how
         often you see the same ad. One of the ad formats in use is a popunder, which can open a
         new browser tab or window in the background as you browse; if that happens, closing the
         extra tab is all it takes, and it doesn't affect anything on this site itself.`),
        raw(`If ads served through Google (such as Google AdSense) run on this site now or in the
         future, Google, as a third-party vendor, may use cookies — including the DoubleClick DART
         cookie — to serve ads to you based on your visits to this site and other sites on the
         internet. Google's use of the DART cookie enables it and its partners to serve ads based
         on a user's visit to this and other websites. You may opt out of the use of the DART
         cookie for interest-based advertising by visiting
         <a href="https://policies.google.com/technologies/ads" rel="noopener">Google's Ads Settings</a>,
         and third-party vendors, including Google, may similarly use cookies to serve ads based
         on a user's prior visits.`),
        `This data collection belongs to each advertising partner individually, governed by their
         own privacy policies (see Third-Party Privacy Policies below) — ${siteName} has no
         access to and no control over the cookies these advertisers place.`
      ])
    })}

    ${section({
      id: 'analytics',
      eyebrow: 'Analytics',
      title: 'Analytics',
      body: prose([
        raw(`${siteName} uses
         <a href="https://marketingplatform.google.com/about/analytics/" rel="noopener">Google Analytics</a>
         to see how many people visit and which pages get read, on every page including this one.
         Google Analytics sets its own cookies and collects standard technical information — pages
         viewed, approximate location, device and browser type — governed by
         <a href="https://policies.google.com/privacy" rel="noopener">Google's own privacy policy</a>,
         not by anything this site's code configures.`)
      ])
    })}

    ${section({
      id: 'third-party-privacy-policies',
      eyebrow: 'Third parties',
      title: 'Third-party privacy policies',
      tone: 'section--tint',
      body: prose([
        `${siteName}'s Privacy Policy does not apply to other advertisers, analytics providers or
         websites, and this site has no access to or control over the cookies that third-party ad
         servers and networks use. We recommend consulting the respective privacy policies of
         these third parties for more detailed information, which may include their own practices
         and instructions for how to opt out of certain options:`,
        raw(`<a href="https://adsterra.com/privacy-policy/" rel="noopener">Adsterra's Privacy Policy</a>,
         <a href="https://policies.google.com/privacy" rel="noopener">Google's Privacy Policy</a>
         (which covers both Google Analytics and any Google-served advertising), and
         <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub's Privacy Statement</a>
         (our hosting provider).`),
        `You can generally choose to disable cookies for any of these third parties through your
         individual browser options; browser-specific instructions are available on each
         browser's own support pages.`
      ])
    })}

    ${section({
      id: 'external-links',
      eyebrow: 'Leaving this site',
      title: 'External links',
      body: prose([
        `Beyond the advertising and analytics partners above, pages also link out to Wikimedia
         Commons, where every photograph on this site is sourced and credited, and to GitHub,
         where the source code lives. Once you click through to any external site, you're on
         their site under their own privacy policy — this policy only covers ${siteName} itself.`
      ])
    })}

    ${section({
      id: 'gdpr',
      eyebrow: 'Your rights (EU/UK)',
      title: 'GDPR data protection rights',
      tone: 'section--tint',
      body: html`
        ${prose([
          `If you are located in the European Economic Area or United Kingdom, you have certain
           data protection rights under the General Data Protection Regulation (GDPR).
           ${siteName} aims to take reasonable steps to allow you to correct, amend, delete, or
           limit the use of your personal data.`,
          `Because ${siteName} itself does not operate accounts or a database of personal
           information, any personal data associated with your visit here is held by the
           third-party advertising, analytics or hosting partners listed above, under their own
           policies. If you want to know what data one of those partners holds about you, or want
           it corrected or removed, you have the right to:`
        ])}
        ${calloutList(
          [
            'Access, update or request a copy of the personal data held about you.',
            'Request rectification of any personal data that is inaccurate or incomplete.',
            'Request erasure of your personal data, in certain circumstances.',
            'Object to or request restriction of the processing of your personal data.',
            'Request that your data be transferred to another organisation, or directly to you (data portability).',
            'Withdraw consent at any time, where processing is based on consent.'
          ],
          { title: 'Your GDPR rights', tone: 'do' }
        )}
        ${prose([
          raw(`If you'd like help exercising any of these rights — including being pointed to the
           right third party to contact — email <a href="mailto:${contactEmail}">${contactEmail}</a>
           and we'll do our best to help.`)
        ])}
      `
    })}

    ${section({
      id: 'ccpa',
      eyebrow: 'Your rights (California)',
      title: 'CCPA privacy rights',
      body: html`
        ${prose([
          `If you are a California resident, the California Consumer Privacy Act (CCPA) gives you
           specific rights regarding your personal information. This section describes those
           rights and how to exercise them. Under the CCPA, California consumers have the right
           to:`
        ])}
        ${calloutList(
          [
            'Request that a business that collects personal data disclose the categories and specific pieces of personal data it has collected about you.',
            'Request that a business delete any personal data about you that it has collected.',
            'Request that a business that sells personal data not sell your personal data (note: this site and its advertising partners do not knowingly sell personal data as defined by the CCPA).',
            'Not be discriminated against for exercising any of your CCPA rights.'
          ],
          { title: 'Your CCPA rights', tone: 'do' }
        )}
        ${prose([
          raw(`If you make a request, we have one month to respond. To exercise any of these
           rights, please contact us at <a href="mailto:${contactEmail}">${contactEmail}</a>. As
           noted throughout this policy, ${siteName} does not itself collect or sell personal
           data — any data tied to your visit comes from the third-party advertising, analytics
           and hosting partners described above, under their own respective policies.`)
        ])}
      `
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
        raw(`Questions about this policy are welcome. The most direct way to reach me is by email
         at <a href="mailto:${contactEmail}">${contactEmail}</a>, or by
         <a href="${esc(site.repoUrl)}" rel="noopener">opening an issue on GitHub</a>.`)
      ])
    })}
  `;

  return layout({
    site,
    title: 'Privacy Policy',
    description: `Privacy policy for ${siteName}: log data, cookies, advertising and analytics partners, and your GDPR and CCPA rights, explained in full.`,
    path: 'privacy-policy',
    bodyClass: 'page-simple',
    robots: 'index, follow',
    keywords: [
      'privacy policy',
      'TravelVault.online privacy policy',
      'data collection',
      'log data',
      'cookies and web beacons',
      'third-party privacy policies',
      'advertising partners',
      'DoubleClick DART cookies',
      'third-party ad serving',
      'GDPR data protection rights',
      'CCPA privacy rights',
      'California privacy rights',
      'Adsterra privacy',
      'Google Analytics privacy'
    ],
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
