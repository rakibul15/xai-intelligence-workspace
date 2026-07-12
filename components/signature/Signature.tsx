"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/lib/useInView";
import {
  gridLayout,
  sphereLayout,
  graphLayout,
  computeGraphEdges,
  LayoutName,
} from "@/lib/clusterLayouts";
import { LayoutIcon } from "./LayoutIcon";
import { CoordinateGrid, CornerTicks } from "./InstrumentFrame";

const NodeCluster = dynamic(
  () => import("./NodeCluster").then((m) => m.NodeCluster),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="mono-label text-fg-mute">Initializing…</div>
      </div>
    ),
  }
);

const LAYOUTS: Array<{
  id: LayoutName;
  label: string;
  caption: string;
  stat: string;
  kbd: string;
  meta: string;
}> = [
  {
    id: "grid",
    label: "Grid",
    caption: "Ordered lattice. Every axis a coordinate.",
    stat: "125 discrete positions",
    kbd: "G",
    meta: "5·5·5 cube",
  },
  {
    id: "sphere",
    label: "Sphere",
    caption: "Uniform distribution. Every point equal weight.",
    stat: "Fibonacci lattice · 120 pts",
    kbd: "S",
    meta: "surface even",
  },
  {
    id: "graph",
    label: "Graph",
    caption: "Semantic clusters. Similar things gather.",
    stat: "4 clusters · community detection",
    kbd: "R",
    meta: "force-directed",
  },
];

const FOCUS_NODE = {
  id: "node_042",
  kind: "signal",
  confidence: 0.87,
  delta: "+3.2σ",
  source: "warehouse.orders",
};

function useTickingRotation(reduced: boolean) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setAngle((a) => (a + 0.8) % 360);
    }, 90);
    return () => window.clearInterval(id);
  }, [reduced]);
  return angle;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

export function Signature() {
  const [layout, setLayout] = useState<LayoutName>("sphere");
  const [reshapeCount, setReshapeCount] = useState(0);
  const [pulse, setPulse] = useState(0);
  const reduced = useReducedMotion();
  const rotation = useTickingRotation(reduced);
  const pulseTimer = useRef<number | undefined>(undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const clusterReady = useInView(sectionRef, "500px");

  const layouts = useMemo(
    () => ({
      grid: gridLayout(),
      sphere: sphereLayout(),
      graph: graphLayout(),
    }),
    []
  );

  const graphEdges = useMemo(() => computeGraphEdges(layouts.graph), [layouts.graph]);
  const active = LAYOUTS.find((l) => l.id === layout)!;

  const changeLayout = useCallback((id: LayoutName) => {
    setLayout((prev) => {
      if (prev === id) return prev;
      setReshapeCount((c) => c + 1);
      setPulse((p) => p + 1);
      return id;
    });
  }, []);

  useEffect(() => {
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
  }, [pulse]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      if (k === "g") changeLayout("grid");
      else if (k === "s") changeLayout("sphere");
      else if (k === "r") changeLayout("graph");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeLayout]);

  return (
    <section
      id="signature"
      ref={sectionRef}
      className="py-20 md:py-40 relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute top-24 left-1/4 w-[700px] h-[700px] rounded-full blur-3xl opacity-25 -z-10"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 -z-10"
        style={{ background: "radial-gradient(circle, var(--color-accent-hi) 0%, transparent 60%)" }}
      />

      <Container>
        <SectionLabel index="04" label="The Signature" />

        <div className="grid grid-cols-12 gap-6 md:gap-8 lg:gap-12 mt-6 md:mt-8 items-start">
          <div className="col-span-12 lg:col-span-5 lg:pt-4">
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-fg leading-[0.95]">
              Every structure
              <br />
              is a lens.
            </h2>

            <p className="mt-8 text-lg text-fg-mid max-w-md leading-relaxed">
              Ask Xai to reshape your data. The pattern you were looking for
              was one arrangement away.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-2">
              {LAYOUTS.map((l) => {
                const isActive = l.id === layout;
                return (
                  <button
                    key={l.id}
                    onClick={() => changeLayout(l.id)}
                    aria-pressed={isActive}
                    className={`relative group flex flex-col items-start gap-3 p-4 rounded-xl border transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base overflow-hidden ${
                      isActive
                        ? "border-line-hi bg-elevated"
                        : "border-line bg-elevated/40 hover:border-line-hi hover:bg-elevated/70"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sig-active-bg"
                        className="absolute inset-0 -z-0"
                        style={{
                          background:
                            "linear-gradient(140deg, rgba(110,139,255,0.12) 0%, rgba(110,139,255,0) 60%)",
                        }}
                        transition={{ type: "spring", stiffness: 460, damping: 32 }}
                      />
                    )}
                    <div className="relative flex items-center justify-between w-full">
                      <LayoutIcon
                        type={l.id}
                        className={`h-6 w-6 transition-colors ${
                          isActive ? "text-accent-hi" : "text-fg-lo group-hover:text-fg-mid"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-mono border rounded px-1.5 py-0.5 transition-colors ${
                          isActive
                            ? "border-accent/40 text-accent-hi bg-accent/10"
                            : "border-line text-fg-mute"
                        }`}
                      >
                        {l.kbd}
                      </span>
                    </div>
                    <div className="relative">
                      <div
                        className={`text-sm font-medium transition-colors ${
                          isActive ? "text-fg" : "text-fg-mid group-hover:text-fg"
                        }`}
                      >
                        {l.label}
                      </div>
                      <div className="text-[10px] font-mono text-fg-lo mt-1">
                        {l.meta}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 min-h-[96px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={layout}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3"
                >
                  <p className="text-fg text-lg leading-relaxed max-w-md">
                    {active.caption}
                  </p>
                  <p className="mono-label text-accent-hi">{active.stat}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 pt-6 border-t border-line max-w-md">
              <div className="flex items-center gap-3 text-xs font-mono text-fg-lo">
                <span className="flex items-center gap-1.5">
                  <span className="border border-line rounded px-1 py-0.5 text-fg-mute">
                    G
                  </span>
                  <span className="border border-line rounded px-1 py-0.5 text-fg-mute">
                    S
                  </span>
                  <span className="border border-line rounded px-1 py-0.5 text-fg-mute">
                    R
                  </span>
                  <span>to reshape</span>
                </span>
                <span className="text-fg-mute">·</span>
                <span>drag to rotate</span>
              </div>
              <div className="mt-2 text-[11px] font-mono text-fg-mute">
                Every arrangement is deterministic — same input, same shape, every time.
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 relative">
            <div
              data-hover-target
              className="aspect-square max-w-[720px] w-full mx-auto rounded-2xl sm:rounded-3xl border border-line-hi bg-elevated/40 overflow-hidden relative shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
            >
              <CoordinateGrid />

              <div className="absolute inset-0">
                {clusterReady ? (
                  <NodeCluster
                    targets={layouts[layout]}
                    edges={graphEdges}
                    layout={layout}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="mono-label text-fg-mute">Standby…</div>
                  </div>
                )}
              </div>

              <CornerTicks />

              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 h-9 border-b border-line/60 bg-base/40 backdrop-blur-md pointer-events-none">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="mono-label text-fg-mute truncate">
                    <span className="hidden xs:inline">CLUSTER · </span>ATLAS 042
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-[10px] font-mono shrink-0">
                  <span className="text-fg-mute hidden sm:inline">
                    ROT <span className="text-fg-mid">{rotation.toFixed(1)}°</span>
                  </span>
                  <span className="text-fg-mute hidden xs:inline">
                    NODES <span className="text-fg-mid">120</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-fg-mute">
                    <span className="relative flex h-1.5 w-1.5">
                      {!reduced && (
                        <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-70" />
                      )}
                      <span className="relative rounded-full h-1.5 w-1.5 bg-success" />
                    </span>
                    LIVE
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 h-9 border-t border-line/60 bg-base/40 backdrop-blur-md pointer-events-none">
                <div className="text-[10px] font-mono text-fg-mute">
                  MODE ·{" "}
                  <span className="text-fg-mid uppercase tracking-widest">
                    {layout}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-fg-mute">
                  <span className="hidden xs:inline">RESHAPES </span>
                  <span className="xs:hidden">R </span>
                  <span className="text-fg-mid">{String(reshapeCount).padStart(3, "0")}</span>
                </div>
              </div>

              <AnimatePresence>
                {pulse > 0 && (
                  <motion.div
                    key={pulse}
                    initial={{ opacity: 0.28 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 pointer-events-none bg-accent-hi"
                  />
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute left-3 sm:left-4 bottom-12 sm:bottom-14 max-w-[170px] sm:max-w-[220px] pointer-events-none"
              >
                <div className="rounded-lg border border-line-hi bg-base/80 backdrop-blur-md p-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-fg-lo">
                      FOCUS
                    </span>
                    <span className="text-[10px] font-mono text-accent-hi">
                      {FOCUS_NODE.delta}
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-sm text-fg">
                    {FOCUS_NODE.id}
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-fg-lo">
                    {FOCUS_NODE.source}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${FOCUS_NODE.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-fg-mid">
                      {FOCUS_NODE.confidence.toFixed(2)}
                    </span>
                  </div>
                </div>
                <svg
                  width="60"
                  height="30"
                  className="ml-4 -mt-px"
                  viewBox="0 0 60 30"
                  aria-hidden
                >
                  <path
                    d="M0 0 L30 15 L60 15"
                    fill="none"
                    stroke="#2b2f38"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <circle cx="60" cy="15" r="2" fill="#a9bbff" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
