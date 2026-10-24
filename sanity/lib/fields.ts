import { defineField, type StringRule } from "sanity";

/** Non-blocking reminder when a seeded "[ADD: ...]" placeholder is still there. */
export const placeholderWarning = (rule: StringRule) =>
  rule
    .custom((value?: string) =>
      value && value.includes("[ADD:") ? "This is still a placeholder. Replace it with your real details." : true,
    )
    .warning();

/** Image with hotspot and a required alt text, used across all types. */
export function imageWithAlt(name: string, title: string, description: string, required = false) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [altField()],
    validation: required ? (rule) => rule.required().error("Please add a photo here.") : undefined,
  });
}

export function altField() {
  return defineField({
    name: "alt",
    title: "Alt text (describe the photo)",
    type: "string",
    description: "Used by screen readers and Google. Name it after the product, e.g. “Charcoal 2-module switch plate”.",
    validation: (rule) => rule.required().error("Please describe the photo in a few words."),
  });
}
