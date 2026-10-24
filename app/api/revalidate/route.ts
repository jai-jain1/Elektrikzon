import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_TAG } from "@/lib/sanity/fetch";

// On-demand revalidation, called by a Sanity webhook on create/update/delete.
// Set up in sanity.io/manage → API → Webhooks (see README.md / DEPLOY.md).

type WebhookPayload = { _type?: string; slug?: string };

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set on the server." }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret, true);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
    }

    // Refresh every Sanity-backed fetch, then the pages that use them.
    revalidateTag(SANITY_TAG);
    if (body?._type) revalidateTag(body._type);
    revalidatePath("/", "layout");
    revalidatePath("/products", "page");
    revalidatePath("/products/[slug]", "page");

    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
  } catch (error) {
    console.error("[ElektrikZone] Revalidate webhook failed:", error);
    return NextResponse.json({ message: "Could not process the webhook." }, { status: 500 });
  }
}
