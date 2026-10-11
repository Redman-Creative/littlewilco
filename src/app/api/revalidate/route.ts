import { revalidatePath } from "next/cache";

// Called once a day by the Vercel cron in vercel.json. Clears the cached blog
// pages, /discounts and /llms.txt so anything scheduled for today goes live
// even if nobody has visited since midnight. The hourly `revalidate` on each page is the other half.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/discounts");
  revalidatePath("/llms.txt");
  revalidatePath("/sitemap.xml");

  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
