import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import { site } from "@/lib/site";
import { getAllPostMeta, formatDate } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPostMeta().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow" style={{ color: "var(--lw-sun-light)" }}>
            This weekend in Wilco
          </p>
          <h1>Weekend plans for Wilco families, sorted by Thursday.</h1>
          <p className="lede">
            We round up what is actually happening for kids under six across Williamson County.
            Day, time, town, and whether it is free. Free stuff first.
          </p>
          <div style={{ maxWidth: 520, marginTop: "var(--space-8)" }} id="subscribe">
            <SubscribeForm />
            <p className="form-note" style={{ color: "var(--lw-sky-light)" }}>
              One email a week, Thursday morning. Subscribers see the lineup a day before it posts
              to Instagram. Unsubscribe any time.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">How the week runs</p>
          <h2>Three things land in your week</h2>
          <ol className="steps" style={{ marginTop: "var(--space-8)" }}>
            <li className="step">
              <span className="num">1</span>
              <h3>Monday: registration roundup</h3>
              <p>
                What just opened and what closes this week. Camps, swim lessons, story time
                sign-ups, and the tickets that sell out before you hear about them.
              </p>
            </li>
            <li className="step">
              <span className="num">2</span>
              <h3>Thursday: the weekend lineup</h3>
              <p>
                Everything worth the car seat, Friday through Sunday. Each one tagged with the town
                and flagged if it is free. This goes to email first.
              </p>
            </li>
            <li className="step">
              <span className="num">3</span>
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
          <p className="eyebrow">Where we cover</p>
          <h2>All of Williamson County, not just Franklin</h2>
          <p className="lede" style={{ marginBottom: "var(--space-6)" }}>
            Nolensville and Fairview get left off most roundups. They do not get left off ours.
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
          <h2>Nobody was writing for the under six crowd</h2>
          <div style={{ maxWidth: "60ch" }}>
            <p>
              Plenty of people post about things to do in Williamson County. Almost all of it is
              written for families with school age kids, and it leaves out the parts that decide
              whether an outing works with a toddler. Is there a bathroom. Is there shade. Can a
              stroller get around it. Does it cost anything for a two year old.
            </p>
            <p>
              So we check. Every listing names the town, and anything free gets flagged, because
              free is what most weeks call for.
            </p>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section section--sunk">
          <div className="wrap">
            <p className="eyebrow">Guides</p>
            <h2>Start here</h2>
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

      <section className="section">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <h2>Get the lineup Thursday</h2>
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
