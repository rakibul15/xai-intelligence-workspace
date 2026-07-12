import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Xai — Intelligence Workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(1000px 700px at 82% 22%, rgba(110,139,255,0.35) 0%, rgba(110,139,255,0) 60%), radial-gradient(700px 500px at 15% 85%, rgba(169,187,255,0.18) 0%, rgba(169,187,255,0) 60%), #08090b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          color: "#f5f6f8",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "#a9bbff",
              boxShadow: "0 0 24px rgba(169,187,255,0.7)",
            }}
          />
          <div
            style={{ display: "flex", fontSize: 22, letterSpacing: "-0.02em", color: "#f5f6f8" }}
          >
            Xai
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#7b8090",
              marginLeft: 12,
            }}
          >
            <div style={{ display: "flex", width: 32, height: 1, background: "#2b2f38" }} />
            <div style={{ display: "flex" }}>Intelligence Workspace</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 104,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: "#f5f6f8",
            fontFamily: "serif",
            fontWeight: 400,
            marginBottom: 16,
            maxWidth: 720,
          }}
        >
          <div style={{ display: "flex" }}>Raw data</div>
          <div style={{ display: "flex" }}>becomes decisions.</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 22,
              lineHeight: 1.4,
              color: "#c8cbd1",
              maxWidth: 640,
            }}
          >
            <div style={{ display: "flex" }}>
              A workspace for teams that ship on evidence.
            </div>
            <div style={{ display: "flex" }}>
              From ingest to insight to automation, in one continuous thought.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#7b8090",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#6ee7a7",
                boxShadow: "0 0 8px rgba(110, 231, 167, 0.7)",
              }}
            />
            <div style={{ display: "flex" }}>Live · sin1</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 520,
            height: 520,
            display: "flex",
          }}
        >
          <svg
            width="520"
            height="520"
            viewBox="0 0 520 520"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a9bbff" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#6e8bff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#6e8bff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="260" cy="260" r="260" fill="url(#glow)" />
            {Array.from({ length: 120 }).map((_, i) => {
              const phi = Math.PI * (Math.sqrt(5) - 1);
              const y = 1 - (i / 119) * 2;
              const r = Math.sqrt(1 - y * y);
              const theta = phi * i;
              const x = Math.cos(theta) * r;
              const z = Math.sin(theta) * r;
              const scale = 0.6 + (z + 1) * 0.4;
              const sz = 3.5 * scale;
              return (
                <circle
                  key={i}
                  cx={260 + x * 180}
                  cy={260 + y * 180}
                  r={sz}
                  fill="#a9bbff"
                  fillOpacity={0.5 + scale * 0.45}
                />
              );
            })}
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
