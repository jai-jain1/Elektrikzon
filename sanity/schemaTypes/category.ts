import { defineField, defineType } from "sanity";
import { FolderIcon } from "../lib/icons";
import { imageWithAlt } from "../lib/fields";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: FolderIcon,
  description: "A main section of the catalogue, e.g. Lighting.",
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
    defineField({
      name: "displayStyle",
      title: "How it looks on the homepage",
      type: "string",
      description:
        "Editorial = large photo tile. Technical = compact row (good for wires, MCBs, conduits, accessories). Standard = normal tile.",
      options: {
        list: [
          { title: "Editorial (large tile)", value: "editorial" },
          { title: "Technical (compact row)", value: "technical" },
          { title: "Standard", value: "standard" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
      validation: (rule) => rule.required().error("Please choose how this category should look."),
    }),
    imageWithAlt("coverImage", "Cover photo", "Shown on the category tile. Landscape, about 1600 px wide."),
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
    select: { title: "title", style: "displayStyle", media: "coverImage" },
    prepare: ({ title, style, media }) => ({ title, subtitle: style ? `Style: ${style}` : undefined, media }),
  },
});
