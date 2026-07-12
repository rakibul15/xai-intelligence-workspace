export const IconOverview = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

export const IconStreams = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <path d="M2 4h12M2 8h12M2 12h12" />
  </svg>
);

export const IconSignals = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <path d="M2 12 L5 8 L8 10 L11 4 L14 8" />
    <circle cx="11" cy="4" r="1.4" fill="currentColor" />
  </svg>
);

export const IconAutomations = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="8" r="5" />
    <path d="M8 4v4l2.5 1.5" />
  </svg>
);

export const IconReports = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <rect x="3" y="2" width="10" height="12" rx="1.5" />
    <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" />
  </svg>
);

export const IconSettings = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden>
    <circle cx="8" cy="8" r="2" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" strokeLinecap="round" />
  </svg>
);

export const IconSearch = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 L14 14" />
  </svg>
);

export const IconBell = (p: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={p.className} fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <path d="M4 7a4 4 0 1 1 8 0v3l1 2H3l1-2V7Z" />
    <path d="M6.5 13a1.5 1.5 0 0 0 3 0" />
  </svg>
);

export const IconArrowUp = (p: { className?: string }) => (
  <svg viewBox="0 0 12 12" className={p.className} fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <path d="M6 10 V2 M3 5 L6 2 L9 5" />
  </svg>
);

export const IconArrowDown = (p: { className?: string }) => (
  <svg viewBox="0 0 12 12" className={p.className} fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" aria-hidden>
    <path d="M6 2 V10 M3 7 L6 10 L9 7" />
  </svg>
);
