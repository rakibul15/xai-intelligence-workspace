export function CoordinateGrid() {
  const size = 640;
  const step = 32;
  const dots = [];
  for (let x = step; x < size; x += step) {
    for (let y = step; y < size; y += step) {
      dots.push({ x, y });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <defs>
        <radialGradient id="gridFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5f6f8" stopOpacity="0.14" />
          <stop offset="60%" stopColor="#f5f6f8" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f5f6f8" stopOpacity="0" />
        </radialGradient>
        <mask id="gridMask">
          <rect width={size} height={size} fill="url(#gridFade)" />
        </mask>
      </defs>

      <g mask="url(#gridMask)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="0.75" fill="#c8cbd1" />
        ))}

        {[80, 160, 240].map((r) => (
          <circle
            key={`r-${r}`}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#c8cbd1"
            strokeWidth="0.5"
            strokeDasharray="1 4"
            opacity="0.4"
          />
        ))}

        <line
          x1="0"
          y1={size / 2}
          x2={size}
          y2={size / 2}
          stroke="#c8cbd1"
          strokeWidth="0.4"
          strokeDasharray="2 6"
          opacity="0.3"
        />
        <line
          x1={size / 2}
          y1="0"
          x2={size / 2}
          y2={size}
          stroke="#c8cbd1"
          strokeWidth="0.4"
          strokeDasharray="2 6"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

export function CornerTicks() {
  const tick = (rotation: number, x: string, y: string) => (
    <div
      className="absolute w-6 h-6 border-fg-mute"
      style={{
        [x]: "12px",
        [y]: "12px",
        transform: `rotate(${rotation}deg)`,
      } as React.CSSProperties}
    >
      <span className="absolute top-0 left-0 w-full h-px bg-fg-mute" />
      <span className="absolute top-0 left-0 w-px h-full bg-fg-mute" />
    </div>
  );

  return (
    <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden>
      {tick(0, "left", "top")}
      {tick(90, "right", "top")}
      {tick(-90, "left", "bottom")}
      {tick(180, "right", "bottom")}
    </div>
  );
}
