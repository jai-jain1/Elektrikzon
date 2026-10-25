import type { TKey } from "@/data/translations";

export interface NavItem {
  href: string;
  key: TKey;
  /** Shown in the desktop header bar (others only in menu and footer). */
  primary: boolean;
}

// Primary items show in the desktop header; all show in the menu and footer.
export const NAV_ITEMS: NavItem[] = [
  { href: "/products", key: "nav.catalogue", primary: true },
  { href: "/offers", key: "nav.offers", primary: true },
  { href: "/configurator", key: "nav.configurator", primary: false },
  { href: "/light-lab", key: "nav.lightLab", primary: false },
  { href: "/designers", key: "nav.designers", primary: false },
  { href: "/contractors", key: "nav.contractors", primary: true },
  { href: "/about", key: "nav.about", primary: false },
  { href: "/contact", key: "nav.contact", primary: true },
  { href: "/contact#faq", key: "nav.faq", primary: false },
];
