import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import CopyCode from "@/components/CopyCode";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/posts";
import type { Faq } from "@/lib/posts";
import {
  getActiveDiscounts,
  lastChecked,
  priceWithCode,
  liveGuide,
  discountsAnswer,
} from "@/lib/discounts";

// Re-render hourly so offers appear on their `added` date, drop off after
// `expires`, and pick up their guide link the day that post goes live.
export const revalidate = 3600;

const title = "Discounts from Williamson County businesses";
const description =
  "Discount codes from Williamson County, TN businesses, set up for Little Wilco readers and open to families across Middle Tennessee.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/discounts" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description,
    url: `${site.url}/discounts`,
    images: [
      { url: site.ogImage.url, width: site.ogImage.width, height: site.ogImage.height, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [site.ogImage.url],
  },
};

const generalFaqs: Faq[] = [
  {
    q: "Who can use Little Wilco discounts?",
    a: "Anyone with the code. Most of the businesses are in Williamson County, Tennessee, and the digital ones, like the Potty Playbook, work from anywhere.",
  },
  {
    q: "Do I need to sign up to get the codes?",
    a: "No. Every current code is on this page. New ones also go out in the Thursday email.",
  },
  {
    q: "Does Little Wilco get paid for these?",
    a: "Some of them. When Little Wilco earns a commission on a code, the card says so. Using a code doesn't add anything to your price.",
  },
  {
    q: "How can my business offer a discount here?",
    a: `Email ${site.email} and tell me about your business and the offer you have in mind.`,
  },
];

export default function DiscountsPage() {
  const deals = getActiveDiscounts();
  const updated = lastChecked(deals);
  const faqs = [...deals.flatMap((d) => d.faqs ?? []), ...generalFaqs];
  const pageUrl = `${site.url}/discounts`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#page`,
    name: title,
    description,
    url: pageUrl,
    inLanguage: "en-US",
    ...(updated ? { dateModified: updated } : {}),
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    about: { "@type": "AdministrativeArea", name: "Williamson County, Tennessee" },
    mainEntity: {
      "@type": "ItemList",
      name: "Little Wilco reader discounts",
      numberOfItems: deals.length,
      itemListElement: deals.map((d, i) => {
        const price = priceWithCode(d);
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Offer",
            "@id": `${pageUrl}#${d.id}`,
            name: d.offer,
            description: `${d.offer} with the code ${d.code}. ${d.howTo}`,
            url: d.url,
            category: d.category,
            validFrom: d.added,
            ...(d.expires ? { validThrough: d.expires } : {}),
            ...(price ? { price, priceCurrency: "USD" } : {}),
            seller: {
              "@type": "LocalBusiness",
              name: d.business,
              url: d.businessUrl,
              address: {
                "@type": "PostalAddress",
                addressLocality: d.town,
                addressRegion: "TN",
                addressCountry: "US",
              },
            },
            ...(d.product
              ? {
                  itemOffered: {
                    "@type": "Product",
                    name: d.product.name,
                    description: d.product.description,
                    brand: { "@type": "Brand", name: d.shortName },
                  },
                }
              : {}),
          },
        };
      }),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Discounts", item: pageUrl },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <h1>
          <span className="smile-under">Discounts from Williamson County</span> businesses
        </h1>
        <p className="lede" style={{ marginTop: "var(--space-6)" }}>
          Codes that local businesses set up for Little Wilco readers. They work for families
          anywhere in Middle Tennessee, and each one says what town it&rsquo;s in and how to use it.
        </p>
        {updated && (
          <div className="post-meta" style={{ marginBottom: "var(--space-8)" }}>
            <span>Updated {formatDate(updated)}</span>
          </div>
        )}

        <div className="answer-box">
          <p className="eyebrow">Short answer</p>
          <p>{discountsAnswer(deals)}</p>
        </div>

        <h2 style={{ marginTop: "var(--space-12)" }}>Current discounts</h2>
        <ul className="deal-list">
          {deals.map((d) => {
            const guide = liveGuide(d);
            return (
              <li key={d.id} id={d.id} className="deal">
                <div className="deal__tags">
                  <span className="pill">📍 {d.town}</span>
                  <span className="pill pill--sun">{d.category}</span>
                  {d.partner && <span className="pill pill--partner">Partner offer</span>}
                </div>
                <h3 className="deal__title">{d.offer}</h3>
                <p className="deal__business">{d.business}</p>

                <CopyCode code={d.code} />

                <p>{d.howTo}</p>
                <p>{d.details}</p>
                <p>{d.about}</p>
                <p className="deal__fine">{d.fineprint}</p>
                {d.partner && (
                  <p className="deal__fine">
                    <strong>Partner offer:</strong> Little Wilco earns a commission on purchases made
                    with this code.
                  </p>
                )}

                <div className="deal__actions">
                  <a className="btn btn--primary" href={d.url} rel="sponsored noopener" target="_blank">
                    {d.cta}
                  </a>
                  {guide && (
                    <Link className="btn btn--secondary" href={guide}>
                      Read my take
                    </Link>
                  )}
                </div>

                <p className="deal__meta">
                  {d.sourceNote}
                  {d.expires ? ` Good through ${formatDate(d.expires)}.` : ""}
                </p>
              </li>
            );
          })}
        </ul>

        <h2 style={{ marginTop: "var(--space-16)" }}>How these work</h2>
        <div className="article">
          <p>
            These are codes I ask local businesses to set up for Little Wilco readers. I list places
            I&rsquo;d recommend to a friend with little kids, and I look over what they sell before
            it goes on this page.
          </p>
          <p>
            Some are partnerships, which means Little Wilco earns a commission when you use the
            code. Those are labeled on the card, and the commission comes out of the business&rsquo;s
            side, not your price.
          </p>
          <p>
            Codes and prices can change, so each card says when I last checked it. If one
            doesn&rsquo;t work at checkout, email me at <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
            and I&rsquo;ll sort it out with the business.
          </p>
        </div>

        <section style={{ marginTop: "var(--space-16)" }}>
          <h2>Questions I get</h2>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="card card--outline" style={{ marginTop: "var(--space-16)" }}>
          <h2 style={{ marginBottom: "var(--space-3)" }}>Run a business Wilco families would love?</h2>
          <p style={{ color: "var(--text-muted)" }}>
            If you&rsquo;d like to offer Little Wilco readers a discount, I&rsquo;d love to hear
            about it. Codes go on this page and in the Thursday email.
          </p>
          <p style={{ marginBottom: 0 }}>
            <a
              className="btn btn--primary"
              href={`mailto:${site.email}?subject=Discount%20for%20Little%20Wilco%20readers`}
            >
              Tell me about your offer
            </a>
          </p>
        </section>

        <section className="card card--warm" style={{ marginTop: "var(--space-10)" }}>
          <h2 style={{ marginBottom: "var(--space-3)" }}>Get new codes in your inbox</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-sm)" }}>
            New discounts go out in the Thursday email along with the weekend lineup.
          </p>
          <SubscribeForm id="subscribe-discounts" />
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </div>
    </section>
  );
}
