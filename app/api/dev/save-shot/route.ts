import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { SHOTS } from "@/data/shots";

// Development-only helper for the /render studio: saves a rendered image
// into public/shots. Disabled (404) in production builds.

const ALLOWED = new Set(Object.values(SHOTS).map((s) => s.file));

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const { file, data } = (await req.json()) as { file?: string; data?: string };
  if (!file || !ALLOWED.has(file) || !data?.startsWith("data:image/webp;base64,")) {
    return NextResponse.json({ message: "Invalid file or data" }, { status: 400 });
  }
  const dir = path.join(process.cwd(), "public", "shots");
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(data.slice("data:image/webp;base64,".length), "base64");
  await writeFile(path.join(dir, file), buf);
  return NextResponse.json({ saved: file, bytes: buf.length });
}
