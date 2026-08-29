# Little Wilco

The weekly roundup for Williamson County families with little kids.

Next.js (App Router) on Vercel, file-based blog, self-hosted brand fonts.
Same stack shape as misemade.com.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000
```

Build check before deploying:

```bash
npm run build
```

> The site was authored in a sandbox without npm registry access, so the first
> `npm install` and `npm run build` happen on your machine. If either throws,
> paste the output back and it gets fixed.

## Environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonicals, sitemap, JSON-LD | `https://littlewilco.com`, no trailing slash |
| `NEXT_PUBLIC_GA_ID` | GA4 | `G-XXXXXXXXXX`. Omit and GA simply does not load. |
| `BEEHIIV_API_KEY` | newsletter signup | From beehiiv Settings → API |
| `BEEHIIV_PUBLICATION_ID` | newsletter signup | Starts with `pub_` |
| `BEHOLD_FEED_ID` | Instagram section | Feed ID from behold.so |

Vercel Web Analytics needs no key. Turn it on in the Vercel project and
`@vercel/analytics` starts reporting.

### Before beehiiv exists

`/api/subscribe` validates the address, logs it to the server, and returns a
friendly "signups open in a few days" message. Nothing is lost and nothing is
faked. Add the two beehiiv variables and the same form starts creating real
subscriptions with no front-end change. Swapping to Kit or Mailchimp later means
editing one file: `src/app/api/subscribe/route.ts`.

## Instagram section

Posts come from [Behold](https://behold.so), which holds the Instagram
connection and refreshes the token so it does not expire every 60 days.

Setup: create a feed in Behold, connect the Little Wilco Instagram account, then
put the feed ID in `BEHOLD_FEED_ID` on Vercel.

The fetch is server-side with a 24-hour `revalidate`, which matters: Behold's
free plan allows 1,200 feed views a month, and a client-side widget would spend
one per visitor. Fetching once a day server-side means the site uses about 30 a
month regardless of traffic.

Without the env var the section still renders, showing the handle and the
follow button with no grid. Same if Behold is down or the fetch fails, so a
third-party outage can never take the page with it.

## Adding a blog post

Drop a markdown file in `content/posts/`. The filename is the URL slug.

```yaml
---
title: "Post title"
description: "Meta description, roughly 150 to 160 characters."
answer: "One direct paragraph answering the title question. Renders in the
  Short answer box and is what answer engines tend to lift."
date: "2026-08-28"
updated: "2026-08-28"
category: "Free stuff"
towns: ["Franklin", "Brentwood"]
faqs:
  - q: "A question a parent would actually type"
    a: "A complete, self-contained answer."
---
```

Everything below the frontmatter is standard markdown, GFM tables included.
Sitemap, JSON-LD (`BlogPosting` plus `FAQPage`), reading time and the index
listing all pick it up automatically.

## SEO and AEO notes

Deliberate choices, and where this goes further than the Mise blog:

- **Short answer box** at the top of every post, mirrored in the description.
  Answer engines quote the first self-contained paragraph.
- **`FAQPage` structured data** built from frontmatter, so the questions are
  eligible for rich results and readable by assistants.
- **Internal links** between posts. Mise's posts have none, which leaves link
  equity on the floor.
- **Question-shaped H2s and FAQ questions**, phrased the way a parent types.
- **Honest uncertainty.** Posts say what could not be verified. Competing local
  pages are running two-year-old dates; being right and dated is the moat.

## Content sourcing rule

Every price, season, address and time in `content/posts/` was checked against
the organizer's own page in August 2026. Anything that could not be confirmed
is either omitted or explicitly flagged in the post. Keep it that way: a parent
who drives to a closed splash pad does not come back.

Things to re-check each season:

- Splash park dates (county posts them a window at a time)
- Farm seasons and prices, every August
- Library story time programs, which move by semester

## Structure

```
content/posts/        markdown posts, filename = slug
public/brand/         profile mark, used for favicon and OG image
public/fonts/         Bricolage Grotesque + Karla, self-hosted (SIL OFL 1.1)
src/app/              routes, sitemap, robots, subscribe API
src/components/       Wordmark, Header, Footer, SubscribeForm
src/lib/posts.ts      markdown reading and rendering
src/lib/site.ts       name, URL, socials, towns
src/styles/tokens.css design tokens from the little-wilco-design system
```

## Brand

Palette, type and shape come from the `little-wilco-design` system ("Sunny
Meadow"). The wordmark is type-based and matches the profile mark: heavy
"little" over light "wilco" with a marigold smile. Fonts are self-hosted so
rendering never depends on Google's CDN.
