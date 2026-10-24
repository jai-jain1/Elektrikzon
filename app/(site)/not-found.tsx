import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-start justify-center pt-28">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em] sm:text-6xl">This page isn’t wired up.</h1>
      <p className="mt-4 max-w-lg text-muted">The link may be old, or the product may have been removed from the catalogue.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" className="btn-primary">
          Browse the catalogue
        </Link>
        <Link href="/" className="btn-ghost">
          Go to the homepage
        </Link>
      </div>
    </section>
  );
}
