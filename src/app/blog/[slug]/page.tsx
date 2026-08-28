import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubscribeForm from "@/components/SubscribeForm";
import { getPost, getPostSlugs, getPostMeta, formatDate } from "@/lib/posts";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) return {};
  const meta = getPostMeta(slug);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${site.url}/blog/${slug}`,
      publishedTime: meta.date,
      modifiedTime: meta.updated || meta.date,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) notFound();

  const post = await getPost(slug);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    url: `${site.url}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/littlewilco-profile-1080.png` },
    },
    about: (post.towns || []).map((t) => ({ "@type": "Place", name: `${t}, Tennessee` })),
  };

  const faqLd =
    post.faqs && post.faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <article className="section">
      <div className="wrap wrap--narrow">
        <p className="eyebrow">
          <Link href="/blog" style={{ color: "inherit" }}>
            Guides
          </Link>{" "}
          / {post.category}
        </p>
        <h1>{post.title}</h1>
        <div className="post-meta" style={{ marginBottom: "var(--space-8)" }}>
          <span>Updated {formatDate(post.updated || post.date)}</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        {post.answer && (
          <div className="answer-box">
            <p className="eyebrow">Short answer</p>
            <p>{post.answer}</p>
          </div>
        )}

        <div className="article" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.faqs && post.faqs.length > 0 && (
          <section style={{ marginTop: "var(--space-16)" }}>
            <h2>Questions we get</h2>
            <div className="faq">
              {post.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="card card--warm" style={{ marginTop: "var(--space-16)" }}>
          <h2 style={{ marginBottom: "var(--space-3)" }}>Get this week&rsquo;s lineup</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-sm)" }}>
            Guides like this cover the things that stay put. The weekly email covers what is on
            this weekend. It goes out Thursday morning.
          </p>
          <SubscribeForm id={`subscribe-${post.slug}`} />
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}
      </div>
    </article>
  );
}
