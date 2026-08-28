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
};

export type Post = PostMeta & { html: string; readingMinutes: number };

function readFile(slug: string) {
  const full = path.join(POSTS_DIR, `${slug}.md`);
  return fs.readFileSync(full, "utf8");
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
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
