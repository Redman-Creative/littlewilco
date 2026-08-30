import type { Metadata } from "next";
import SubscribeForm from "@/components/SubscribeForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the lineup Thursday",
  description:
    "One email a week with everything happening for Williamson County families with little kids. Subscribers get the weekend list Thursday, a day before it posts to Instagram.",
  alternates: { canonical: "/email" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Get the lineup Thursday",
    description:
      "One email a week with everything happening for Williamson County families with little kids.",
    url: `${site.url}/email`,
    images: [
      { url: site.ogImage.url, width: site.ogImage.width, height: site.ogImage.height, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get the lineup Thursday",
    description:
      "One email a week with everything happening for Williamson County families with little kids.",
    images: [site.ogImage.url],
  },
};

export default function EmailPage() {
  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <h1><span className="smile-under">Get the lineup Thursday</span></h1>
        <p className="lede" style={{ marginTop: "var(--space-6)" }}>
          One email a week. You get the weekend list Thursday morning, a day before the short
          version posts to Instagram.
        </p>

        <div style={{ marginTop: "var(--space-10)" }}>
          <SubscribeForm id="subscribe-email" />
        </div>

        <div className="card card--outline" style={{ marginTop: "var(--space-12)" }}>
          <h2 style={{ marginBottom: "var(--space-6)" }}>What is in it</h2>
          <ul className="plain-list">
            <li>
              <strong>Everything, not the five that fit on a card.</strong> The Friday post is the
              highlight reel. The email is the whole weekend.
            </li>
            <li>
              <strong>The ones that need a phone call,</strong> with the number, because half the
              good stuff around here never makes it onto a calendar page.
            </li>
            <li>
              <strong>What to skip.</strong> Which one is tight for nap time, where parking is
              miserable after ten, what is worth the drive and what is not.
            </li>
            <li>
              <strong>The rainy day backup,</strong> since this is Tennessee in the spring.
            </li>
          </ul>
        </div>

        <p style={{ marginTop: "var(--space-10)", color: "var(--text-muted)" }}>
          Every price, time and age range is checked against the organizer the week it runs. If
          something moves after I send it, I say so. Unsubscribe any time, and I will not send you
          anything else.
        </p>

        <p style={{ marginTop: "var(--space-8)" }}>
          Not ready for email? The short version posts Friday mornings on{" "}
          <a href={site.instagram}>Instagram</a>.
        </p>
      </div>
    </section>
  );
}
