"use client";

import { useUI } from "@/lib/ui";
import { useT } from "@/lib/i18n";
import { copyText } from "@/lib/clipboard";
import { ShareIcon } from "@/components/ui/icons";

/** Web Share API on phones; copies the link everywhere else. */
export function ShareButton({ title, path, className = "btn-ghost" }: { title: string; path: string; className?: string }) {
  const t = useT();
  const showToast = useUI((u) => u.showToast);

  const onShare = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title} · ElektrikZone`, url });
        return;
      }
    } catch (e) {
      // User cancelled the share sheet: do nothing.
      if ((e as DOMException)?.name === "AbortError") return;
    }
    if (await copyText(url)) showToast(t("product.linkCopied"));
  };

  return (
    <button type="button" onClick={onShare} className={className}>
      <ShareIcon size={17} />
      {t("product.share")}
    </button>
  );
}
