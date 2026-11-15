export default function Logo({ size = 30 }) {
  return (
    <span className="logo">
      <svg
        className="logo__mark"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="32" height="32" rx="8" className="logo__tile" />
        <circle cx="16" cy="16" r="8.5" fill="none" className="logo__ring" strokeWidth="2" />
        <circle cx="16" cy="16" r="3.2" className="logo__dot" />
        <path
          d="M7 9.5V7h2.5M25 9.5V7h-2.5M7 22.5V25h2.5M25 22.5V25h-2.5"
          fill="none"
          className="logo__corners"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo__word">PIXORA</span>
    </span>
  );
}
