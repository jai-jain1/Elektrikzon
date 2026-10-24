import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";

// Development-only helper for the /render studio: saves the recorded hero
// loop into public/video. Disabled (404) in production builds.

const ALLOWED = new Set(["hero.mp4"]);
const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const file = req.nextUrl.searchParams.get("file") ?? "";
  if (!ALLOWED.has(file)) {
    return NextResponse.json({ message: "Invalid file" }, { status: 400 });
  }
  const buf = Buffer.from(await req.arrayBuffer());
  if (!buf.length || buf.length > MAX_BYTES) {
    return NextResponse.json({ message: "Empty or too large" }, { status: 400 });
  }
  const dir = path.join(process.cwd(), "public", "video");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, file), buf);
  return NextResponse.json({ saved: file, bytes: buf.length });
}
