import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostMeta, formatDate } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides to Williamson County with a toddler. Free playgrounds, library story times, pumpkin patches and more, checked against the source.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPostMeta();

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Little Wilco guides",
    url: `${site.url}/blog`,
    hasPart: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${site.url}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated || p.date,
    })),
  };

  return (
    <section className="section">
      <div className="wrap">
        <p className="eyebrow">Guides</p>
        <h1><span className="smile-under">Guides to Williamson County</span> with a toddler</h1>
        <ul className="post-list" style={{ marginTop: "var(--space-10)" }}>
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
        />
      </div>
    </section>
  );
}
