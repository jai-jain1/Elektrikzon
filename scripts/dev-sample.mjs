// Runs the site with the built-in sample catalogue (data/fallback-products.ts)
// instead of Sanity, to check the design without touching live content.
// Stop `npm run dev` first: both use http://localhost:3000.
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "dev"], { stdio: "inherit", shell: true, env: { ...process.env, EZ_SAMPLE_DATA: "1" } });
child.on("exit", (code) => process.exit(code ?? 0));
