type Props = {
  /** Font size in px for the wordmark lines. */
  size?: number;
  /** Show the marigold smile from the profile mark. */
  smile?: boolean;
  className?: string;
};

/**
 * Type-based brand identifier. The design system defines no logo mark —
 * this is the lockup, matching littlewilco-profile-1080.png:
 * "little" heavy over "wilco" light, with a marigold smile beneath.
 */
export default function Wordmark({ size = 26, smile = true, className }: Props) {
  return (
    <span className={["wordmark", className].filter(Boolean).join(" ")} style={{ fontSize: size }}>
      <span className="wm-1">little</span>
      <span className="wm-2">wilco</span>
      {smile && (
        <svg
          width={size * 1.45}
          height={size * 0.34}
          viewBox="0 0 100 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M6 5 C 26 22, 74 22, 94 5"
            fill="none"
            stroke="var(--lw-sun-light)"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}
