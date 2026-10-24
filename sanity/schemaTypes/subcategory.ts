import { defineField, defineType } from "sanity";
import { SubfolderIcon } from "../lib/icons";

export const subcategory = defineType({
  name: "subcategory",
  title: "Subcategory",
  type: "document",
  icon: SubfolderIcon,
  description: "A smaller group inside a category, e.g. Downlights inside Lighting.",
  fields: [
    defineField({
      name: "title",
      title: "Subcategory name",
      type: "string",
      description: "Shown as a filter in the catalogue.",
      validation: (rule) => rule.required().error("Please give the subcategory a name."),
    }),
    defineField({
      name: "titleHi",
      title: "Subcategory name in Hindi (optional)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Click “Generate”.",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required().error("Click “Generate” to create the web address."),
    }),
    defineField({
      name: "category",
      title: "Belongs to category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Which main category this sits under.",
      validation: (rule) => rule.required().error("Please choose the main category."),
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
  preview: {
    select: { title: "title", category: "category.title" },
    prepare: ({ title, category }) => ({ title, subtitle: category ? `in ${category}` : "No category yet" }),
  },
});
