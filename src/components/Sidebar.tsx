import { useEffect, useRef, type CSSProperties } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (q: string, t: "address" | "apn") => void;
}

const C = {
  bg:      "#0A0A0C",
  surface: "#111114",
  card:    "#16161A",
  border:  "#222228",
  text:    "#F5F5F7",
  muted:   "#B0B0C0",
  faint:   "#7A7A8A",
  blue:    "#3B82F6",
  green:   "#22C55E",
};

const ffH: CSSProperties = { fontFamily: "'Outfit', sans-serif" };
const ff:  CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };

const RECENT_SEARCHES = [
  { label: "4823 Ridgeline Rd",  sub: "Flagstaff, AZ · 2.47 ac", q: "4823 Ridgeline Rd, Flagstaff, AZ",  t: "address" as const },
  { label: "891 Desert View Dr", sub: "Sedona, AZ · 1.12 ac",    q: "891 Desert View Dr, Sedona, AZ",    t: "address" as const },
  { label: "2240 Mesa Bluff Ln", sub: "Tucson, AZ · 5.03 ac",    q: "2240 Mesa Bluff Ln, Tucson, AZ",    t: "address" as const },
];

const NAV_ITEMS = [
  { icon: "⊡", label: "Property Search",   active: true  },
  { icon: "◈", label: "Deal Intelligence",  active: false },
  { icon: "◉", label: "Saved Properties",   active: false },
  { icon: "⬡", label: "Market Reports",     active: false },
  { icon: "△", label: "Buyer Matching",     active: false },
];

const BOTTOM_ITEMS = [
  { icon: "◎", label: "Settings"  },
  { icon: "○", label: "Help & Docs" },
];

function Sidebar({ isOpen, onClose, onSearch }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className="apex-overlay"
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          zIndex: 40, opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s",
          display: "none",
        }}
      />

      <style>{`
        @media (max-width: 1023px) { .apex-overlay { display: block !important; } }
        @media (min-width: 1024px) {
          .apex-sidebar { transform: translateX(0) !important; position: relative !important; }
          .apex-close-btn { display: none !important; }
          .apex-hamburger { display: none !important; }
          .apex-main-wrap { margin-left: 0 !important; }
        }
        @media (max-width: 1023px) {
          .apex-sidebar { position: fixed !important; }
        }
        .apex-nav-item { transition: background 0.15s; cursor: pointer; border-radius: 8px; }
        .apex-nav-item:hover { background: rgba(255,255,255,0.05) !important; }
        .apex-recent-scroll { scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
        .apex-recent-scroll::-webkit-scrollbar { width: 3px; }
        .apex-recent-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        @keyframes apex-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.96)} }
      `}</style>

      <div
        ref={sidebarRef}
        className="apex-sidebar"
        style={{
          top: 0, left: 0, height: "100vh", width: 260,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          zIndex: 50, flexShrink: 0,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: C.text, borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              ...ffH, fontWeight: 900, fontSize: 16, color: C.bg,
            }}>A</div>
            <div>
              <div style={{ ...ffH, fontWeight: 700, fontSize: 14, color: C.text, letterSpacing: "-0.2px" }}>Apex</div>
              <div style={{ ...ff, fontSize: 10, color: C.faint, letterSpacing: "0.5px" }}>Intelligence</div>
            </div>
          </div>
          <button
            className="apex-close-btn"
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, padding: 4, lineHeight: 1, display: "flex", alignItems: "center" }}
          >✕</button>
        </div>

        <div style={{ padding: "12px 12px 6px", flexShrink: 0 }}>
          <button
            onClick={() => { onSearch("", "address"); onClose(); }}
            style={{
              width: "100%", padding: "9px 12px", background: C.card,
              border: `1px solid ${C.border}`, borderRadius: 10,
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.blue)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <span style={{ ...ff, fontSize: 13, color: C.muted }}>New search…</span>
          </button>
        </div>

        <div style={{ padding: "4px 10px 2px", flexShrink: 0 }}>
          <div style={{ ...ff, fontSize: 10, fontWeight: 600, color: C.faint, letterSpacing: "1.2px", textTransform: "uppercase", padding: "8px 6px 5px" }}>
            Navigation
          </div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className="apex-nav-item"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", marginBottom: 2,
                background: item.active ? "rgba(59,130,246,0.10)" : "transparent",
              }}
            >
              <span style={{ fontSize: 13, color: item.active ? C.blue : C.faint, width: 18, textAlign: "center", flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{ ...ff, fontSize: 13, color: item.active ? C.text : C.muted, fontWeight: item.active ? 500 : 400, flex: 1 }}>
                {item.label}
              </span>
              {item.active && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: C.border, margin: "8px 14px", flexShrink: 0 }} />

        <div style={{ padding: "0 10px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ ...ff, fontSize: 10, fontWeight: 600, color: C.faint, letterSpacing: "1.2px", textTransform: "uppercase", padding: "6px 6px 5px", flexShrink: 0 }}>
            Recent searches
          </div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }} className="apex-recent-scroll">
            {RECENT_SEARCHES.map(item => (
              <div
                key={item.label}
                className="apex-nav-item"
                onClick={() => { onSearch(item.q, item.t); onClose(); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 2 }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: C.card,
                  border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...ff, fontSize: 12, color: C.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.label}
                  </div>
                  <div style={{ ...ff, fontSize: 11, color: C.faint, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "-1px 10px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          {BOTTOM_ITEMS.map(item => (
            <div
              key={item.label}
              className="apex-nav-item"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 2 }}
            >
              <span style={{ fontSize: 13, color: C.faint, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ ...ff, fontSize: 13, color: C.muted }}>{item.label}</span>
            </div>
          ))}

          <div style={{ height: 1, background: C.border, margin: "8px 2px 10px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", background: "#1D3A5F",
              display: "flex", alignItems: "center", justifyContent: "center",
              ...ffH, fontWeight: 700, fontSize: 11, color: C.blue, flexShrink: 0,
            }}>JD</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...ff, fontSize: 12, color: C.text, fontWeight: 500 }}>John Doe</div>
              <div style={{ ...ff, fontSize: 10, color: C.faint }}>Pro plan</div>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
