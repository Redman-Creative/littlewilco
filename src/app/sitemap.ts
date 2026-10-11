import type { MetadataRoute } from "next";
import { getAllPostMeta } from "@/lib/posts";
import { lastChecked } from "@/lib/discounts";
import { site } from "@/lib/site";

// Re-render hourly so scheduled posts join the sitemap on their date.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostMeta();
  const discountsUpdated = lastChecked();

  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${site.url}/discounts`,
      lastModified: discountsUpdated ? new Date(`${discountsUpdated}T12:00:00`) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(`${p.updated || p.date}T12:00:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
