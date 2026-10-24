import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { SITE_URL } from "@/data/config";
import { PREFS_KEY } from "@/lib/storage";

// Root layout: shared by the website and the embedded Studio (/studio).
// Site chrome, styles and data live in app/(site)/layout.tsx.

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const deva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-deva",
  display: "swap",
});

const TITLE = "ElektrikZone · Electrical products, wholesale and retail, Ulhasnagar";
const DESCRIPTION =
  "ElektrikZone supplies switches, sockets, lighting, wires, MCBs, fans and smart home products, wholesale and retail, in Ulhasnagar, Maharashtra. Request a quote on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · ElektrikZone" },
  description: DESCRIPTION,
  applicationName: "ElektrikZone",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ElektrikZone",
    locale: "en_IN",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
  ],
};

// Applies the saved theme before first paint so there is no flash.
const themeScript = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  PREFS_KEY,
)})||"{}").state||{};document.documentElement.dataset.theme=s.theme==="light"?"light":"dark";}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      suppressHydrationWarning
      className={`${sans.variable} ${deva.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
