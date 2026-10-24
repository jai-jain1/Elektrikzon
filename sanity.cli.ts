/**
 * Config for the Sanity command line (npx sanity login / dataset import).
 * The CLI does not read Next.js env files, so .env.local is parsed here.
 */
import { readFileSync } from "node:fs";
import { defineCliConfig } from "sanity/cli";

function readEnvFile(file: string): Record<string, string> {
  try {
    return Object.fromEntries(
      readFileSync(file, "utf8")
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*$/))
        .filter((m): m is RegExpMatchArray => m !== null)
        .map((m) => [m[1], m[2].trim()]),
    );
  } catch {
    return {};
  }
}

const env = { ...readEnvFile(".env"), ...readEnvFile(".env.local"), ...process.env } as Record<string, string | undefined>;

export default defineCliConfig({
  api: {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
