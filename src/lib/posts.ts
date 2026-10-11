import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type Faq = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** Short direct answer, rendered above the article and used for answer engines. */
  answer: string;
  date: string;
  updated?: string;
  category: string;
  towns?: string[];
  faqs?: Faq[];
  /** Domains whose links get rel="sponsored noopener" (partner or affiliate links). */
  sponsored?: string[];
  /** Partner disclosure shown above the article. */
  disclosure?: string;
};

export type Post = PostMeta & { html: string; readingMinutes: number };

function readFile(slug: string) {
  const full = path.join(POSTS_DIR, `${slug}.md`);
  return fs.readFileSync(full, "utf8");
}

/** Every post file, including ones scheduled for a future date. */
function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Today's date in Central time as YYYY-MM-DD. Williamson County is Central, so a
 * post dated 2026-10-08 goes live at midnight Central on October 8.
 */
export function todayCentral(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Scheduled publishing: a post whose `date` is in the future stays hidden from
 * every page, the sitemap and its own URL until that date. The blog pages
 * revalidate hourly (plus a daily cron at /api/revalidate), so a scheduled post
 * appears on its date without a new deploy.
 */
export function isPublished(date: string): boolean {
  return !!date && date <= todayCentral();
}

/** Slugs of posts that are live today. */
export function getPostSlugs(): string[] {
  return getAllSlugs().filter((slug) => isPublished(getPostMeta(slug).date));
}

export function getPostMeta(slug: string): PostMeta {
  const { data } = matter(readFile(slug));
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    answer: String(data.answer ?? ""),
    date: String(data.date ?? ""),
    updated: data.updated ? String(data.updated) : undefined,
    category: String(data.category ?? "Guide"),
    towns: Array.isArray(data.towns) ? data.towns.map(String) : undefined,
    faqs: Array.isArray(data.faqs)
      ? data.faqs.map((f: { q: unknown; a: unknown }) => ({ q: String(f.q), a: String(f.a) }))
      : undefined,
    sponsored: Array.isArray(data.sponsored) ? data.sponsored.map(String) : undefined,
    disclosure: data.disclosure ? String(data.disclosure) : undefined,
  };
}

export async function getPost(slug: string): Promise<Post> {
  const meta = getPostMeta(slug);
  const { content } = matter(readFile(slug));

  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);
  let html = String(processed);

  // Tables need their own horizontal scroll container so the page body never
  // scrolls sideways on a phone.
  html = html.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, "</table></div>");

  // Partner links are marked rel="sponsored", per Google's guidance for paid
  // and affiliate links. Domains come from the post's `sponsored` front matter.
  const sponsored = meta.sponsored ?? [];
  if (sponsored.length) {
    html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, (tag, href: string) => {
      let host = "";
      try {
        host = new URL(href.replace(/&amp;/g, "&")).hostname.replace(/^www\./, "");
      } catch {
        return tag;
      }
      const hit = sponsored.some((d) => host === d || host.endsWith(`.${d}`));
      return hit ? `<a href="${href}" rel="sponsored noopener" target="_blank"` : tag;
    });
  }

  const words = content.trim().split(/\s+/).length;

  return { ...meta, html, readingMinutes: Math.max(1, Math.round(words / 220)) };
}

export function getAllPostMeta(): PostMeta[] {
  return getPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
