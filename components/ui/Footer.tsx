import { Container } from "./Container";
import { Logo } from "./Logo";

const cols = [
  {
    heading: "Product",
    items: ["Overview", "Pipeline", "Workspace", "Automations", "Changelog"],
  },
  {
    heading: "System",
    items: ["Status", "Security", "Latency", "Model registry"],
  },
  {
    heading: "Company",
    items: ["About", "Careers", "Press", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-16">
          <div className="col-span-2 space-y-4">
            <Logo />
            <p className="text-fg-lo text-sm max-w-xs leading-relaxed">
              An intelligence workspace for teams that ship on evidence.
              Built in Singapore.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.heading} className="space-y-3">
              <div className="mono-label">{c.heading}</div>
              <ul className="space-y-2">
                {c.items.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-fg-mid hover:text-fg transition-colors"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-fg-lo">
          <div>© 2026 Xai Labs. All rights reserved.</div>
          <div className="font-mono flex items-center gap-4">
            <span>Build 0.9.4</span>
            <span className="text-fg-mute">·</span>
            <span>Updated 12 Jul 2026</span>
            <span className="text-fg-mute">·</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              sin1
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
