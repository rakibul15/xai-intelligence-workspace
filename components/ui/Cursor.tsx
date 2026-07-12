"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -200, y: -200 });
  const currentRef = useRef({ x: -200, y: -200 });
  const stateRef = useRef({ hovering: false, pressed: false, active: false });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      stateRef.current.active = true;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'button, a, [role="button"], input, textarea, select, [data-hover-target]'
      );
      const nextHover = Boolean(interactive);
      if (nextHover !== stateRef.current.hovering) {
        stateRef.current.hovering = nextHover;
        if (ringRef.current) {
          ringRef.current.dataset.hover = nextHover ? "true" : "false";
        }
        if (dotRef.current) {
          dotRef.current.dataset.hover = nextHover ? "true" : "false";
        }
      }
    };

    const onLeave = () => {
      stateRef.current.active = false;
    };
    const onEnter = () => {
      stateRef.current.active = true;
    };
    const onDown = () => {
      stateRef.current.pressed = true;
      if (ringRef.current) ringRef.current.dataset.pressed = "true";
    };
    const onUp = () => {
      stateRef.current.pressed = false;
      if (ringRef.current) ringRef.current.dataset.pressed = "false";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const loop = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      c.x += (t.x - c.x) * 0.22;
      c.y += (t.y - c.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={auraRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9997]"
        style={{
          width: 90,
          height: 90,
          marginLeft: -45,
          marginTop: -45,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(169,187,255,0.28) 0%, rgba(110,139,255,0.05) 55%, rgba(110,139,255,0) 100%)",
          transform: "translate3d(-200px,-200px,0)",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        data-hover="false"
        data-pressed="false"
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] cursor-ring"
        style={{
          transform: "translate3d(-200px,-200px,0)",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        data-hover="false"
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] cursor-dot"
        style={{
          transform: "translate3d(-200px,-200px,0)",
          willChange: "transform",
        }}
      />
    </>
  );
}
