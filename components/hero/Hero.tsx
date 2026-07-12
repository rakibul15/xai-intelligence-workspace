"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { ParticleField } from "./ParticleField";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: 0.1 + i * 0.09,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 -z-0">
        <ParticleField containerRef={ref} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--color-base) 0%, rgba(8,9,11,0.85) 32%, rgba(8,9,11,0.35) 62%, rgba(8,9,11,0) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,9,11,0) 60%, rgba(8,9,11,0.9) 100%)",
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="max-w-2xl">
          <motion.div initial="hidden" animate="show" custom={0} variants={fade}>
            <SectionLabel index="01" label="Intelligence Workspace" />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fade}
            aria-label="Raw data becomes decisions."
            className="mt-8 font-display text-[clamp(3.25rem,8vw,6.5rem)] leading-[0.95] text-fg"
          >
            <span aria-hidden>
              Raw data
              <br />
              becomes decisions.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fade}
            className="mt-8 text-lg md:text-xl text-fg-mid max-w-xl leading-relaxed"
          >
            Xai transforms unstructured inputs into structured intelligence,
            then into automations that ship without you.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fade}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button variant="primary">Request early access</Button>
            <Button variant="secondary">Watch the system</Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            custom={4}
            variants={fade}
            className="mt-16 inline-flex items-center gap-2 text-xs font-mono text-fg-lo border border-line rounded-full py-1.5 px-3 bg-elevated/40 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-70" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            Currently indexing 2.4M events / sec
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 mono-label flex items-center gap-2"
      >
        <span>Scroll</span>
        <motion.svg
          width="10"
          height="20"
          viewBox="0 0 10 20"
          fill="none"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M5 2 L5 16 M1 12 L5 16 L9 12"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
