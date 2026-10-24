/**
 * Visible marker for a business detail that has not been provided yet.
 * Renders exactly "[ADD: label]" so it is easy to find and replace.
 */
export function Placeholder({ label }: { label: string }) {
  return <span className="ez-placeholder">[ADD: {label}]</span>;
}

/** Shows the value if present, otherwise an [ADD: ...] placeholder. */
export function OrAdd({ value, label }: { value: string | undefined; label: string }) {
  return value && value.trim() ? <>{value}</> : <Placeholder label={label} />;
}
