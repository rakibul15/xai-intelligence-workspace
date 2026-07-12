"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  id: string;
  label: string;
  category: string;
  hint?: string;
}

const COMMANDS: Command[] = [
  { id: "signals", label: "View recent signals", category: "Workspace", hint: "S" },
  { id: "atlas", label: "Open Atlas workspace", category: "Workspace", hint: "W" },
  { id: "ingest", label: "Add ingest source", category: "Pipeline", hint: "I" },
  { id: "automation", label: "Create automation from selection", category: "Pipeline", hint: "A" },
  { id: "query", label: "Query with natural language", category: "Assist", hint: "Q" },
  { id: "reshape", label: "Reshape the cluster", category: "Assist", hint: "R" },
  { id: "docs", label: "Open documentation", category: "Support" },
  { id: "changelog", label: "Read the changelog", category: "Support" },
  { id: "keyboard", label: "Show keyboard shortcuts", category: "Support", hint: "?" },
];

const CategoryIcon = ({ category }: { category: string }) => {
  const paths: Record<string, string> = {
    Workspace: "M3 3h10v10H3z",
    Pipeline: "M2 8h12M2 4h12M2 12h12",
    Assist: "M8 2 L14 8 L8 14 L2 8 Z",
    Support: "M8 3 v10 M3 8 h10",
  };
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[category] ?? paths.Support} />
    </svg>
  );
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered.length]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const grouped = useMemo(() => {
    const byCat: Record<string, Command[]> = {};
    filtered.forEach((c) => {
      byCat[c.category] = byCat[c.category] || [];
      byCat[c.category].push(c);
    });
    return byCat;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[200] bg-base/70 backdrop-blur-md flex items-start justify-center pt-[16vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[560px] bg-elevated border border-line-hi rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b border-line">
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="text-fg-lo"
                aria-hidden
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 L14 14" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or ask Xai…"
                className="flex-1 bg-transparent outline-none text-[15px] text-fg placeholder:text-fg-lo font-normal"
              />
              <span className="text-[10px] font-mono text-fg-mute border border-line rounded px-1.5 py-0.5">
                ESC
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-fg-lo">
                  Nothing matches “{query}”. Try “automation” or “signals”.
                </div>
              )}
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="px-2">
                  <div className="px-3 pt-2 pb-1 mono-label text-fg-mute">
                    {cat}
                  </div>
                  {items.map((c) => {
                    const idx = filtered.indexOf(c);
                    const isSel = idx === selected;
                    return (
                      <button
                        key={c.id}
                        onMouseEnter={() => setSelected(idx)}
                        onClick={() => setOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors duration-100 ${
                          isSel ? "bg-surface" : "hover:bg-surface/60"
                        }`}
                      >
                        <span
                          className={`shrink-0 ${
                            isSel ? "text-accent-hi" : "text-fg-lo"
                          }`}
                        >
                          <CategoryIcon category={c.category} />
                        </span>
                        <span
                          className={`flex-1 text-sm ${
                            isSel ? "text-fg" : "text-fg-mid"
                          }`}
                        >
                          {c.label}
                        </span>
                        {c.hint && (
                          <span
                            className={`text-[10px] font-mono border rounded px-1.5 py-0.5 ${
                              isSel
                                ? "border-line-hi text-fg-mid"
                                : "border-line text-fg-mute"
                            }`}
                          >
                            {c.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 h-10 border-t border-line text-[11px] font-mono text-fg-lo">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="border border-line rounded px-1 py-0.5 text-fg-mute">↑↓</span>
                  navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="border border-line rounded px-1 py-0.5 text-fg-mute">↵</span>
                  select
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent-glow)]" />
                Xai · Atlas
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
