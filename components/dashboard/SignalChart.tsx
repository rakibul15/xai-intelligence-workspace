"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", signals: 4200, anomalies: 12 },
  { day: "Tue", signals: 5800, anomalies: 24 },
  { day: "Wed", signals: 5100, anomalies: 18 },
  { day: "Thu", signals: 7800, anomalies: 41 },
  { day: "Fri", signals: 6900, anomalies: 33 },
  { day: "Sat", signals: 4300, anomalies: 15 },
  { day: "Sun", signals: 5200, anomalies: 21 },
];

interface TipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-line-hi bg-elevated/90 backdrop-blur-md px-3 py-2 shadow-xl text-xs">
      <div className="mono-label text-fg-lo mb-1">{label}</div>
      <div className="flex items-center gap-2 text-fg">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="font-mono">{p.value.toLocaleString()}</span>
        <span className="text-fg-lo">signals</span>
      </div>
    </div>
  );
}

export function SignalChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="signalArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6e8bff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6e8bff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1f2229" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="day"
          stroke="#4a4e58"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
        />
        <YAxis
          stroke="#4a4e58"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2b2f38", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="signals"
          stroke="#a9bbff"
          strokeWidth={1.5}
          fill="url(#signalArea)"
          animationDuration={1400}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
