import type { Metadata } from "next";
import SubscribeForm from "@/components/SubscribeForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the lineup Thursday",
  description:
    "Everything happening in Williamson County for families with little kids, in your inbox. Subscribers get the weekend list Thursday, a day before it posts to Instagram.",
  alternates: { canonical: "/email" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Get the lineup Thursday",
    description:
      "Everything happening in Williamson County for families with little kids, in your inbox Thursday mornings.",
    url: `${site.url}/email`,
    images: [
      { url: site.ogImage.url, width: site.ogImage.width, height: site.ogImage.height, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get the lineup Thursday",
    description:
      "Everything happening in Williamson County for families with little kids, in your inbox Thursday mornings.",
    images: [site.ogImage.url],
  },
};

export default function EmailPage() {
  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <h1><span className="smile-under">Get the lineup Thursday</span></h1>
        <p className="lede" style={{ marginTop: "var(--space-6)" }}>
          The weekend list lands Thursday morning, a day before the short version posts to
          Instagram.
        </p>

        <div style={{ marginTop: "var(--space-10)" }}>
          <SubscribeForm id="subscribe-email" />
        </div>

        <div className="card card--outline" style={{ marginTop: "var(--space-12)" }}>
          <h2 style={{ marginBottom: "var(--space-6)" }}>What&rsquo;s in it</h2>
          <ul className="plain-list">
            <li>
              <strong>The whole weekend.</strong> The Friday card fits about five things. The
              email has everything I found.
            </li>
            <li>
              <strong>The address and the real price.</strong> Street address, not the town, and
              the price tiers broken out, including the add-ons that show up at checkout. If a
              place never posted its hours, I call.
            </li>
            <li>
              <strong>What to skip.</strong> The one that lands in the middle of nap, and the
              thing the website still lists that isn&rsquo;t running this week.
            </li>
            <li>
              <strong>An indoor option every week.</strong> Ninety-five degrees or pouring rain,
              there&rsquo;s still somewhere to go.
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
