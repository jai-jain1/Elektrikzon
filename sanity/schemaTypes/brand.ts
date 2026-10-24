import { defineField, defineType } from "sanity";
import { TagIcon } from "../lib/icons";

// Brands are plain text only. There is deliberately no logo or image field:
// the website never shows brand logos.
export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: TagIcon,
  description: "A brand you stock. Shown as plain text only (no logos).",
  fields: [
    defineField({
      name: "name",
      title: "Brand name",
      type: "string",
      description: "Shown as plain text on product cards and in the catalogue filter. Only add brands you actually stock.",
      validation: (rule) => rule.required().error("Please type the brand name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Click “Generate”.",
      options: { source: "name", maxLength: 64 },
      validation: (rule) => rule.required().error("Click “Generate” to create the web address."),
    }),
  ],
  preview: { select: { title: "name" } },
});
