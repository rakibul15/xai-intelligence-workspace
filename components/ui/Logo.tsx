export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeOpacity="0.35" />
        <path
          d="M12 3.5 L12 20.5 M3.5 12 L20.5 12"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.6" fill="var(--color-base)" />
      </svg>
      <span className="text-fg text-[15px] tracking-tight font-medium">
        Xai
      </span>
    </div>
  );
}
