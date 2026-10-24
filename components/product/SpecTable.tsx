import type { Spec } from "@/types/catalog";

/** Spec table. Values still marked “[ADD: …]” are highlighted as placeholders. */
export function SpecTable({ specs, className = "" }: { specs: Spec[]; className?: string }) {
  if (!specs.length) return null;
  return (
    <dl className={`divide-y border-y text-sm hairline [&>div]:hairline ${className}`}>
      {specs.map((s, i) => (
        <div key={`${s.label}-${i}`} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5">
          <dt className="text-muted">{s.label}</dt>
          <dd className="text-fg">{s.value.includes("[ADD:") ? <span className="ez-placeholder">{s.value}</span> : s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
