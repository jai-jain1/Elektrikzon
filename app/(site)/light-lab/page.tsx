import type { Metadata } from "next";
import { LightLab } from "@/components/lightlab/LightLab";

export const metadata: Metadata = {
  title: "Light Lab",
  description: "A 3D room to try before you buy: switch panel, COB, strip, profile and rope lights, go from warm to cool and dim them, then send the brief to ElektrikZone on WhatsApp.",
  alternates: { canonical: "/light-lab" },
  openGraph: { title: "Light Lab · ElektrikZone", url: "/light-lab" },
};

export default function Page() {
  return (
    <div className="pt-16">
      <h1 className="sr-only">Light Lab</h1>
      <LightLab />
    </div>
  );
}
