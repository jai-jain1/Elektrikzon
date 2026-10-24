import { notFound } from "next/navigation";
import { RenderStudioLoader } from "./RenderStudioLoader";

// Offline render studio: renders the site's photography locally and saves it
// to public/shots. Development only; returns 404 in production.
export const metadata = { title: "Render studio", robots: { index: false, follow: false } };

export default function RenderPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <RenderStudioLoader />;
}
