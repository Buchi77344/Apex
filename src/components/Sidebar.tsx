import { useState, useEffect, useRef, type CSSProperties } from "react";

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

type SearchType = "address" | "apn";

interface RecentItem {
  label: string;
  sub: string;
  q: string;
  t: SearchType;
}

const DEFAULT_RECENT: RecentItem[] = [
  { label: "4823 Ridgeline Rd",  sub: "Flagstaff, AZ · 2.47 ac", q: "4823 Ridgeline Rd, Flagstaff, AZ",  t: "address" },
  { label: "891 Desert View Dr", sub: "Sedona, AZ · 1.12 ac",    q: "891 Desert View Dr, Sedona, AZ",    t: "address" },
  { label: "2240 Mesa Bluff Ln", sub: "Tucson, AZ · 5.03 ac",    q: "2240 Mesa Bluff Ln, Tucson, AZ",    t: "address" },
];

// ─── SVG Nav Icons ─────────────────────────────────────────────────────────────
function IconSearch({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}
function IconDeal({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
}
function IconSaved({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  );
}
function IconReports({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
      <line x1="2"  y1="20" x2="22" y2="20"/>
    </svg>
  );
}
function IconBuyer({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function IconSettings({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
function IconHelp({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}
function IconClock({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconPin({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconClose({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "search",  label: "Property Search",  active: true  },
  { id: "deal",    label: "Deal Intelligence", active: false },
  { id: "saved",   label: "Saved Properties",  active: false },
  { id: "reports", label: "Market Reports",    active: false },
  { id: "buyer",   label: "Buyer Matching",    active: false },
];

const BOTTOM_ITEMS = [
  { id: "settings", label: "Settings"   },
  { id: "help",     label: "Help & Docs" },
];

function NavIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "search":  return <IconSearch  color={color} />;
    case "deal":    return <IconDeal    color={color} />;
    case "saved":   return <IconSaved   color={color} />;
    case "reports": return <IconReports color={color} />;
    case "buyer":   return <IconBuyer   color={color} />;
    case "settings":return <IconSettings color={color} />;
    case "help":    return <IconHelp    color={color} />;
    default:        return null;
  }
}

function Sidebar({ isOpen, onClose, onSearch }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Recent searches — starts with defaults, new searches prepended
  const [recents, setRecents] = useState<RecentItem[]>(DEFAULT_RECENT);
  const [query,   setQuery]   = useState("");
  const [stype,   setStype]   = useState<SearchType>("address");

  // Close on outside click (mobile only — desktop sidebar is always visible)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (window.innerWidth >= 1024) return;
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  function handleSearch(q: string, t: "address" | "apn") {
    const trimmed = q.trim();
    if (!trimmed) return;
    // Prepend to recents, dedupe, cap at 6
    const entry = { label: trimmed, sub: t === "apn" ? `APN · ${trimmed}` : trimmed, q: trimmed, t };
    setRecents(prev => [entry, ...prev.filter(r => r.q !== trimmed)].slice(0, 6));
    onSearch(trimmed, t);
    setQuery("");
    onClose();
  }

  function removeRecent(q: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRecents(prev => prev.filter(r => r.q !== q));
  }

  return (
    <>
      <style>{`
        .lw-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:40; transition:opacity 0.25s; }
        @media (max-width:1023px) { .lw-overlay { display:block; } }
        .lw-nav-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:9px; cursor:pointer; transition:background 0.15s; margin-bottom:2px; }
        .lw-nav-item:hover { background:rgba(255,255,255,0.05); }
        .lw-recent-item { display:flex; align-items:center; gap:10px; padding:7px 8px; border-radius:9px; cursor:pointer; transition:background 0.15s; margin-bottom:2px; position:relative; }
        .lw-recent-item:hover { background:rgba(255,255,255,0.05); }
        .lw-recent-item .lw-remove { opacity:0; transition:opacity 0.15s; }
        .lw-recent-item:hover .lw-remove { opacity:1; }
        .lw-search-inner { display:flex; align-items:center; background:${C.card}; border:1px solid ${C.border}; border-radius:10px; overflow:hidden; transition:border-color 0.15s; }
        .lw-search-inner:focus-within { border-color:${C.blue}; }
        .lw-recent-scroll { overflow-y:auto; scrollbar-width:thin; scrollbar-color:${C.border} transparent; }
        .lw-recent-scroll::-webkit-scrollbar { width:3px; }
        .lw-recent-scroll::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
      `}</style>

      {/* Mobile overlay */}
      <div
        className="lw-overlay"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      />

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
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 14px 12px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Landwiz logo mark */}
            <div style={{ width: 32, height: 32, background: C.text, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", ...ffH, fontWeight: 900, fontSize: 16, color: C.bg, flexShrink: 0 }}>
              W
            </div>
            <div>
              <div style={{ ...ffH, fontWeight: 700, fontSize: 14, color: C.text, letterSpacing: "-0.2px", lineHeight: 1.2 }}>Landwiz</div>
              <div style={{ ...ff, fontSize: 10, color: C.faint, letterSpacing: "0.4px" }}>Land Deal Intelligence</div>
            </div>
          </div>
          {/* Close button — mobile only via CSS */}
          <button
            className="apex-close-btn"
            onClick={onClose}
            style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, color: C.muted, cursor: "pointer", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.muted)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <IconClose color={C.muted} />
          </button>
        </div>

        {/* ── Search input ── */}
        <div style={{ padding: "12px 12px 8px", flexShrink: 0 }}>
          <div className="lw-search-inner">
            <select
              value={stype}
              onChange={e => setStype(e.target.value as "address" | "apn")}
              style={{ border: "none", background: "transparent", borderRight: `1px solid ${C.border}`, padding: "0 8px", height: 38, fontSize: 10, fontWeight: 700, color: C.faint, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.8px", textTransform: "uppercase", cursor: "pointer", outline: "none", flexShrink: 0 }}
            >
              <option value="address">Addr</option>
              <option value="apn">APN</option>
            </select>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch(query, stype)}
              placeholder="Search address or APN…"
              style={{ flex: 1, border: "none", background: "transparent", padding: "0 10px", fontSize: 12, color: C.text, fontFamily: "'Space Grotesk', sans-serif", outline: "none", height: 38, minWidth: 0 }}
            />
            <button
              onClick={() => handleSearch(query, stype)}
              style={{ background: "none", border: "none", padding: "0 10px", cursor: "pointer", display: "flex", alignItems: "center", height: 38, flexShrink: 0 }}
            >
              <IconSearch color={query.trim() ? C.blue : C.faint} />
            </button>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div style={{ padding: "4px 10px 2px", flexShrink: 0 }}>
          <div style={{ ...ff, fontSize: 10, fontWeight: 600, color: C.faint, letterSpacing: "1.2px", textTransform: "uppercase", padding: "6px 4px 5px" }}>
            Navigation
          </div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.label}
              className="lw-nav-item"
              style={{ background: item.active ? "rgba(59,130,246,0.10)" : "transparent" }}
            >
              <div style={{ width: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <NavIcon id={item.id} color={item.active ? C.blue : C.faint} />
              </div>
              <span style={{ ...ff, fontSize: 13, color: item.active ? C.text : C.muted, fontWeight: item.active ? 500 : 400, flex: 1 }}>
                {item.label}
              </span>
              {item.active && (
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.blue, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: C.border, margin: "8px 14px", flexShrink: 0 }} />

        {/* ── Recent searches ── */}
        <div style={{ padding: "0 10px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 6px", flexShrink: 0 }}>
            <div style={{ ...ff, fontSize: 10, fontWeight: 600, color: C.faint, letterSpacing: "1.2px", textTransform: "uppercase" }}>
              Recent searches
            </div>
            {recents.length > 0 && (
              <button
                onClick={() => setRecents([])}
                style={{ background: "none", border: "none", cursor: "pointer", ...ff, fontSize: 10, color: C.faint, padding: 0, transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.muted)}
                onMouseLeave={e => (e.currentTarget.style.color = C.faint)}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="lw-recent-scroll" style={{ flex: 1, minHeight: 0 }}>
            {recents.length === 0 ? (
              <div style={{ padding: "16px 8px", textAlign: "center" }}>
                <IconClock color={C.faint} />
                <div style={{ ...ff, fontSize: 12, color: C.faint, marginTop: 6 }}>No recent searches</div>
              </div>
            ) : recents.map(item => (
              <div
                key={item.q}
                className="lw-recent-item"
                onClick={() => { onSearch(item.q, item.t); onClose(); }}
              >
                {/* Icon */}
                <div style={{ width: 28, height: 28, borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.t === "apn"
                    ? <IconPin   color={C.faint} />
                    : <IconClock color={C.faint} />
                  }
                </div>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...ff, fontSize: 12, color: C.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.label}
                  </div>
                  <div style={{ ...ff, fontSize: 11, color: C.faint, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.sub}
                  </div>
                </div>
                {/* Remove button */}
                <button
                  className="lw-remove"
                  onClick={e => removeRecent(item.q, e)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 }}
                >
                  <IconClose color={C.faint} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom ── */}
        <div style={{ padding: "8px 10px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          {BOTTOM_ITEMS.map(item => (
            <div key={item.label} className="lw-nav-item">
              <div style={{ width: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <NavIcon id={item.id} color={C.faint} />
              </div>
              <span style={{ ...ff, fontSize: 13, color: C.muted }}>{item.label}</span>
            </div>
          ))}

          <div style={{ height: 1, background: C.border, margin: "8px 2px 10px" }} />

          {/* User row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1D3A5F", display: "flex", alignItems: "center", justifyContent: "center", ...ffH, fontWeight: 700, fontSize: 11, color: C.blue, flexShrink: 0 }}>
              JD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...ff, fontSize: 12, color: C.text, fontWeight: 500 }}>John Doe</div>
              <div style={{ ...ff, fontSize: 10, color: C.faint }}>Pro plan</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconSettings color={C.faint} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;