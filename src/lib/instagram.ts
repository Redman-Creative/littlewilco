/**
 * Instagram posts via Behold (behold.so).
 *
 * Behold handles the Instagram token refresh that otherwise breaks every 60
 * days, and caches the feed on their side. We fetch server-side and let Next
 * cache the result for a day, which matches Behold's free-plan refresh rate
 * and means the site makes roughly one request a day no matter how much
 * traffic it gets. That keeps us well under the free plan's 1,200 monthly
 * views, which a client-side widget would burn through quickly.
 *
 * Set BEHOLD_FEED_ID in the Vercel project. Without it the section still
 * renders, just with the profile link and no grid.
 */

export type InstagramPost = {
  id: string;
  permalink: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp?: string;
};

type BeholdResponse =
  | InstagramPost[]
  | {
      /** What the live API actually returns. Their docs say "media"; it is "posts". */
      posts?: InstagramPost[];
      media?: InstagramPost[];
      username?: string;
      biography?: string;
      profilePictureUrl?: string;
      followersCount?: number;
    };

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const feedId = process.env.BEHOLD_FEED_ID;
  if (!feedId) return [];

  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error(`[instagram] behold responded ${res.status}`);
      return [];
    }

    const data: BeholdResponse = await res.json();

    // Verified against the live feed: the response is an object keyed "posts".
    // Behold's docs document "media", and the docs also describe a bare array
    // for their basic API, so accept all three rather than trust one.
    const posts = Array.isArray(data) ? data : (data.posts ?? data.media ?? []);

    return posts
      .filter((p) => p && p.permalink && (p.mediaUrl || p.thumbnailUrl))
      .slice(0, limit);
  } catch (err) {
    console.error("[instagram] fetch failed", err);
    return [];
  }
}

/** Videos give a usable poster frame in thumbnailUrl; images do not have one. */
export function postImage(post: InstagramPost): string {
  return post.mediaType === "VIDEO" ? post.thumbnailUrl || post.mediaUrl : post.mediaUrl;
}

/** First line of the caption, trimmed, for the image alt text. */
export function postAlt(post: InstagramPost): string {
  const first = (post.caption || "").split("\n")[0].trim();
  if (!first) return "Little Wilco Instagram post";
  return first.length > 120 ? `${first.slice(0, 117)}…` : first;
}
