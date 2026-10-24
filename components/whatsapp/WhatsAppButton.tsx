"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSettings } from "@/components/providers/Providers";
import { buildWhatsAppUrl, DEFAULT_QUOTE_MESSAGE } from "@/lib/whatsapp";
import { getSourceToken } from "@/lib/source";
import { useT } from "@/lib/i18n";
import { WhatsAppIcon } from "@/components/ui/icons";

interface Props {
  children: ReactNode;
  message?: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Opens WhatsApp with a prefilled message plus the visit’s source token
 * (“Ref: EZ-…”). Until the owner adds a WhatsApp number, it renders as a
 * disabled button explaining what is missing.
 */
export function WhatsAppButton({ children, message = DEFAULT_QUOTE_MESSAGE, className = "btn-primary", showIcon = true }: Props) {
  const settings = useSettings();
  const t = useT();
  const [source, setSource] = useState("web");

  useEffect(() => setSource(getSourceToken()), []);

  const text = message.includes("Ref: EZ-") ? message : `${message}\n\nRef: EZ-${source.toUpperCase()}`;
  const href = buildWhatsAppUrl(settings.whatsappNumber, text);

  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={`${t("whatsapp.missing")} [ADD: WhatsApp number]`}
        className={className}
      >
        {showIcon && <WhatsAppIcon size={18} />}
        {children}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {showIcon && <WhatsAppIcon size={18} />}
      {children}
    </a>
  );
}
