"use client";

import { useMemo } from "react";

interface StageProps {
  stageRef: (el: SVGGElement | null) => void;
}

export function IngestGeometry({ stageRef }: StageProps) {
  const streams = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.PI / 12;
        const r = 260;
        return {
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
          angle,
        };
      }),
    []
  );

  return (
    <svg
      viewBox="-320 -320 640 640"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6e8bff" stopOpacity="0" />
          <stop offset="60%" stopColor="#6e8bff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a9bbff" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="coreGrad">
          <stop offset="0%" stopColor="#e6ecff" />
          <stop offset="50%" stopColor="#6e8bff" />
          <stop offset="100%" stopColor="#6e8bff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g ref={stageRef}>
        <circle
          cx="0"
          cy="0"
          r="120"
          fill="none"
          stroke="#1f2229"
          strokeDasharray="2 4"
        />
        <circle
          cx="0"
          cy="0"
          r="200"
          fill="none"
          stroke="#1f2229"
          strokeDasharray="2 6"
          opacity="0.6"
        />

        {streams.map((s, i) => (
          <g key={i}>
            <line
              x1={s.x.toFixed(2)}
              y1={s.y.toFixed(2)}
              x2="0"
              y2="0"
              stroke="url(#streamGrad)"
              strokeWidth="1"
              className="stream-line"
            />
            <circle
              cx={s.x.toFixed(2)}
              cy={s.y.toFixed(2)}
              r="2.4"
              fill="#a9bbff"
              className="stream-dot"
            />
          </g>
        ))}

        <circle
          cx="0"
          cy="0"
          r="60"
          fill="url(#coreGrad)"
          className="core-glow"
        />
        <circle cx="0" cy="0" r="10" fill="#e6ecff" className="core" />
      </g>
    </svg>
  );
}

export function AnalyzeGeometry({ stageRef }: StageProps) {
  const { nodes, edges } = useMemo(() => {
    const seededRandom = (() => {
      let s = 42;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    })();

    const nodeCount = 16;
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const cluster = i < 6 ? 0 : i < 11 ? 1 : 2;
      const centers = [
        { x: -110, y: -70 },
        { x: 120, y: -30 },
        { x: -20, y: 130 },
      ];
      const c = centers[cluster];
      const angle = seededRandom() * Math.PI * 2;
      const r = 30 + seededRandom() * 60;
      return {
        x: c.x + Math.cos(angle) * r,
        y: c.y + Math.sin(angle) * r,
        cluster,
        size: seededRandom() < 0.2 ? 5 : 3,
      };
    });

    const edges: Array<[number, number]> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 100) edges.push([i, j]);
      }
    }
    return { nodes, edges };
  }, []);

  return (
    <svg
      viewBox="-320 -320 640 640"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="nodeGrad">
          <stop offset="0%" stopColor="#e6ecff" />
          <stop offset="100%" stopColor="#6e8bff" />
        </radialGradient>
      </defs>

      <g ref={stageRef}>
        <g>
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x.toFixed(2)}
              y1={nodes[a].y.toFixed(2)}
              x2={nodes[b].x.toFixed(2)}
              y2={nodes[b].y.toFixed(2)}
              stroke="#6e8bff"
              strokeOpacity="0.3"
              strokeWidth="0.6"
              className="edge"
            />
          ))}
        </g>
        <g>
          {nodes.map((n, i) => (
            <g key={i} className="node">
              <circle
                cx={n.x.toFixed(2)}
                cy={n.y.toFixed(2)}
                r={n.size + 4}
                fill="#6e8bff"
                opacity="0.18"
              />
              <circle
                cx={n.x.toFixed(2)}
                cy={n.y.toFixed(2)}
                r={n.size}
                fill="url(#nodeGrad)"
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

export function InsightGeometry({ stageRef }: StageProps) {
  const bars = useMemo(
    () => [
      { h: 90, label: "M1" },
      { h: 140, label: "M2" },
      { h: 110, label: "M3" },
      { h: 200, label: "M4", highlight: true },
      { h: 160, label: "M5" },
    ],
    []
  );

  return (
    <svg
      viewBox="-320 -320 640 640"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9bbff" stopOpacity="1" />
          <stop offset="100%" stopColor="#6e8bff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="barGradDim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8cbd1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7b8090" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <g ref={stageRef}>
        <rect
          x="-260"
          y="-180"
          width="520"
          height="360"
          rx="16"
          fill="none"
          stroke="#1f2229"
        />
        <text
          x="-240"
          y="-152"
          fontFamily="var(--font-geist-mono)"
          fontSize="10"
          letterSpacing="1.5"
          fill="#7b8090"
        >
          SIGNAL DENSITY
        </text>
        <text
          x="-240"
          y="-118"
          fontFamily="var(--font-instrument-serif)"
          fontSize="34"
          fill="#f5f6f8"
        >
          24,712
        </text>
        <text
          x="-116"
          y="-124"
          fontFamily="var(--font-geist-mono)"
          fontSize="10"
          fill="#6ee7a7"
        >
          +18.2%
        </text>

        <line x1="-240" y1="140" x2="240" y2="140" stroke="#1f2229" />

        {bars.map((b, i) => {
          const x = -180 + i * 84;
          return (
            <g key={i}>
              <rect
                x={x}
                y={140 - b.h}
                width="42"
                height={b.h}
                rx="4"
                fill={b.highlight ? "url(#barGrad)" : "url(#barGradDim)"}
                className="bar-rect"
              />
              <text
                x={x + 21}
                y="160"
                textAnchor="middle"
                fontFamily="var(--font-geist-mono)"
                fontSize="9"
                fill="#7b8090"
              >
                {b.label}
              </text>
            </g>
          );
        })}

        <g className="callout" transform="translate(60,-52)">
          <rect
            x="0"
            y="0"
            width="180"
            height="56"
            rx="10"
            fill="#101114"
            stroke="#2b2f38"
          />
          <circle cx="14" cy="14" r="4" fill="#6ee7a7" />
          <text
            x="26"
            y="18"
            fontFamily="var(--font-geist-mono)"
            fontSize="9"
            letterSpacing="1.5"
            fill="#7b8090"
          >
            INSIGHT
          </text>
          <text
            x="14"
            y="38"
            fontFamily="var(--font-geist-sans)"
            fontSize="11"
            fill="#f5f6f8"
          >
            M4 spike matches launch
          </text>
        </g>

        <g className="automation-badge" transform="translate(60,20)">
          <rect
            x="0"
            y="0"
            width="200"
            height="48"
            rx="10"
            fill="#101114"
            stroke="#2b2f38"
          />
          <circle cx="14" cy="14" r="4" fill="#6e8bff" />
          <circle cx="14" cy="14" r="8" fill="#6e8bff" opacity="0.25" />
          <text
            x="26"
            y="18"
            fontFamily="var(--font-geist-mono)"
            fontSize="9"
            letterSpacing="1.5"
            fill="#7b8090"
          >
            AUTOMATION QUEUED
          </text>
          <text
            x="14"
            y="38"
            fontFamily="var(--font-geist-sans)"
            fontSize="11"
            fill="#c8cbd1"
          >
            notify · route · adjust budget
          </text>
        </g>

        <path
          className="automation-arrow"
          d="M150 -18 L150 -4 L155 -9 M150 -4 L145 -9"
          stroke="#6e8bff"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
