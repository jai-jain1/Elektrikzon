import { defineArrayMember, defineField, defineType } from "sanity";
import { BoxIcon } from "../lib/icons";
import { altField } from "../lib/fields";

const LIGHT_COLOUR_OPTIONS = ["Warm white", "Neutral white", "Cool white", "3-in-1", "RGB"];
const BODY_COLOUR_OPTIONS = ["White", "Black", "Grey", "Silver", "Gold", "Other"];
const USE_OPTIONS = ["Living room", "Bedroom", "Kitchen", "Bathroom", "Office", "Outdoor", "Commercial", "Industrial"];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: BoxIcon,
  description: "One light in the catalogue. Add a selling price to sell it online; without one, visitors request a trade price on WhatsApp.",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "details", title: "Details and specs" },
    { name: "photos", title: "Photos" },
    { name: "hindi", title: "Hindi" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "basics",
      description: "Shown on the product card and page. Keep it plain, e.g. “Slim Round Panel Light 12 W”.",
      validation: (rule) => rule.required().error("Please type the product name."),
    }),
    defineField({
      name: "productId",
      title: "Product ID",
      type: "slug",
      group: "basics",
      description:
        "Click “Generate”. Used in the page link and in WhatsApp quote messages, so customers and staff can find the exact item. Do not change it once the product is live.",
      options: { source: "name", maxLength: 80 },
      validation: (rule) => rule.required().error("Click “Generate” to create the product ID."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "basics",
      to: [{ type: "category" }],
      description: "Which type of light this is, e.g. Panel Lights or Strip Lights.",
      validation: (rule) => rule.required().error("Please choose a category."),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory (optional)",
      type: "reference",
      group: "basics",
      to: [{ type: "subcategory" }],
      description: "Only subcategories of the chosen category are listed. Choose the category first.",
      options: {
        filter: ({ document }) => {
          const ref = (document?.category as { _ref?: string } | undefined)?._ref;
          return ref
            ? { filter: "category._ref == $cat", params: { cat: ref.replace(/^drafts\./, "") } }
            : { filter: "false" };
        },
      },
    }),
    defineField({
      name: "brand",
      title: "Brand (optional)",
      type: "reference",
      group: "basics",
      to: [{ type: "brand" }],
      description: "Shown as plain text. Leave empty if you prefer not to name the brand.",
    }),
    defineField({
      name: "featured",
      title: "Feature on the homepage",
      type: "boolean",
      group: "basics",
      description: "Turn ON to show this product in the featured row on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "sample",
      title: "Sample listing",
      type: "boolean",
      group: "basics",
      description: "Turn this OFF for real products. While ON, the website shows a “Sample listing” tag.",
      initialValue: true,
    }),
    defineField({
      name: "wattage",
      title: "Wattage (W)",
      type: "number",
      group: "details",
      description: "Just the number, e.g. 12. If the same light comes in several wattages at different prices, add one product per wattage.",
      validation: (rule) => rule.min(0.1).max(2000).error("Please enter the wattage as a number, e.g. 12."),
    }),
    defineField({
      name: "lightColours",
      title: "Light colours available",
      type: "array",
      group: "details",
      description: "Tick every light colour you can supply. Customers choose one when they order. Warm is about 3000 K, Neutral about 4000 K, Cool about 6500 K.",
      of: [defineArrayMember({ type: "string" })],
      options: { list: LIGHT_COLOUR_OPTIONS.map((c) => ({ title: c, value: c })) },
    }),
    defineField({
      name: "bodyColours",
      title: "Body colours available",
      type: "array",
      group: "details",
      description: "The colour of the fitting itself (trim, body or profile). Tick every one you can supply.",
      of: [defineArrayMember({ type: "string" })],
      options: { list: BODY_COLOUR_OPTIONS.map((c) => ({ title: c, value: c })) },
    }),
    defineField({
      name: "use",
      title: "Where it is used",
      type: "array",
      group: "details",
      description: "Tick the rooms or project types this suits. Used by the catalogue filter.",
      of: [defineArrayMember({ type: "string" })],
      options: { list: USE_OPTIONS.map((u) => ({ title: u, value: u })) },
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      group: "details",
      description: "Shown as a table on the product page, e.g. Label “Cut-out size”, Value “75 mm”. Other useful labels: Lumens, Beam angle, IP rating, Voltage, Length per roll, Warranty. Only add facts you are sure of.",
      of: [
        defineArrayMember({
          type: "object",
          name: "spec",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required().error("Please add a label, e.g. “Finish”."),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required().error("Please add a value."),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "details",
      description: "A few plain sentences. Do not add claims (like ratings or certifications) unless they are true for this product.",
    }),
    defineField({
      name: "price",
      title: "Selling price in ₹ (optional)",
      type: "number",
      group: "details",
      description:
        "Fill this to let customers buy online (Add to bag, pay by UPI). Leave empty to show “Request trade price” and take quotes on WhatsApp.",
      validation: (rule) => rule.min(1).error("Price must be at least ₹1."),
    }),
    defineField({
      name: "mrp",
      title: "MRP in ₹ (optional)",
      type: "number",
      group: "details",
      description: "Leave empty if you do not want to show an MRP. When it is higher than the selling price, it is shown crossed out.",
      validation: (rule) => rule.min(0).error("MRP cannot be negative."),
    }),
    defineField({
      name: "inStockNote",
      title: "Availability note (optional)",
      type: "string",
      group: "details",
      description: "For example “Check availability on WhatsApp”. Never promise stock here.",
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "photos",
      description: "The first photo is the main one. WebP or JPG, about 1200 px wide, under 500 KB, on a clear background.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [altField()],
        }),
      ],
      validation: (rule) =>
        rule
          .custom((images, context) => {
            const isSample = (context.document as { sample?: boolean } | undefined)?.sample;
            if (isSample === false && (!Array.isArray(images) || images.length === 0)) {
              return "Real products look much better with at least one photo. Until then the site shows “Photo coming soon”.";
            }
            return true;
          })
          .warning(),
    }),
    defineField({
      name: "nameHi",
      title: "Product name in Hindi (optional)",
      type: "string",
      group: "hindi",
      description: "Shown when a visitor switches the site to हिं. Leave empty to use the English name.",
    }),
    defineField({
      name: "descriptionHi",
      title: "Description in Hindi (optional)",
      type: "text",
      rows: 4,
      group: "hindi",
    }),
  ],
  orderings: [
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
    { title: "Featured first", name: "featuredFirst", by: [{ field: "featured", direction: "desc" }, { field: "name", direction: "asc" }] },
  ],
  preview: {
    select: {
      name: "name",
      category: "category.title",
      brand: "brand.name",
      media: "images.0",
      sample: "sample",
    },
    prepare: ({ name, category, brand, media, sample }) => ({
      title: sample ? `${name ?? "Untitled"}  ·  SAMPLE` : name ?? "Untitled",
      subtitle: [category ?? "No category", brand].filter(Boolean).join(" · "),
      media,
    }),
  },
});
