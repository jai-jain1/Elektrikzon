import { defineField, defineType } from "sanity";
import { FolderIcon } from "../lib/icons";
import { imageWithAlt } from "../lib/fields";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: FolderIcon,
  description: "A type of light, e.g. Panel Lights or Strip Lights.",
  fields: [
    defineField({
      name: "title",
      title: "Category name",
      type: "string",
      description: "Shown on the homepage tiles, in the catalogue filters and on product pages.",
      validation: (rule) => rule.required().error("Please give the category a name."),
    }),
    defineField({
      name: "titleHi",
      title: "Category name in Hindi (optional)",
      type: "string",
      description: "Shown when a visitor switches the site to हिं. Leave empty to use the English name.",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Click “Generate”. This becomes part of the page link. Avoid changing it once the site is live.",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required().error("Click “Generate” to create the web address."),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "One or two lines shown under the category name.",
      validation: (rule) => rule.max(200).warning("Keep it short: under 200 characters reads best."),
    }),
    defineField({
      name: "descriptionHi",
      title: "Short description in Hindi (optional)",
      type: "text",
      rows: 2,
    }),
    imageWithAlt("coverImage", "Cover photo (optional)", "Shown on the category tile. Landscape, about 1600 px wide. The eight built-in types already have a rendered image; a photo here replaces it."),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first (1, 2, 3…).",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", order: "order", media: "coverImage" },
    prepare: ({ title, order, media }) => ({ title, subtitle: typeof order === "number" ? `Sort order ${order}` : undefined, media }),
  },
});
