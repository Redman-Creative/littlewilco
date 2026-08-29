import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import InstagramGrid from "@/components/InstagramGrid";
import { site } from "@/lib/site";
import { getAllPostMeta, formatDate } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPostMeta().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>So, what are we doing this weekend?</h1>
          <p className="lede">
            One email a week with what&rsquo;s going on for kids 6 and under across Williamson
            County.
          </p>
          <div style={{ maxWidth: 520, marginTop: "var(--space-8)" }} id="subscribe">
            <SubscribeForm />
            <p className="form-note" style={{ color: "var(--lw-sky-light)" }}>
              Subscribers see the lineup a day before it posts to Instagram. Unsubscribe any
              time.
            </p>
          </div>
        </div>

        <svg className="hero-wave" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,30 C240,76 490,76 720,42 C950,10 1200,10 1440,36 L1440,90 L0,90 Z"
            fill="var(--surface-page)"
          />
        </svg>
      </section>

      <section className="section">
        <div className="wrap">
          <h2><span className="smile-under">The activity plans, done for you</span></h2>
          <p className="lede">
            The best events, activities and day trips around the county, brought straight to
            you. All you have to do is be the fun parent.
          </p>
          <ol className="steps" style={{ marginTop: "var(--space-8)" }}>
            <li className="step">
              <h3>Monday: registration roundup</h3>
              <p>
                What just opened and what closes this week. Camps, swim lessons, story time
                sign-ups, and the tickets that sell out before you hear about them.
              </p>
            </li>
            <li className="step">
              <h3>Thursday: the weekend lineup</h3>
              <p>
                Everything worth the car seat, Friday through Sunday. Each one tagged with the town
                and flagged if it&rsquo;s free. This goes to email first.
              </p>
            </li>
            <li className="step">
              <h3>Friday: it hits social</h3>
              <p>
                The same lineup posts to Instagram and Facebook Friday morning, about a day after
                subscribers get it.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="wrap">
          <p className="eyebrow">The towns</p>
          <h2><span className="smile-under">The whole county</span></h2>
          <p className="lede" style={{ marginBottom: "var(--space-6)" }}>
            Nolensville and Fairview get left off most roundups. Not this one.
          </p>
          <ul className="towns">
            {site.towns.map((town) => (
              <li key={town} className="pill">
                📍 {town}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Why this exists</p>
          <h2><span className="smile-under">Nobody was writing for the under six crowd</span></h2>
          <div style={{ maxWidth: "60ch" }}>
            <p>
              I&rsquo;m a Franklin mom with a toddler, and I kept hitting the same wall. Plenty of
              people post about things to do in Williamson County, but almost all of it&rsquo;s
              written for school age kids, and it skips the parts that decide whether an outing
              works with a toddler. Is there a bathroom. Is there shade. Can a stroller get around
              it. Does it cost anything for a two year old.
            </p>
            <p>
              So I check. Little Wilco is the list I wished somebody else was keeping. Every
              listing names the town, and anything free gets flagged, because free is what most
              weeks call for.
            </p>
          </div>
        </div>
      </section>

      <InstagramGrid />

      {posts.length > 0 && (
        <section className="section">
          <div className="wrap">
            <p className="eyebrow">Guides</p>
            <h2><span className="smile-under">Start here</span></h2>
            <ul className="post-list" style={{ marginTop: "var(--space-8)" }}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <div className="post-meta">
                      <span className="pill pill--sun">{post.category}</span>
                      <span>Updated {formatDate(post.updated || post.date)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "var(--space-8)" }}>
              <Link href="/blog" className="btn btn--secondary">
                All guides
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="section" id="partner">
        <div className="wrap">
          <div className="card card--warm">
            <p className="eyebrow">For local businesses</p>
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              <span className="smile-under">Want to get in front of Wilco parents?</span>
            </h2>
            <div style={{ maxWidth: "58ch" }}>
              <p>
                If you run something families with little kids would actually want to know about,
                I&rsquo;d like to hear from you. Preschools, swim schools, music classes, kids
                haircuts, pediatric dentists, photographers, the places that make a Saturday
                easier.
              </p>
              <p>
                Wilco Wednesday is an editorial spotlight on one local business. Deal of the Week
                shares an offer worth driving for. Both go out to the email list and to Instagram
                and Facebook, and both are labeled as partnerships, because readers should always
                know.
              </p>
            </div>
            <p style={{ marginTop: "var(--space-6)", marginBottom: 0 }}>
              <a className="btn btn--primary" href={`mailto:${site.email}?subject=Partnering%20with%20Little%20Wilco`}>
                Tell me about your business
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <h2><span className="smile-under">Get the lineup Thursday</span></h2>
          <p className="lede" style={{ margin: "0 auto var(--space-8)" }}>
            Plan the weekend on a Thursday night instead of scrolling for it Saturday morning.
          </p>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <SubscribeForm id="subscribe-footer" />
          </div>
        </div>
      </section>
    </>
  );
}
