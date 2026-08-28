import Link from "next/link";
import Wordmark from "./Wordmark";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <Wordmark size={22} />
          <p style={{ marginTop: "var(--space-4)", maxWidth: "34ch" }}>{site.tagline}.</p>
          <p>Made in Franklin, Tennessee.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/blog">Guides</Link>
          <Link href="/#subscribe">Weekend lineup</Link>
          <a href={site.instagram} rel="me noopener">Instagram</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
      </div>
      <div className="wrap" style={{ marginTop: "var(--space-8)" }}>
        <p style={{ fontSize: "var(--fs-2xs)" }}>
          &copy; {new Date().getFullYear()} Little Wilco. Event details change — always check with
          the organizer before you load the car.
        </p>
      </div>
    </footer>
  );
}
