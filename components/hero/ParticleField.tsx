"use client";

import { useEffect, useMemo, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Particle {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  r: number;
  seed: number;
  depth: number;
}

const VB_W = 1200;
const VB_H = 800;
const N = 260;
const COLS = 20;
const ROWS = 13;

function makeSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildParticles(): Particle[] {
  const rand = makeSeededRandom(7);
  const cellW = 520 / COLS;
  const cellH = 440 / ROWS;
  const gridOriginX = 120;
  const gridOriginY = -220;

  return Array.from({ length: N }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const jitterX = (rand() - 0.5) * 3;
    const jitterY = (rand() - 0.5) * 3;

    const angle = rand() * Math.PI * 2;
    const radius = 180 + rand() * 380;
    const depth = rand();

    return {
      sx: Math.cos(angle) * radius,
      sy: Math.sin(angle) * radius * 0.75,
      tx: gridOriginX + col * cellW + jitterX,
      ty: gridOriginY + row * cellH + jitterY,
      r: rand() < 0.15 ? 1.6 + rand() * 0.8 : 0.6 + rand() * 0.9,
      seed: rand(),
      depth,
    };
  });
}

export function ParticleField({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRefs = useRef<Array<SVGCircleElement | null>>([]);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const particles = useMemo(buildParticles, []);

  const lattice = useMemo(() => {
    const lines: Array<[number, number]> = [];
    for (let i = 0; i < N; i++) {
      const col = i % COLS;
      if (col < COLS - 1) lines.push([i, i + 1]);
      if (i + COLS < N) lines.push([i, i + COLS]);
    }
    return lines;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = Math.min(1, Math.max(0, self.progress * 1.35));
      },
    });

    return () => {
      st.kill();
    };
  }, [containerRef]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x =
        ((e.clientX - rect.left) / rect.width) * VB_W - VB_W / 2;
      mouseRef.current.y =
        ((e.clientY - rect.top) / rect.height) * VB_H - VB_H / 2;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    if (!prefersReduced) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }

    let raf = 0;
    const positions: Array<{ x: number; y: number }> = particles.map(() => ({
      x: 0,
      y: 0,
    }));

    if (prefersReduced) {
      progressRef.current = 1;
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const el = circleRefs.current[i];
        if (!el) continue;
        el.setAttribute("cx", String(pt.tx));
        el.setAttribute("cy", String(pt.ty));
        positions[i].x = pt.tx;
        positions[i].y = pt.ty;
      }
      for (let k = 0; k < lattice.length; k++) {
        const el = lineRefs.current[k];
        if (!el) continue;
        const [a, b] = lattice[k];
        el.setAttribute("x1", String(positions[a].x));
        el.setAttribute("y1", String(positions[a].y));
        el.setAttribute("x2", String(positions[b].x));
        el.setAttribute("y2", String(positions[b].y));
        el.setAttribute("opacity", "0.6");
      }
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
      };
    }

    const loop = (t: number) => {
      const p = progressRef.current;
      const time = t * 0.001;
      const wob = (1 - p) * 8;

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const el = circleRefs.current[i];
        if (!el) continue;

        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        let x = pt.sx * (1 - eased) + pt.tx * eased;
        let y = pt.sy * (1 - eased) + pt.ty * eased;

        x += Math.sin(time * 0.55 + pt.seed * 11) * wob;
        y += Math.cos(time * 0.42 + pt.seed * 13) * wob;

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const pull = Math.max(0, 1 - dist / 260);
          const strength = pull * pull * 22;
          x += (dx / dist) * strength;
          y += (dy / dist) * strength;
        }

        positions[i].x = x;
        positions[i].y = y;
        el.setAttribute("cx", x.toFixed(2));
        el.setAttribute("cy", y.toFixed(2));
      }

      const lineOpacity = Math.max(0, (p - 0.55) * 2.4);
      for (let k = 0; k < lattice.length; k++) {
        const el = lineRefs.current[k];
        if (!el) continue;
        const [a, b] = lattice[k];
        el.setAttribute("x1", positions[a].x.toFixed(2));
        el.setAttribute("y1", positions[a].y.toFixed(2));
        el.setAttribute("x2", positions[b].x.toFixed(2));
        el.setAttribute("y2", positions[b].y.toFixed(2));
        el.setAttribute("opacity", lineOpacity.toFixed(3));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [particles, lattice]);

  return (
    <svg
      ref={svgRef}
      viewBox={`${-VB_W / 2} ${-VB_H / 2} ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ willChange: "contents" }}
      aria-hidden
    >
      <defs>
        <radialGradient id="dotFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e6ecff" stopOpacity="1" />
          <stop offset="60%" stopColor="#6e8bff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6e8bff" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6e8bff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#6e8bff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6e8bff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="latticeLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6e8bff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a9bbff" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="-40" r="380" fill="url(#ambientGlow)" />

      <g>
        {lattice.map((_, i) => (
          <line
            key={`l${i}`}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            stroke="url(#latticeLine)"
            strokeWidth="0.6"
            opacity="0"
          />
        ))}
      </g>

      <g>
        {particles.map((p, i) => (
          <circle
            key={i}
            ref={(el) => {
              circleRefs.current[i] = el;
            }}
            cx={p.sx.toFixed(2)}
            cy={p.sy.toFixed(2)}
            r={p.r.toFixed(2)}
            fill="url(#dotFill)"
            opacity={(0.55 + p.depth * 0.45).toFixed(3)}
          />
        ))}
      </g>
    </svg>
  );
}
