import type { Metadata } from "next";
import { LightLab } from "@/components/lightlab/LightLab";

export const metadata: Metadata = {
  title: "Light Lab",
  description: "Try light colour and brightness in a room before you buy, then send the lighting brief to ElektrikZone on WhatsApp.",
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
