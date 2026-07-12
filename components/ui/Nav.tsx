"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

const links = [
  { label: "Product", href: "#hero" },
  { label: "Pipeline", href: "#flow" },
  { label: "Workspace", href: "#dashboard" },
  { label: "Signature", href: "#signature" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] border-b",
        scrolled || menuOpen
          ? "backdrop-blur-xl bg-base/85 border-line"
          : "bg-base/80 backdrop-blur-md border-line/40 md:bg-transparent md:backdrop-blur-none md:border-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#hero" className="text-fg" onClick={closeMenu}>
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-fg-mid hover:text-fg hover:bg-surface transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const evt = new KeyboardEvent("keydown", { key: "k", metaKey: true });
              window.dispatchEvent(evt);
            }}
            aria-label="Command palette ⌘K"
            className="hidden md:inline-flex items-center gap-2 h-9 px-2.5 rounded-md border border-line hover:border-line-hi text-fg-lo hover:text-fg-mid text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5 L14 14" />
            </svg>
            <span className="font-mono">⌘K</span>
          </button>
          <Button variant="ghost" className="hidden lg:inline-flex">
            Sign in
          </Button>
          <Button variant="primary" className="hidden sm:inline-flex">
            Request access
          </Button>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 -mr-2 rounded-md text-fg hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <div className="relative w-5 h-5">
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-5 bg-current transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)]",
                  menuOpen && "translate-y-1.5 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-px w-5 bg-current transition-opacity duration-200",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[18px] h-px w-5 bg-current transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)]",
                  menuOpen && "-translate-y-1.5 -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed left-0 right-0 top-16 h-[calc(100vh-4rem)] bg-base overflow-y-auto"
          >
            <Container className="pt-6 pb-10 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-between py-4 border-b border-line text-fg text-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span>{l.label}</span>
                  <span className="mono-label text-fg-mute">
                    0{links.indexOf(l) + 1}
                  </span>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-8 flex flex-col gap-3"
              >
                <Button
                  variant="primary"
                  className="w-full h-12"
                  onClick={closeMenu}
                >
                  Request access
                </Button>
                <Button
                  variant="secondary"
                  className="w-full h-12"
                  onClick={closeMenu}
                >
                  Sign in
                </Button>
              </motion.div>
              <div className="mt-10 text-[11px] font-mono text-fg-mute">
                Xai — Intelligence Workspace · sin1
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
