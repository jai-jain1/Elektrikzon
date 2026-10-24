import type { Config } from "tailwindcss";

// Colours are CSS variables holding "R G B" triplets so Tailwind's
// opacity modifiers work (e.g. bg-accent/20). Values live in app/globals.css.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        elev: token("bg-elev"),
        surface: token("surface"),
        line: token("line"),
        fg: token("fg"),
        muted: token("fg-muted"),
        accent: token("accent"),
        amber: token("amber"),
        electric: token("electric"),
        "on-accent": token("on-accent"),
      },
      fontFamily: {
        display: ["var(--font-sans)", "var(--font-deva)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "var(--font-deva)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "84rem",
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      transitionTimingFunction: {
        film: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
