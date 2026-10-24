"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { SITE_URL } from "@/data/config";
import { useT } from "@/lib/i18n";

/** QR code to the website, tagged #qr-counter so scans show up in quote refs. */
export function ShopQR() {
  const t = useT();
  const wrap = useRef<HTMLDivElement>(null);
  const url = `${SITE_URL}/#qr-counter`;

  const download = () => {
    const canvas = wrap.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "elektrikzone-qr.png";
    a.click();
  };

  return (
    <div className="flex flex-col items-start gap-5 rounded-3xl border bg-surface/50 p-6 hairline sm:flex-row sm:items-center sm:p-8">
      <div ref={wrap} className="rounded-2xl bg-white p-3">
        {/* Rendered at print resolution, shown smaller. */}
        <QRCodeCanvas
          value={url}
          size={512}
          marginSize={2}
          level="M"
          fgColor="#000000"
          bgColor="#FFFFFF"
          style={{ width: 160, height: 160 }}
          title={url}
        />
      </div>
      <div>
        <h2 className="text-2xl leading-snug">{t("contact.qr.title")}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">{t("contact.qr.sub")}</p>
        <p className="mt-2 break-all font-mono text-xs text-muted">{url}</p>
        <button type="button" onClick={download} className="btn-ghost mt-4">
          {t("contact.qr.download")}
        </button>
      </div>
    </div>
  );
}
