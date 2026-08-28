import Link from "next/link";
import Wordmark from "./Wordmark";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" aria-label="Little Wilco home" style={{ textDecoration: "none", color: "inherit" }}>
          <Wordmark size={24} />
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/blog">Guides</Link>
          <Link href="/#subscribe">Get the lineup</Link>
        </nav>
      </div>
    </header>
  );
}
