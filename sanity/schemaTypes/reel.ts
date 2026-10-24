import { defineArrayMember, defineField, defineType } from "sanity";
import { PlayIcon } from "../lib/icons";
import { imageWithAlt } from "../lib/fields";

export const reel = defineType({
  name: "reel",
  title: "Reel",
  type: "document",
  icon: PlayIcon,
  description: "An Instagram reel or post shown on the Reels Wall. The wall is hidden when there are no reels.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "A short name, shown on the reel tile.",
      validation: (rule) => rule.required().error("Please give the reel a short title."),
    }),
    imageWithAlt("cover", "Cover image", "A still from the reel (portrait, about 1080 × 1350). Required.", true),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "text",
      rows: 3,
      description: "Shown under the tile.",
    }),
    defineField({
      name: "postUrl",
      title: "Instagram link",
      type: "url",
      description: "Open the reel on Instagram, tap Share, then Copy link, and paste it here.",
      validation: (rule) =>
        rule
          .required()
          .error("Please paste the Instagram link.")
          .uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "products",
      title: "Products shown in this reel",
      type: "array",
      description: "Visitors can add these straight to their quote from the reel.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "caption", media: "cover" } },
});
