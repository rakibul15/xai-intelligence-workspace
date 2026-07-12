"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  IngestGeometry,
  AnalyzeGeometry,
  InsightGeometry,
} from "./FlowGeometry";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  {
    number: "STAGE 01",
    title: "Ingest",
    body: "Streams from anywhere. Logs, events, warehouses, spreadsheets, PDFs. Xai reads them as they arrive.",
    stat: "~40ms per event",
    footnote: "342 connectors · zero-config schema inference",
  },
  {
    number: "STAGE 02",
    title: "Analyze",
    body: "Every event is embedded, clustered, and cross-referenced against your history. Patterns surface without a query.",
    stat: "128-dim embeddings",
    footnote: "6 model families in ensemble · sub-second retrieval",
  },
  {
    number: "STAGE 03",
    title: "Insight",
    body: "The pattern arrives as a decision, not a chart. Approve it, route it, or let Xai run the automation.",
    stat: "94% surface rate",
    footnote: "Every insight is auditable · every action reversible",
  },
];

export function InsightFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const ingestStageRef = useRef<SVGGElement | null>(null);
  const analyzeStageRef = useRef<SVGGElement | null>(null);
  const insightStageRef = useRef<SVGGElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const ingest = ingestStageRef.current;
      const analyze = analyzeStageRef.current;
      const insight = insightStageRef.current;
      if (!ingest || !analyze || !insight) return;

      const streamDots = ingest.querySelectorAll<SVGCircleElement>(".stream-dot");
      const streamLines = ingest.querySelectorAll<SVGLineElement>(".stream-line");
      const core = ingest.querySelector<SVGCircleElement>(".core");
      const coreGlow = ingest.querySelector<SVGCircleElement>(".core-glow");
      const nodes = analyze.querySelectorAll<SVGGElement>(".node");
      const edges = analyze.querySelectorAll<SVGLineElement>(".edge");
      const bars = insight.querySelectorAll<SVGRectElement>(".bar-rect");
      const callout = insight.querySelector<SVGGElement>(".callout");
      const automationBadge = insight.querySelector<SVGGElement>(".automation-badge");
      const automationArrow = insight.querySelector<SVGPathElement>(".automation-arrow");

      gsap.set(streamDots, { scale: 0, transformOrigin: "center" });
      gsap.set(streamLines, { opacity: 0 });
      gsap.set(core, { scale: 0.4, transformOrigin: "center" });
      gsap.set(coreGlow, { scale: 0.2, opacity: 0, transformOrigin: "center" });
      gsap.set(nodes, { scale: 0, transformOrigin: "center" });
      gsap.set(edges, { opacity: 0 });
      gsap.set(bars, { scaleY: 0, transformOrigin: "center bottom" });
      gsap.set(callout, { opacity: 0, y: 12 });
      gsap.set(automationBadge, { opacity: 0, y: 12 });
      gsap.set(automationArrow, { opacity: 0 });
      gsap.set(analyze, { opacity: 0 });
      gsap.set(insight, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const next = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
            setActive((prev) => (prev === next ? prev : next));
          },
        },
      });

      tl.to(streamLines, { opacity: 0.7, duration: 0.15 }, 0)
        .to(streamDots, { scale: 1, duration: 0.2, stagger: 0.015 }, 0.02)
        .to(
          streamDots,
          { attr: { cx: 0, cy: 0 }, duration: 0.55, stagger: 0.02, ease: "power2.in" },
          0.12
        )
        .to(core, { scale: 1.6, duration: 0.35, ease: "power2.out" }, 0.28)
        .to(coreGlow, { scale: 1, opacity: 1, duration: 0.4 }, 0.28)

        .to(ingest, { opacity: 0, duration: 0.15 }, 0.36)
        .to(analyze, { opacity: 1, duration: 0.15 }, 0.36)
        .to(nodes, { scale: 1, duration: 0.35, stagger: 0.02, ease: "back.out(1.4)" }, 0.42)
        .to(edges, { opacity: 1, duration: 0.35, stagger: 0.006 }, 0.5)
        .to(analyze, { rotation: 12, transformOrigin: "center", duration: 0.35 }, 0.55)

        .to(analyze, { opacity: 0, scale: 0.92, duration: 0.15 }, 0.68)
        .to(insight, { opacity: 1, duration: 0.15 }, 0.7)
        .to(bars, { scaleY: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" }, 0.74)
        .to(callout, { opacity: 1, y: 0, duration: 0.3 }, 0.88)
        .to(automationArrow, { opacity: 1, duration: 0.2 }, 0.94)
        .to(automationBadge, { opacity: 1, y: 0, duration: 0.3 }, 0.96);

      const refreshId = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(refreshId);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flow"
      className="relative bg-base"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-base">
        <Container>
          <div className="mb-8 md:mb-14">
            <SectionLabel index="02" label="The Pipeline" />
            <h2
              aria-label="Three stages. One continuous thought."
              className="mt-4 md:mt-6 font-display text-4xl sm:text-5xl md:text-6xl text-fg max-w-3xl leading-[1.05]"
            >
              <span aria-hidden>
                Three stages.
                <br />
                One continuous thought.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
            <div className="min-h-[220px] md:min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3 md:space-y-5"
                >
                  <div className="mono-label text-accent-hi">
                    {STAGES[active].number}
                  </div>
                  <h3 className="font-display text-4xl md:text-6xl text-fg leading-none">
                    {STAGES[active].title}
                  </h3>
                  <p className="text-base md:text-lg text-fg-mid max-w-md leading-relaxed">
                    {STAGES[active].body}
                  </p>
                  <div className="pt-2">
                    <span className="font-mono text-sm text-accent-hi">
                      {STAGES[active].stat}
                    </span>
                  </div>
                  <div className="text-xs text-fg-lo font-mono border-t border-line pt-4 max-w-sm">
                    {STAGES[active].footnote}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex gap-3 items-center" role="tablist" aria-label="Pipeline stages">
                {STAGES.map((s, i) => (
                  <div
                    key={i}
                    role="tab"
                    aria-selected={i === active}
                    className="relative group cursor-default"
                  >
                    <div
                      className={`h-0.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                        i === active
                          ? "bg-accent w-14 shadow-[0_0_10px_var(--color-accent-glow)]"
                          : "bg-line w-8 group-hover:bg-fg-lo group-hover:w-10"
                      }`}
                    />
                    <span className="pointer-events-none absolute top-3 left-0 text-[11px] font-mono uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-fg-mid">
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-square max-w-[280px] sm:max-w-[380px] md:max-w-[520px] w-full mx-auto">
              <div className="absolute inset-0 rounded-2xl border border-line bg-elevated/40 backdrop-blur-sm" />
              <IngestGeometry
                stageRef={(el) => {
                  ingestStageRef.current = el;
                }}
              />
              <AnalyzeGeometry
                stageRef={(el) => {
                  analyzeStageRef.current = el;
                }}
              />
              <InsightGeometry
                stageRef={(el) => {
                  insightStageRef.current = el;
                }}
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
