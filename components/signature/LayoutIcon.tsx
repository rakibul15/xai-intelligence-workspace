import { LayoutName } from "@/lib/clusterLayouts";

interface Props {
  type: LayoutName;
  className?: string;
}

export function LayoutIcon({ type, className }: Props) {
  const stroke = "currentColor";

  if (type === "grid") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <circle
              key={`${r}-${c}`}
              cx={5 + c * 7}
              cy={5 + r * 7}
              r="1.4"
              fill={stroke}
            />
          ))
        )}
      </svg>
    );
  }

  if (type === "sphere") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          strokeDasharray="1.4 2.4"
          opacity="0.4"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          strokeDasharray="24 60"
          strokeDashoffset="12"
          transform="rotate(-24 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.6"
        />
        <circle cx="12" cy="12" r="1.6" fill={stroke} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <line x1="6" y1="6" x2="14" y2="10" stroke={stroke} strokeWidth="1" opacity="0.55" />
      <line x1="14" y1="10" x2="18" y2="17" stroke={stroke} strokeWidth="1" opacity="0.55" />
      <line x1="14" y1="10" x2="7" y2="17" stroke={stroke} strokeWidth="1" opacity="0.55" />
      <line x1="6" y1="6" x2="7" y2="17" stroke={stroke} strokeWidth="1" opacity="0.3" />
      <circle cx="6" cy="6" r="2" fill={stroke} />
      <circle cx="14" cy="10" r="2.6" fill={stroke} />
      <circle cx="18" cy="17" r="1.8" fill={stroke} />
      <circle cx="7" cy="17" r="2" fill={stroke} />
    </svg>
  );
}
