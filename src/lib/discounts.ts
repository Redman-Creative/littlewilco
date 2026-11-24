import { todayCentral, isPublished, getPostMeta } from "@/lib/posts";
import type { Faq } from "@/lib/posts";
import fs from "node:fs";
import path from "node:path";

/**
 * Reader discounts shown on /discounts.
 *
 * One entry per offer. To add a new one, copy the Restored Nights entry and
 * change every field. Dates are YYYY-MM-DD in Central time and must stay
 * quoted strings.
 *
 * - `added`   the day it appears on the page (a future date keeps it hidden)
 * - `checked` the last day the price and terms were checked against the business
 * - `expires` optional. The last day the code works; it drops off the page after
 * - `partner` true when Little Wilco earns a commission. The card is labeled
 * - `guide`   optional blog post slug. Linked from the card once that post is live
 * - `product.schemaType` what the code buys, for the page's structured data (see below)
 */

/**
 * Schema.org type for the thing a code buys, used as `itemOffered` in the
 * /discounts JSON-LD.
 *
 * "Product" and "Event" are left out on purpose. Google treats either one as a
 * rich result candidate and wants fields a discounts list page can't give it
 * (a price or rating on the Product itself; a date and venue on the Event).
 * Search Console flagged /discounts for this on Oct 12, 2026.
 *
 * - DigitalDocument  a download (guides, printables)
 * - Service          classes, lessons, day passes, sessions, visits
 * - MenuItem         food and drink
 * - CreativeWork     anything else that is made, not done
 */
export type OfferedItemType = "DigitalDocument" | "Service" | "MenuItem" | "CreativeWork";

export type Discount = {
  id: string;
  business: string;
  shortName: string;
  businessUrl: string;
  town: string;
  category: string;
  offer: string;
  code: string;
  url: string;
  cta: string;
  product?: { name: string; price: number; description: string; schemaType: OfferedItemType };
  percentOff?: number;
  /** Flat dollars off, for codes that aren't a percentage. Used for the price after the code. */
  amountOff?: number;
  about: string;
  details: string;
  howTo: string;
  fineprint: string;
  sourceNote: string;
  added: string;
  checked: string;
  expires?: string;
  partner: boolean;
  guide?: string;
  faqs?: Faq[];
};

export const discounts: Discount[] = [
  {
    id: "franktown-festival-of-lights",
    business: "FrankTown Festival of Lights",
    shortName: "FrankTown Festival of Lights",
    businessUrl: "https://franktownlights.com",
    town: "Franklin",
    category: "Christmas lights",
    offer: "$5 off a vehicle ticket",
    code: "LITTLEWILCO26",
    url: "https://www.eventbrite.com/e/1999704158970/?discount=LITTLEWILCO26",
    cta: "Get tickets with the code",
    product: {
      name: "FrankTown Festival of Lights passenger vehicle ticket",
      price: 35,
      description:
        "Drive-through entry for one passenger vehicle with up to 8 people, good any night from November 20 to December 31, 2026.",
      schemaType: "Service",
    },
    amountOff: 5,
    about:
      "FrankTown Festival of Lights is a drive-through Christmas light show at the Williamson County Ag Center on Long Lane in Franklin, open nightly from 5 to 9pm through December 31. Ticket sales support FrankTown Open Hearts, a local nonprofit that helps youth in Williamson County.",
    details:
      "The drive is a mile and a half, with more than 200 light displays timed to Christmas music on your car radio. Santa is there every night for free photos, and there's hot cocoa, s'mores at the fire pit and a food truck. On Walkin' Wednesdays (November 25 and December 2, 9 and 16) you can walk the route from 5 to 6:30pm on a vehicle ticket, before cars go through at 7.",
    howTo:
      "Enter LITTLEWILCO26 under Promo Code when you buy tickets online on Eventbrite. A $35 passenger vehicle ticket for up to 8 people comes to $30 plus Eventbrite's fee.",
    fineprint:
      "For tickets bought online. Works on every vehicle ticket, including the 9 to 15 person and commercial vehicle tickets, any night. FrankTown is open rain or shine and doesn't offer refunds. Little Wilco doesn't earn a commission on this code.",
    sourceNote: "Price and code checked on Eventbrite November 23, 2026. Code from FrankTown Festival of Lights.",
    added: "2026-11-25",
    checked: "2026-11-23",
    expires: "2026-12-31",
    partner: false,
    guide: "christmas-lights-franklin-tn-toddlers",
    faqs: [
      {
        q: "Is there a discount code for FrankTown Festival of Lights?",
        a: "Yes. LITTLEWILCO26 takes $5 off any vehicle ticket bought online on Eventbrite, so a $35 passenger vehicle ticket for up to 8 people comes to $30 plus Eventbrite's fee. Tickets are good any night through December 31, 2026.",
      },
      {
        q: "How much is FrankTown Festival of Lights in 2026?",
        a: "$35 for a passenger vehicle with up to 8 people, $60 for 9 to 15 people and $100 for a commercial van, bus or limo, plus Eventbrite's fee. Walkin' Wednesdays cost the same as driving.",
      },
    ],
  },
  {
    id: "restored-nights-potty-playbook",
    business: "Restored Nights Sleep Consulting",
    shortName: "Restored Nights",
    businessUrl: "https://www.restorednightssleepco.com",
    town: "Franklin",
    category: "Potty training",
    offer: "10% off the Potty Playbook",
    code: "LITTLEWILCO10",
    url: "https://www.restorednightssleepco.com/pottyplaybook/p/potty-power-playbook",
    cta: "Get the Potty Playbook",
    product: {
      name: "The Potty Playbook",
      price: 29,
      description:
        "A 48-page downloadable potty training guide from Restored Nights, with a readiness quiz, a day-by-day plan and printables.",
      schemaType: "DigitalDocument",
    },
    percentOff: 10,
    about:
      "Restored Nights is a pediatric sleep and potty training practice in Franklin. It's run by Lauren, a family nurse practitioner who is certified as a potty training consultant through the Institute of Pediatric Sleep & Parenting.",
    details:
      "The Potty Playbook is a 48-page PDF. It opens with a readiness quiz and a prep list, then walks through day one, days two and three, and what comes after. Later sections cover fears, accidents, constipation, outings and public restrooms, and it ends with printables like a reward chart and a page of questions to ask your child's daycare.",
    howTo: "Enter LITTLEWILCO10 at checkout on the Restored Nights site. The $29 guide comes to $26.10.",
    fineprint:
      "For the Potty Playbook. It's a download, so you can use the code from anywhere. Restored Nights says digital sales are final.",
    sourceNote: "Price checked October 11, 2026. Code confirmed with Restored Nights.",
    added: "2026-10-11",
    checked: "2026-10-11",
    partner: true,
    guide: "potty-playbook-restored-nights-franklin-tn",
    faqs: [
      {
        q: "Is there a discount code for the Potty Playbook?",
        a: "Yes. LITTLEWILCO10 takes 10% off the Potty Playbook at checkout on the Restored Nights site, so the $29 guide comes to $26.10.",
      },
      {
        q: "Who runs Restored Nights in Franklin?",
        a: "Lauren, a family nurse practitioner who is certified as a pediatric sleep consultant and a potty training consultant through the Institute of Pediatric Sleep & Parenting. She's based in Franklin and works with families around Nashville and virtually.",
      },
    ],
  },
];

/** Offers that are live today: added on or before today and not expired. */
export function getActiveDiscounts(): Discount[] {
  const today = todayCentral();
  return discounts.filter((d) => d.added <= today && (!d.expires || d.expires >= today));
}

/** Most recent `checked` date across live offers, for "Updated" lines and the sitemap. */
export function lastChecked(list: Discount[] = getActiveDiscounts()): string {
  return list.reduce((max, d) => (d.checked > max ? d.checked : max), "");
}

/** Price after the code, as "26.10". */
export function priceWithCode(d: Discount): string | null {
  if (!d.product) return null;
  if (d.percentOff) return (Math.round(d.product.price * (100 - d.percentOff)) / 100).toFixed(2);
  if (d.amountOff) return Math.max(0, d.product.price - d.amountOff).toFixed(2);
  return null;
}

/** The guide link only shows once its post is live, so the page never links to a 404. */
export function liveGuide(d: Discount): string | null {
  if (!d.guide) return null;
  const file = path.join(process.cwd(), "content", "posts", `${d.guide}.md`);
  if (!fs.existsSync(file)) return null;
  return isPublished(getPostMeta(d.guide).date) ? `/blog/${d.guide}` : null;
}

/** One-paragraph answer for the top of the page and for answer engines. */
export function discountsAnswer(list: Discount[] = getActiveDiscounts()): string {
  if (list.length === 0) {
    return "There are no reader codes running this week. New ones go in the Thursday email first, then here.";
  }
  const items = list.map((d) => `${d.offer} from ${d.shortName} in ${d.town}, with the code ${d.code}`);
  const lead =
    items.length === 1
      ? `Right now there's one: ${items[0]}.`
      : `Right now there are ${items.length}: ${items.join("; ")}.`;
  return `${lead} Each code was set up by the business for Little Wilco readers, and new ones go in the Thursday email.`;
}
