"use client";

import { useState } from "react";

/**
 * A discount code with a copy button. The code is plain text in the server
 * HTML, so search engines and AI assistants read it without running script.
 */
export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (older browsers, some in-app browsers). The
      // code is still on screen to select by hand.
    }
  }

  return (
    <div className="deal-code">
      <span className="deal-code__label">Code</span>
      <code className="deal-code__value">{code}</code>
      <button type="button" className="deal-code__copy" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${code} copied` : ""}
      </span>
    </div>
  );
}
