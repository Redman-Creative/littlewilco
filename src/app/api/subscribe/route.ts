import { NextResponse } from "next/server";

/**
 * Newsletter signup.
 *
 * Provider is deliberately behind this one route so the front end never
 * changes. Set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID in the Vercel
 * project to go live. Until then the route accepts the address, logs it,
 * and tells the visitor honestly that signups open shortly.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email || "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ message: "Something went wrong reading that." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ message: "That email address doesn't look right." }, { status: 400 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.warn(`[subscribe] no provider configured yet; would have added: ${email}`);
    return NextResponse.json({
      message: "Got it. Signups open in a few days and you'll be in the first send.",
    });
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "littlewilco.com",
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[subscribe] beehiiv ${res.status}: ${detail}`);
      return NextResponse.json(
        { message: "That didn't go through. Try again in a minute?" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "You're on the list. Look for the lineup on Thursday.",
    });
  } catch (err) {
    console.error("[subscribe] request failed", err);
    return NextResponse.json(
      { message: "That didn't go through. Try again in a minute?" },
      { status: 502 }
    );
  }
}
