import { defineArrayMember, defineField, defineType } from "sanity";
import { TagIcon } from "../lib/icons";
import { imageWithAlt, placeholderWarning } from "../lib/fields";

// A seasonal or festival offer, e.g. "Diwali Lights". It appears on the
// website between its start and end dates: a banner on the homepage and
// its own page at /offers/<web address>.
export const campaign = defineType({
  name: "campaign",
  title: "Campaign / offer",
  type: "document",
  icon: TagIcon,
  description: "A festival or seasonal offer page, e.g. Diwali Lights. Shows on the site only between its start and end dates.",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "products", title: "Products" },
    { name: "hindi", title: "Hindi" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Campaign name",
      type: "string",
      group: "basics",
      description: "Big headline on the banner and page, e.g. “Diwali Lights”.",
      validation: (rule) => rule.required().error("Please give the campaign a name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "basics",
      description: "Click “Generate”. The page will be /offers/<this>, e.g. /offers/diwali-lights. Use this link on Instagram.",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required().error("Click “Generate” to create the web address."),
    }),
    defineField({
      name: "eyebrow",
      title: "Short line above the name (optional)",
      type: "string",
      group: "basics",
      description: "e.g. “Festival of lights”.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "basics",
      description: "One or two sentences under the headline.",
    }),
    imageWithAlt("heroImage", "Banner image", "Wide image for the banner (landscape, about 2400 px wide). If empty, a built-in image is used."),
    defineField({
      name: "startsAt",
      title: "Starts",
      type: "datetime",
      group: "basics",
      description: "The campaign appears on the site from this moment. Leave empty to start straight away.",
    }),
    defineField({
      name: "endsAt",
      title: "Ends",
      type: "datetime",
      group: "basics",
      description: "The campaign disappears after this moment and offer prices stop. Leave empty to run until you remove it.",
      validation: (rule) =>
        rule.custom((endsAt, ctx) => {
          const startsAt = (ctx.document as { startsAt?: string } | undefined)?.startsAt;
          if (endsAt && startsAt && new Date(endsAt as string) <= new Date(startsAt)) return "The end must be after the start.";
          return true;
        }),
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show a banner on the homepage",
      type: "boolean",
      group: "basics",
      initialValue: true,
    }),
    defineField({
      name: "offerNote",
      title: "Offer line (optional)",
      type: "string",
      group: "basics",
      description: "e.g. “Free delivery in Ulhasnagar on orders above ₹999”. Only write offers you will honour.",
      validation: placeholderWarning,
    }),
    defineField({
      name: "items",
      title: "Products in this campaign",
      type: "array",
      group: "products",
      description: "Pick products. An offer price here replaces the product’s selling price while the campaign runs.",
      of: [
        defineArrayMember({
          type: "object",
          name: "campaignItem",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (rule) => rule.required().error("Please pick a product."),
            }),
            defineField({
              name: "offerPrice",
              title: "Offer price in ₹ (optional)",
              type: "number",
              description: "Leave empty to use the product’s normal selling price.",
              validation: (rule) => rule.min(1).error("Offer price must be at least ₹1."),
            }),
            defineField({
              name: "badge",
              title: "Small badge (optional)",
              type: "string",
              description: "e.g. “Best for balconies”. Keep it short.",
              validation: (rule) => rule.max(28).warning("Short badges read best (under 28 characters)."),
            }),
          ],
          preview: {
            select: { title: "product.name", price: "offerPrice", badge: "badge", media: "product.images.0" },
            prepare: ({ title, price, badge, media }) => ({
              title: title ?? "Choose a product",
              subtitle: [price ? `Offer ₹${price}` : "Normal price", badge].filter(Boolean).join(" · "),
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "basics",
      description: "If two campaigns run at once, lower numbers show first.",
      initialValue: 10,
    }),
    defineField({ name: "titleHi", title: "Campaign name in Hindi (optional)", type: "string", group: "hindi" }),
    defineField({ name: "eyebrowHi", title: "Short line in Hindi (optional)", type: "string", group: "hindi" }),
    defineField({ name: "descriptionHi", title: "Description in Hindi (optional)", type: "text", rows: 3, group: "hindi" }),
    defineField({ name: "offerNoteHi", title: "Offer line in Hindi (optional)", type: "string", group: "hindi" }),
  ],
  orderings: [{ title: "Starts (newest first)", name: "startsDesc", by: [{ field: "startsAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", startsAt: "startsAt", endsAt: "endsAt", media: "heroImage" },
    prepare: ({ title, startsAt, endsAt, media }) => {
      const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "…");
      return { title, subtitle: `${fmt(startsAt)} → ${fmt(endsAt)}`, media };
    },
  },
});
