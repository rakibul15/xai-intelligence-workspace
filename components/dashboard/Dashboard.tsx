"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useInView } from "@/lib/useInView";

const SignalChart = dynamic(
  () => import("./SignalChart").then((m) => m.SignalChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] flex items-center justify-center">
        <div className="mono-label text-fg-mute">Loading chart…</div>
      </div>
    ),
  }
);
import {
  IconOverview,
  IconStreams,
  IconSignals,
  IconAutomations,
  IconReports,
  IconSettings,
  IconSearch,
  IconBell,
  IconArrowUp,
  IconArrowDown,
} from "./icons";

const sidebar = [
  { label: "Overview", icon: IconOverview },
  { label: "Streams", icon: IconStreams },
  { label: "Signals", icon: IconSignals, active: true },
  { label: "Automations", icon: IconAutomations },
  { label: "Reports", icon: IconReports },
];

const stats = [
  { label: "Events processed", value: "12.4M", delta: "+8.2%", up: true },
  { label: "Anomalies flagged", value: "483", delta: "-4.1%", up: false },
  { label: "Automations run", value: "127", delta: "+12.0%", up: true },
  { label: "Active streams", value: "34", delta: "—", up: null },
];

const alerts = [
  { source: "warehouse.orders", type: "spike", time: "2m", confidence: 0.94 },
  { source: "api.checkout", type: "latency", time: "6m", confidence: 0.87 },
  { source: "events.signup", type: "pattern", time: "18m", confidence: 0.79 },
  { source: "logs.auth", type: "anomaly", time: "42m", confidence: 0.71 },
];

const tabs = [
  { label: "All", count: 24 },
  { label: "High confidence", count: 11 },
  { label: "Needs review", count: 13 },
];

const rows = [
  { signal: "Checkout drop-off spike", source: "web.checkout", conf: 0.94, time: "12:41", status: "New" },
  { signal: "Refund rate deviation", source: "warehouse.orders", conf: 0.88, time: "12:03", status: "Routed" },
  { signal: "Login latency P95", source: "api.auth", conf: 0.82, time: "11:24", status: "Automated" },
  { signal: "Referral cluster forming", source: "events.signup", conf: 0.79, time: "10:58", status: "New" },
  { signal: "Model drift on segment C", source: "ml.registry", conf: 0.71, time: "09:12", status: "Review" },
];

const statusStyle: Record<string, string> = {
  New: "text-accent-hi bg-accent/10 border-accent/30",
  Routed: "text-fg-mid bg-surface border-line-hi",
  Automated: "text-success bg-success/10 border-success/30",
  Review: "text-warning bg-warning/10 border-warning/30",
};

const containerFade = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Dashboard() {
  const [tab, setTab] = useState(tabs[0].label);
  const sectionRef = useRef<HTMLElement>(null);
  const chartReady = useInView(sectionRef, "400px");

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="py-32 md:py-40 bg-elevated/40 border-y border-line"
    >
      <Container>
        <SectionLabel index="03" label="The Workspace" />
        <h2 className="mt-6 font-display text-5xl md:text-6xl text-fg max-w-3xl leading-[1.05]">
          A calm interface
          <br />
          for loud data.
        </h2>
        <p className="mt-6 text-lg text-fg-mid max-w-xl leading-relaxed">
          The workspace where signals become decisions. Restrained by design,
          so what matters can be seen.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerFade}
          className="mt-16 rounded-2xl border border-line bg-base overflow-hidden shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center gap-2 px-4 h-10 border-b border-line bg-elevated/60">
            <span className="h-3 w-3 rounded-full bg-line-hi" />
            <span className="h-3 w-3 rounded-full bg-line-hi" />
            <span className="h-3 w-3 rounded-full bg-line-hi" />
            <div className="ml-4 flex-1 flex justify-center">
              <div className="text-[10px] sm:text-xs font-mono text-fg-lo bg-surface border border-line-hi rounded-md px-2 sm:px-3 py-1 truncate max-w-full">
                xai.app/workspace/atlas/signals
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[560px]">
            <aside className="border-b md:border-b-0 md:border-r border-line bg-elevated/40 p-4 flex flex-col">
              <div className="flex items-center gap-2 px-2 py-1.5 mb-6">
                <div className="h-6 w-6 rounded-md bg-accent/30 border border-accent/50 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-accent-hi" />
                </div>
                <div>
                  <div className="text-sm text-fg font-medium">Atlas</div>
                  <div className="text-[10px] font-mono text-fg-lo">team workspace</div>
                </div>
              </div>

              <nav className="flex flex-col gap-0.5">
                {sidebar.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;
                  return (
                    <button
                      key={item.label}
                      className={`group relative flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                        isActive
                          ? "bg-surface text-fg"
                          : "text-fg-lo hover:text-fg hover:bg-surface/60"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-accent shadow-[0_0_6px_var(--color-accent-glow)]" />
                      )}
                      <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-accent-hi" : "group-hover:text-fg-mid"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-line">
                <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-fg-lo hover:text-fg w-full">
                  <IconSettings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <div className="mt-3 flex items-center gap-2 px-2 py-1.5">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent to-accent-hi" />
                  <div className="text-xs text-fg-mid">Rakib H.</div>
                </div>
              </div>
            </aside>

            <div className="flex flex-col">
              <div className="flex items-center justify-between h-14 px-6 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="mono-label text-fg-lo">Signals</span>
                  <span className="text-fg-mute">/</span>
                  <span className="text-sm text-fg-mid">Live</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-surface border border-line rounded-md px-2.5 py-1 text-xs text-fg-lo">
                    <IconSearch className="h-3 w-3" />
                    <span>Search</span>
                    <span className="ml-6 text-fg-mute font-mono">⌘K</span>
                  </div>
                  <button
                    aria-label="Notifications"
                    className="p-1.5 rounded-md text-fg-lo hover:text-fg hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <IconBell className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <motion.div variants={itemFade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      tabIndex={0}
                      className="group rounded-lg border border-line bg-elevated/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] hover:border-line-hi hover:bg-elevated hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-15px_rgba(110,139,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base cursor-pointer"
                    >
                      <div className="mono-label text-fg-lo group-hover:text-fg-mid transition-colors">{s.label}</div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <div className="font-display text-3xl text-fg">{s.value}</div>
                        {s.up !== null && (
                          <div
                            className={`flex items-center gap-1 text-xs font-mono ${
                              s.up ? "text-success" : "text-warning"
                            }`}
                          >
                            {s.up ? (
                              <IconArrowUp className="h-2.5 w-2.5" />
                            ) : (
                              <IconArrowDown className="h-2.5 w-2.5" />
                            )}
                            {s.delta}
                          </div>
                        )}
                        {s.up === null && (
                          <div className="text-xs font-mono text-fg-mute">{s.delta}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={itemFade} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
                  <div className="rounded-lg border border-line bg-elevated/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="mono-label text-fg-lo">Signal density</div>
                        <div className="text-sm text-fg mt-1">Last 7 days</div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono">
                        {["24h", "7d", "30d"].map((r, i) => (
                          <button
                            key={r}
                            className={`px-2 py-1 rounded ${
                              i === 1
                                ? "bg-surface border border-line-hi text-fg"
                                : "text-fg-lo hover:text-fg"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    {chartReady ? (
                      <SignalChart />
                    ) : (
                      <div className="h-[220px] flex items-center justify-center">
                        <div className="mono-label text-fg-mute">Awaiting stream…</div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-line bg-elevated/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="mono-label text-fg-lo">Recent alerts</div>
                      <span className="text-[10px] font-mono text-accent-hi">live</span>
                    </div>
                    <div className="space-y-0.5">
                      {alerts.map((a, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 group -mx-2 px-2 py-1.5 rounded-md hover:bg-surface/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent text-left"
                        >
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            {i === 0 && (
                              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
                            )}
                            <span className="relative rounded-full h-1.5 w-1.5 bg-accent shadow-[0_0_6px_var(--color-accent-glow)]" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] text-fg truncate">{a.source}</div>
                            <div className="text-[10px] font-mono text-fg-lo capitalize">
                              {a.type} · {a.confidence.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-[10px] font-mono text-fg-mute shrink-0 group-hover:text-fg-lo transition-colors">
                            {a.time}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemFade} className="rounded-lg border border-line bg-elevated/60 overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-line">
                    <div className="flex items-center gap-1 bg-surface/60 border border-line rounded-lg p-0.5">
                      {tabs.map((t) => {
                        const isActive = t.label === tab;
                        return (
                          <button
                            key={t.label}
                            onClick={() => setTab(t.label)}
                            className="relative px-3 py-1 text-xs rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated"
                          >
                            {isActive && (
                              <motion.div
                                layoutId="tab-pill"
                                className="absolute inset-0 bg-elevated border border-line-hi rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                              />
                            )}
                            <span className={`relative ${isActive ? "text-fg" : "text-fg-lo"}`}>
                              {t.label}
                              <span className={`ml-1.5 font-mono ${isActive ? "text-accent-hi" : "text-fg-mute"}`}>
                                {t.count}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[10px] font-mono text-fg-lo">
                      Sorted by confidence
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[560px]">
                      <thead>
                        <tr className="text-[10px] font-mono uppercase tracking-wider text-fg-lo border-b border-line">
                          <th className="py-2 pl-4 font-normal">Signal</th>
                          <th className="py-2 font-normal hidden sm:table-cell">Source</th>
                          <th className="py-2 font-normal">Confidence</th>
                          <th className="py-2 font-normal hidden md:table-cell">Detected</th>
                          <th className="py-2 pr-4 font-normal text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr
                            key={i}
                            className="border-b border-line last:border-0 hover:bg-surface/40 transition-colors group cursor-pointer"
                          >
                            <td className="py-3 pl-4 text-fg">{r.signal}</td>
                            <td className="py-3 font-mono text-xs text-fg-lo hidden sm:table-cell">{r.source}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-12 sm:w-16 bg-line rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-accent"
                                    style={{ width: `${r.conf * 100}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs text-fg-mid">
                                  {r.conf.toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-xs text-fg-lo hidden md:table-cell">{r.time}</td>
                            <td className="py-3 pr-4 text-right">
                              <span
                                className={`inline-flex items-center h-6 px-2 rounded text-[10px] font-mono border ${
                                  statusStyle[r.status]
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
