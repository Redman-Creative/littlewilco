import { getAllPostMeta } from "@/lib/posts";
import { getActiveDiscounts } from "@/lib/discounts";
import { site } from "@/lib/site";

// /llms.txt: a plain-text map of the site for AI assistants (llmstxt.org).
// Built from the same data as the pages, so it stays current on its own.
export const revalidate = 3600;

export function GET() {
  const posts = getAllPostMeta();
  const deals = getActiveDiscounts();

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description} Written by a toddler mom in Franklin, Tennessee. Prices, times and age ranges are checked against the organizer or business.`,
    "",
    "## Reader discounts",
    "",
    `- [Discounts from Williamson County businesses](${site.url}/discounts): Codes local businesses set up for Little Wilco readers, open to families across Middle Tennessee.`,
    ...deals.map(
      (d) =>
        `- [${d.offer}](${site.url}/discounts#${d.id}): ${d.business}, ${d.town}, TN. ${d.howTo}`,
    ),
    "",
    "## Guides",
    "",
    ...posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.description}`),
    "",
    "## Weekly lineup",
    "",
    `- [Get the lineup Thursday](${site.url}/email): The weekend list for families with kids under 6 in Williamson County, by email Thursday morning.`,
    `- [Instagram](${site.instagram}): The short version posts Friday morning.`,
    "",
    "## Contact",
    "",
    `- ${site.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
