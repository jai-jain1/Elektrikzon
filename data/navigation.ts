import type { TKey } from "@/data/translations";

export interface NavItem {
  href: string;
  key: TKey;
  /** Shown in the desktop header bar (others only in menu and footer). */
  primary: boolean;
}

// Routes are built across Stages 3 to 6; some will 404 until then.
export const NAV_ITEMS: NavItem[] = [
  { href: "/products", key: "nav.catalogue", primary: true },
  { href: "/offers", key: "nav.offers", primary: true },
  { href: "/#configurator", key: "nav.configurator", primary: true },
  { href: "/#light-lab", key: "nav.lightLab", primary: true },
  { href: "/designers", key: "nav.designers", primary: true },
  { href: "/contractors", key: "nav.contractors", primary: true },
  { href: "/about", key: "nav.about", primary: false },
  { href: "/contact", key: "nav.contact", primary: true },
  { href: "/#faq", key: "nav.faq", primary: false },
];
