"use client";

/**
 * Sanity Studio, embedded in the website at /studio.
 */
import { defineConfig, type DocumentActionComponent } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const SINGLETONS = new Set(["siteSettings"]);
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

/** Adds a tooltip to the Publish button so the owner knows edits are drafts until published. */
function withPublishHint(Original: DocumentActionComponent): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    const result = Original(props);
    return result ? { ...result, title: "Publish to make changes live on the website." } : result;
  };
  Wrapped.action = Original.action;
  return Wrapped;
}

export default defineConfig({
  name: "elektrikzone",
  title: "ElektrikZone Studio",
  basePath: "/studio",
  // A dummy ID keeps the config valid before .env.local is filled in;
  // the /studio page shows setup instructions in that case.
  projectId: projectId || "not-configured",
  dataset,

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      // No "new Site settings" button: there is only one.
      ...prev.filter((t) => !SINGLETONS.has(t.schemaType)),
      {
        id: "product-in-category",
        title: "Product in this category",
        schemaType: "product",
        parameters: [{ name: "categoryId", type: "string" }],
        value: (params: { categoryId: string }) => ({
          category: { _type: "reference", _ref: params.categoryId },
          sample: true,
          featured: false,
        }),
      },
    ],
  },

  document: {
    actions: (prev, context) => {
      const list = SINGLETONS.has(context.schemaType)
        ? prev.filter((a) => a.action && SINGLETON_ACTIONS.has(a.action))
        : prev;
      return list.map((a) => (a.action === "publish" ? withPublishHint(a) : a));
    },
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => !SINGLETONS.has(t.templateId) && t.templateId !== "product-in-category")
        : prev,
  },

  plugins: [
    structureTool({ structure }),
    // Query playground for development only.
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
});
