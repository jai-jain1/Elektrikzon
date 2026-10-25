import type { Metadata } from "next";
import { SwitchConfigurator } from "@/components/configurator/SwitchConfigurator";

export const metadata: Metadata = {
  title: "Switch Configurator",
  description: "Plan a modular switch plate: pick the size, modules and finish, then send it to ElektrikZone on WhatsApp for a quote.",
  alternates: { canonical: "/configurator" },
  openGraph: { title: "Switch Configurator · ElektrikZone", url: "/configurator" },
};

export default function Page() {
  return (
    <div className="pt-16">
      <h1 className="sr-only">Switch Configurator</h1>
      <SwitchConfigurator />
    </div>
  );
}
