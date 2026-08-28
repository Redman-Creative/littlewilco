import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <h1>That page wandered off</h1>
        <p className="lede">Happens to all of us around here.</p>
        <p style={{ marginTop: "var(--space-8)" }}>
          <Link href="/" className="btn btn--primary">
            Back to the lineup
          </Link>
        </p>
      </div>
    </section>
  );
}
