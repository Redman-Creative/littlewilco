export const site = {
  name: "Little Wilco",
  tagline: "The weekly roundup for Williamson County families with little kids",
  description:
    "A weekly roundup of things to do for Williamson County families with kids under 6. Franklin, Brentwood, Nolensville, Spring Hill, Thompson's Station, Fairview and College Grove.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://littlewilco.com").replace(/\/$/, ""),
  email: "hello@littlewilco.com",
  instagram: "https://www.instagram.com/littlewilco",
  instagramHandle: "@littlewilco",
  facebook: "https://www.facebook.com/littlewilco",
  towns: [
    "Franklin",
    "Brentwood",
    "Nolensville",
    "Spring Hill",
    "Thompson's Station",
    "Fairview",
    "College Grove",
  ],
} as const;

export const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
