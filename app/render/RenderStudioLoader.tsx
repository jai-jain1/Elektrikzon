"use client";

import dynamic from "next/dynamic";

// three.js only ever loads in the browser.
const RenderStudio = dynamic(() => import("./RenderStudio"), { ssr: false });

export function RenderStudioLoader() {
  return <RenderStudio />;
}
