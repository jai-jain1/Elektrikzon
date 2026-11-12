/**
 * One-time migration: turns the Sanity dataset from the original mixed
 * electrical catalogue (switches, wires, fans…) into the lighting-only one.
 *
 *   npx sanity exec scripts/migrate-to-lighting.ts --with-user-token -- --dry-run
 *   npx sanity exec scripts/migrate-to-lighting.ts --with-user-token
 *
 * What it does, in one transaction:
 *  - adds the eight types of light (categories) from seed/sample-data.ndjson
 *  - adds or refreshes the lighting sample products
 *  - removes the non-lighting SAMPLE products, and the old categories and
 *    subcategories when nothing of yours still uses them
 *  - replaces the seeded switch-era hero headline and "what we supply" list
 *
 * Anything you have edited (a price, a photo, Sample switched off) is kept.
 * A JSON backup of every affected document is written to backups/ first.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

type Doc = { _id: string; _type: string; [key: string]: unknown };

const client = getCliClient({ apiVersion: "2024-10-01" });
const dryRun = process.argv.includes("--dry-run");

const OLD_CATEGORIES = ["category-switches-and-sockets", "category-lighting", "category-technical-supply", "category-fans", "category-smart-home"];
const OLD_SUBCATEGORIES = [
  "subcategory-modular-switches",
  "subcategory-sockets",
  "subcategory-dimmers-and-regulators",
  "subcategory-plates-and-frames",
  "subcategory-cove-and-profile",
  "subcategory-downlights",
  "subcategory-panels",
  "subcategory-pendants",
  "subcategory-wires-and-cables",
  "subcategory-mcbs-and-distribution",
  "subcategory-conduits-and-fittings",
  "subcategory-accessories",
];
const OLD_SAMPLES = [
  "product-modular-switch-1-way",
  "product-modular-switch-2-way",
  "product-modular-socket",
  "product-modular-dimmer",
  "product-house-wire",
  "product-mcb",
  "product-ceiling-fan",
  "product-smart-touch-switch",
];
const OLD_HEADLINE = "Light, power and control, chosen with care.";
const OLD_FIRST_LINE = "Modular switches";

/** Every document id this value refers to. */
function refs(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => refs(v, found));
  else if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o._ref === "string") found.push(o._ref);
    Object.values(o).forEach((v) => refs(v, found));
  }
  return found;
}

/** A seeded sample the owner has not touched: still a sample, no price, no photos. */
const untouched = (d: Doc | undefined) => !d || (d.sample !== false && !d.price && !(Array.isArray(d.images) && d.images.length));

async function main() {
  const seed: Doc[] = readFileSync("seed/sample-data.ndjson", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const seedSettings = seed.find((d) => d._type === "siteSettings")!;

  const all: Doc[] = await client.fetch(`*[_type in ["category", "subcategory", "product", "siteSettings", "campaign", "brand", "reel"]]`);
  mkdirSync("backups", { recursive: true });
  const backup = `backups/sanity-before-lighting-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(backup, JSON.stringify(all, null, 2));
  console.log(`Backup of ${all.length} documents written to ${backup}\n`);

  const byId = new Map(all.map((d) => [d._id, d]));
  const tx = client.transaction();
  const log: string[] = [];
  /** Documents that will no longer hold their current references. */
  const settled = new Set<string>();
  const drop = (id: string, label: string) => {
    for (const target of [id, `drafts.${id}`]) {
      if (!byId.has(target)) continue;
      tx.delete(target);
      settled.add(target);
    }
    log.push(`- ${label}`);
  };

  for (const c of seed.filter((d) => d._type === "category")) {
    tx.createOrReplace(c);
    log.push(`${byId.has(c._id) ? "~" : "+"} category: ${c.title}`);
  }

  for (const p of seed.filter((d) => d._type === "product")) {
    const existing = byId.get(p._id);
    if (untouched(existing)) {
      tx.createOrReplace(p);
      settled.add(p._id);
      if (byId.has(`drafts.${p._id}`)) {
        tx.delete(`drafts.${p._id}`);
        settled.add(`drafts.${p._id}`);
      }
      log.push(`${existing ? "~" : "+"} sample product: ${p.name}`);
    } else {
      tx.patch(p._id, { set: { category: p.category }, unset: ["subcategory", "finishes"] });
      settled.add(p._id);
      log.push(`~ kept your edits to “${existing!.name}” and moved it to ${(p.category as { _ref: string })._ref}`);
    }
  }

  for (const id of OLD_SAMPLES) {
    const d = byId.get(id);
    if (!d) continue;
    if (untouched(d)) drop(id, `sample product: ${d.name}`);
    else log.push(`! kept “${d.name}”: it has your edits. Give it a lighting category or delete it in the Studio.`);
  }

  // An old category or subcategory goes only when nothing that remains still points at it.
  for (const id of [...OLD_SUBCATEGORIES, ...OLD_CATEGORIES]) {
    const d = byId.get(id);
    if (!d) continue;
    const users = all.filter((o) => !settled.has(o._id) && refs(o).includes(id));
    if (users.length) {
      log.push(`! kept ${d._type} “${d.title}”: still used by ${users.map((u) => `“${u.name ?? u.title ?? u._id}”`).join(", ")}`);
    } else {
      drop(id, `${d._type}: ${d.title}`);
    }
  }

  const settings = byId.get("siteSettings");
  if (!settings) {
    tx.createIfNotExists(seedSettings);
    log.push("+ site settings (placeholders)");
  } else {
    const set: Record<string, unknown> = {};
    if (Array.isArray(settings.headlines) && settings.headlines[0] === OLD_HEADLINE) set.headlines = seedSettings.headlines;
    if (Array.isArray(settings.strongestLines) && settings.strongestLines[0] === OLD_FIRST_LINE) set.strongestLines = seedSettings.strongestLines;
    tx.patch("siteSettings", { set, unset: ["heroVideoUrl"] });
    log.push(`~ site settings: ${Object.keys(set).join(", ") || "nothing to replace"}`);
  }

  console.log(log.join("\n"));
  if (dryRun) {
    console.log("\nDry run: nothing was changed in Sanity.");
    return;
  }
  await tx.commit();
  console.log("\nDone. The website picks the changes up within 5 minutes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
