"use client";

import Link from "next/link";
import { SHOTS } from "@/data/shots";
import type { TKey } from "@/data/translations";
import { useT } from "@/lib/i18n";
import { ShotImage } from "@/components/media/ShotImage";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ArrowRightIcon } from "@/components/ui/icons";

const POINTS: { title: TKey; body: TKey }[] = [
  { title: "trade.p1.title", body: "trade.p1.body" },
  { title: "trade.p2.title", body: "trade.p2.body" },
  { title: "trade.p3.title", body: "trade.p3.body" },
];

/** Homepage block for interior designers and contractors: how to get a project quoted. */
export function TradeBlock() {
  const t = useT();
  return (
    <section aria-labelledby="trade-title" className="py-14 lg:py-24">
      <div className="container-site">
        <Reveal className="grid overflow-hidden rounded-[2rem] bg-elev lg:grid-cols-2">
          <div className="relative min-h-[16rem] bg-black lg:min-h-[34rem]">
            <ShotImage shot={SHOTS.showroomDetail} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="eyebrow">{t("trade.eyebrow")}</p>
            <h2 id="trade-title" className="mt-3 text-3xl font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.75rem]">
              {t("trade.title")}
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">{t("trade.sub")}</p>

            <ol className="mt-8 space-y-5">
              {POINTS.map((p, i) => (
                <li key={p.title} className="flex gap-4">
                  <span className="mt-0.5 text-xs tabular-nums text-electric">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.01em]">{t(p.title)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t(p.body)}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppButton message={t("trade.message")}>{t("trade.send")}</WhatsAppButton>
              <Link href="/designers" className="btn-ghost">
                {t("trade.designers")}
                <ArrowRightIcon size={16} />
              </Link>
              <Link href="/contractors" className="btn-ghost">
                {t("trade.contractors")}
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
