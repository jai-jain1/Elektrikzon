"use client";

import { usePrefs, useIsLite } from "@/lib/prefs";
import { useT } from "@/lib/i18n";
import { FeatherIcon, MoonIcon, SunIcon } from "@/components/ui/icons";

export function LangToggle({ className = "" }: { className?: string }) {
  const t = useT();
  const toggleLang = usePrefs((s) => s.toggleLang);
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t("toggle.langLabel")}
      className={`icon-btn w-auto min-w-11 px-3 text-sm font-medium ${className}`}
    >
      <span aria-hidden="true">{t("toggle.lang")}</span>
    </button>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useT();
  const theme = usePrefs((s) => s.theme);
  const toggleTheme = usePrefs((s) => s.toggleTheme);
  const toLight = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={toLight ? t("toggle.themeToLight") : t("toggle.themeToDark")}
      className={`icon-btn ${className}`}
    >
      {toLight ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/** Visible Lite mode switch: turns off 3D and decorative motion. */
export function LiteToggle({ className = "" }: { className?: string }) {
  const t = useT();
  const lite = useIsLite();
  const toggleLite = usePrefs((s) => s.toggleLite);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={lite}
      onClick={toggleLite}
      title={t("toggle.liteHelp")}
      className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-3.5 text-xs font-medium text-muted transition-colors hover:text-fg hairline ${className}`}
    >
      <FeatherIcon size={16} />
      <span>{t("toggle.lite")}</span>
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 rounded-full transition-colors ${lite ? "bg-accent" : "bg-fg/15"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-bg transition-[left] ${lite ? "left-[14px]" : "left-0.5"}`}
        />
      </span>
      <span className="sr-only">{lite ? t("toggle.on") : t("toggle.off")}</span>
    </button>
  );
}
