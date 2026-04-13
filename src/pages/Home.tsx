import { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type TagColor = "green" | "blue" | "amber" | "red" | "gray";

interface HighlightTile {
  icon: string;
  key: string;
  value: string;
  sub: string;
  badge?: string;
  badgeColor?: TagColor;
}

interface Property {
  address: string;
  apn: string;
  county: string;
  state: string;
  acres: string;
  zoning: string;
  landUse: string;
  parcelClass: string;
  owner: string;
  mailCity: string;
  mailState: string;
  marketValue: string;
  assessedValue: string;
  lastSaleDate: string;
  lastSalePrice: string;
  gps: string;
  legal: string;
  topo: string;
  road: string;
  util: { elec: string; water: string; sewer: string; gas: string; net: string };
  chips: { label: string; color: "gray" | "blue" }[];
  tiles: HighlightTile[];
}

type AppState = "idle" | "loading" | "result" | "notfound";

// ─── Demo data ─────────────────────────────────────────────────────────────────
const PROPERTIES: Record<string, Property> = {
  "4823 ridgeline": {
    address: "4823 Ridgeline Rd, Flagstaff, AZ 86001",
    apn: "107-42-003C", county: "Coconino", state: "Arizona", acres: "2.47",
    zoning: "R1-18", landUse: "Vacant Residential", parcelClass: "Vacant Land",
    owner: "Hargrove Land Trust LLC", mailCity: "Scottsdale", mailState: "AZ",
    marketValue: "$148,000", assessedValue: "$112,400",
    lastSaleDate: "Mar 14, 2021", lastSalePrice: "$89,500",
    gps: "35.1983° N, 111.6513° W",
    legal: "S12 T21N R7E Coconino Subd Blk 4 Lot 3C",
    topo: "Gently sloped", road: "Paved — county maintained",
    util: { elec: "Not connected — line 0.4mi", water: "No public water — well needed", sewer: "Septic required", gas: "Not available", net: "Starlink viable" },
    chips: [{ label: "Coconino Co.", color: "gray" }, { label: "APN 107-42-003C", color: "gray" }, { label: "Vacant Residential", color: "blue" }],
    tiles: [
      { icon: "◻", key: "Lot size",    value: "2.47 ac",      sub: "Acres total" },
      { icon: "⬡", key: "Zoning",      value: "R1-18",        sub: "Residential" },
      { icon: "◎", key: "Flood zone",  value: "Zone X",       sub: "Minimal risk",      badge: "Low risk",    badgeColor: "green" },
      { icon: "⚡", key: "Electric",   value: "0.4 mi away",  sub: "Off-grid now",      badge: "Nearby",      badgeColor: "amber" },
      { icon: "○", key: "Water",       value: "Well needed",  sub: "No public",         badge: "Action req.", badgeColor: "amber" },
      { icon: "▶", key: "Road access", value: "Paved",        sub: "County road",       badge: "Clear",       badgeColor: "green" },
      { icon: "◇", key: "HOA",         value: "None",         sub: "No restrictions",   badge: "No HOA",      badgeColor: "green" },
      { icon: "△", key: "Topography",  value: "Gentle slope", sub: "Buildable terrain", badge: "Buildable",   badgeColor: "green" },
    ],
  },
  "891 desert view": {
    address: "891 Desert View Dr, Sedona, AZ 86336",
    apn: "408-11-027B", county: "Yavapai", state: "Arizona", acres: "1.12",
    zoning: "AR-1", landUse: "Vacant Rural", parcelClass: "Agricultural",
    owner: "Mesa Verde Properties LLC", mailCity: "Phoenix", mailState: "AZ",
    marketValue: "$96,500", assessedValue: "$71,200",
    lastSaleDate: "Jun 2, 2019", lastSalePrice: "$54,000",
    gps: "34.8697° N, 111.7610° W",
    legal: "T16N R6E Sec 22 Yavapai Co Blk 2 Lot 7B",
    topo: "Flat to rolling", road: "Gravel — private easement",
    util: { elec: "Overhead line 0.2mi", water: "Municipal — connection fee req.", sewer: "Septic suitable", gas: "Not available", net: "Satellite only" },
    chips: [{ label: "Yavapai Co.", color: "gray" }, { label: "APN 408-11-027B", color: "gray" }, { label: "Vacant Rural", color: "blue" }],
    tiles: [
      { icon: "◻", key: "Lot size",    value: "1.12 ac",        sub: "Acres total" },
      { icon: "⬡", key: "Zoning",      value: "AR-1",           sub: "Agricultural" },
      { icon: "◎", key: "Flood zone",  value: "Zone AE",        sub: "High risk area",       badge: "High risk",     badgeColor: "amber" },
      { icon: "⚡", key: "Electric",   value: "0.2 mi away",    sub: "Close proximity",      badge: "Very close",    badgeColor: "green" },
      { icon: "○", key: "Water",       value: "Municipal",      sub: "Connection fee req.",  badge: "Available",     badgeColor: "blue"  },
      { icon: "▶", key: "Road access", value: "Gravel",         sub: "Private easement",     badge: "Verify access", badgeColor: "amber" },
      { icon: "◇", key: "HOA",         value: "None",           sub: "No restrictions",      badge: "No HOA",        badgeColor: "green" },
      { icon: "△", key: "Topography",  value: "Flat / rolling", sub: "Buildable terrain",    badge: "Buildable",     badgeColor: "green" },
    ],
  },
  "2240 mesa bluff": {
    address: "2240 Mesa Bluff Ln, Tucson, AZ 85749",
    apn: "215-88-011A", county: "Pima", state: "Arizona", acres: "5.03",
    zoning: "CR-1", landUse: "Vacant Rural", parcelClass: "Vacant Land",
    owner: "Southwest Holdings Trust", mailCity: "Tucson", mailState: "AZ",
    marketValue: "$212,000", assessedValue: "$158,000",
    lastSaleDate: "Jan 9, 2020", lastSalePrice: "$127,000",
    gps: "32.3105° N, 110.6792° W",
    legal: "T13S R16E Sec 8 Pima County TR A-11",
    topo: "Elevated mesa — views", road: "Paved — city maintained",
    util: { elec: "On-site connection available", water: "Public water stubbed", sewer: "Septic or tie-in available", gas: "Natural gas at street", net: "Fiber available" },
    chips: [{ label: "Pima Co.", color: "gray" }, { label: "APN 215-88-011A", color: "gray" }, { label: "Vacant Rural", color: "blue" }],
    tiles: [
      { icon: "◻", key: "Lot size",    value: "5.03 ac",          sub: "Acres total" },
      { icon: "⬡", key: "Zoning",      value: "CR-1",             sub: "Rural cluster" },
      { icon: "◎", key: "Flood zone",  value: "Zone X",           sub: "Minimal risk",     badge: "Low risk",   badgeColor: "green" },
      { icon: "⚡", key: "Electric",   value: "On site",          sub: "Ready to connect", badge: "Ready",      badgeColor: "green" },
      { icon: "○", key: "Water",       value: "Public stubbed",   sub: "At property line", badge: "Available",  badgeColor: "green" },
      { icon: "▶", key: "Road access", value: "Paved",            sub: "City maintained",  badge: "Clear",      badgeColor: "green" },
      { icon: "◇", key: "HOA",         value: "Yes",              sub: "Low monthly dues", badge: "HOA exists", badgeColor: "gray"  },
      { icon: "△", key: "Topography",  value: "Mesa — elevated",  sub: "360° views",       badge: "Premium",    badgeColor: "blue"  },
    ],
  },
};

const BADGE_STYLES: Record<TagColor, React.CSSProperties> = {
  green: { background: "#0D2A1A", color: "#4ADE80" },
  blue:  { background: "#0D1F3A", color: "#60A5FA" },
  amber: { background: "#2A1D0D", color: "#FBBF24" },
  red:   { background: "#2A0F0F", color: "#F87171" },
  gray:  { background: "#1A1A22", color: "#A1A1AA" },
};

function findProperty(q: string): Property | null {
  const nq = q.toLowerCase().trim();
  if (nq.includes("107-42-003c")) return PROPERTIES["4823 ridgeline"];
  for (const k in PROPERTIES) { if (nq.includes(k)) return PROPERTIES[k]; }
  return null;
}

// ─── Design tokens ─────────────────────────────────────────────────────────────
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

const ffH: React.CSSProperties = { fontFamily: "'Outfit', sans-serif" };
const ff:  React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };

// ─── Sub-components ───────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: TagColor }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 9px", borderRadius: 12, marginTop: 5, display: "inline-block", letterSpacing: "0.3px", ...BADGE_STYLES[color] }}>
      {label}
    </span>
  );
}

function StatItem({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ ...ff, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.2px", color: C.muted }}>
        {label}
      </span>
      <span style={{ ...ffH, fontSize: "clamp(16px,3vw,20px)", fontWeight: 700, color: C.text, letterSpacing: "-0.2px" }}>
        {value}
      </span>
      {sub && <span style={{ ...ff, fontSize: 11, color: C.muted }}>{sub}</span>}
    </div>
  );
}

function DetCard({ title, rows }: { title: string; rows: { key: string; value: string; mono?: boolean }[] }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "10px 18px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, flexShrink: 0 }} />
        <span style={{ ...ffH, fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted }}>
          {title}
        </span>
      </div>
      <div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 18px", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none", gap: 12 }}>
            <span style={{ ...ff, fontSize: 12, color: C.muted, flexShrink: 0 }}>{r.key}</span>
            <span style={{ fontSize: r.mono ? 10 : 12, color: r.mono ? C.muted : C.text, fontWeight: r.mono ? 400 : 500, textAlign: "right", wordBreak: "break-word", fontFamily: r.mono ? "monospace" : undefined }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingApex() {
  const phrases = ["Analysing property…", "Fetching parcel data…", "Checking utilities…", "Almost ready…"];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(p => (p + 1) % phrases.length); setFade(true); }, 300);
    }, 1400);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(60px,15vh,110px) 20px", gap: 20 }}>
      <div style={{ width: 56, height: 56, background: C.text, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", ...ffH, fontWeight: 900, fontSize: 26, color: C.bg, animation: "apex-pulse 1.8s ease-in-out infinite" }}>
        A
      </div>
      <div style={{ ...ffH, fontSize: "clamp(15px,3.5vw,18px)", fontWeight: 600, color: C.text, textAlign: "center", opacity: fade ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {phrases[idx]}
      </div>
      <div style={{ ...ff, fontSize: "clamp(12px,2.5vw,14px)", color: C.muted, textAlign: "center" }}>
        Pulling GIS data, utilities & market intel
      </div>
    </div>
  );
}

// ─── Tile Slider ──────────────────────────────────────────────────────────────
function TileSlider({ tiles }: { tiles: HighlightTile[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const check = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => { el.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [check, tiles]);

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  const arrStyle = (active: boolean): React.CSSProperties => ({
    width: 32, height: 32, borderRadius: "50%",
    background: active ? C.text : "transparent",
    border: `1px solid ${active ? C.text : C.border}`,
    color: active ? C.bg : C.muted,
    cursor: active ? "pointer" : "default",
    opacity: active ? 1 : 0.4,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, transition: "all 0.15s",
  });

  return (
    <div style={{ margin: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ ...ffH, fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.muted }}>
          Key highlights
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => scroll("left")}  style={arrStyle(canLeft)}  disabled={!canLeft}>←</button>
          <button onClick={() => scroll("right")} style={arrStyle(canRight)} disabled={!canRight}>→</button>
        </div>
      </div>
      <div ref={scrollRef} style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", gap: 10, padding: 10}}>
        <style>{`.apex-tiles-scroll::-webkit-scrollbar{display:none}`}</style>
        {tiles.map((t, i) => (
          <div
            key={i}
            style={{ flex: "0 0 auto", width: "clamp(140px,18vw,162px)", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 13px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 9, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginBottom: 10, color: C.muted }}>
              {t.icon}
            </div>
            <div style={{ ...ff, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: C.muted, marginBottom: 4 }}>{t.key}</div>
            <div style={{ ...ffH, fontSize: 17, fontWeight: 700, color: C.text, letterSpacing: "-0.3px", lineHeight: 1.1, marginBottom: 3 }}>{t.value}</div>
            <div style={{ ...ff, fontSize: 11, color: C.muted }}>{t.sub}</div>
            {t.badge && t.badgeColor && <Badge label={t.badge} color={t.badgeColor} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ApexDashboard() {
  const [query,       setQuery]       = useState("");
  const [stype,       setStype]       = useState<"address" | "apn">("address");
  const [appState,    setAppState]    = useState<AppState>("idle");
  const [property,    setProperty]    = useState<Property | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string, t?: "address" | "apn") => {
    if (t) setStype(t);
    if (!q.trim()) return;
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    setProperty(null);
    setAppState("loading");
    timerRef.current = setTimeout(() => {
      const p = findProperty(q);
      if (p) { setProperty(p); setAppState("result"); }
      else setAppState("notfound");
    }, 2200);
  }, []);

  const QUICK = [
    { label: "4823 Ridgeline Rd", q: "4823 Ridgeline Rd, Flagstaff, AZ",  t: "address" as const },
    { label: "APN 107-42-003C",   q: "107-42-003C",                        t: "apn"     as const },
    { label: "891 Desert View",   q: "891 Desert View Dr, Sedona, AZ",     t: "address" as const },
    { label: "2240 Mesa Bluff",   q: "2240 Mesa Bluff Ln, Tucson, AZ",     t: "address" as const },
  ];

  const notFound = appState === "notfound";
  const isIdle   = appState === "idle" || notFound;

  return (
    <div style={{ ...ff, background: C.bg, display: "flex", flexDirection: "column", color: C.text, minHeight: "100vh" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; }
        html { height: auto; }
        select option { background: ${C.card}; color: ${C.text}; }
        @keyframes apex-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.96)} }
        /* Desktop: sidebar fixed, nav fixed, content scrolls */
        @media (min-width: 1024px) {
          .apex-wrapper { display: flex; height: 100vh; overflow: hidden; width: 100%; }
          .apex-sidebar { position: fixed !important; left: 0; top: 0; height: 100vh; width: 260px; transform: none !important; transition: none !important; z-index: 50; }
          .apex-main-wrap { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; width: 100%; }
          .apex-navbar { position: sticky; top: 0; z-index: 30; flex-shrink: 0; width: 100%; }
          .apex-content { flex: 1; overflow-y: auto; overflow-x: hidden; width: 100%; }
          .apex-hamburger { display: none !important; }
          .apex-overlay { display: none !important; }
        }
        /* Mobile: responsive layout */
        @media (max-width: 1023px) {
          .apex-wrapper { display: flex; flex-direction: column; min-height: 100vh; width: 100%; }
          .apex-sidebar { position: fixed !important; width: 100%; }
          .apex-navbar { position: sticky; top: 0; z-index: 25; flex-shrink: 0; width: 100%; }
          .apex-content { flex: 1; overflow-y: auto; width: 100%; }
        }
      `}</style>

      {/* Wrapper for desktop layout */}
      <div className="apex-wrapper">
        {/* Sidebar — inside the flex row so it takes space on desktop */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSearch={search} />

        {/* Main content */}
        <div className="apex-main-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Nav */}
          <nav className="apex-navbar" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px clamp(16px,4vw,28px)", background: C.surface,
            borderBottom: `1px solid ${C.border}`, flexWrap: "wrap", gap: 12, flexShrink: 0,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="apex-hamburger"
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, padding: "2px 6px", display: "flex", alignItems: "center" }}
            >☰</button>
            <div style={{ width: 34, height: 34, background: C.text, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", ...ffH, fontWeight: 900, fontSize: 17, color: C.bg, flexShrink: 0 }}>
              A
            </div>
            <div>
              <div style={{ ...ffH, fontWeight: 700, fontSize: "clamp(14px,3vw,17px)", color: C.text, letterSpacing: "-0.3px" }}>
                Apex Intelligence
              </div>
              <div style={{ ...ff, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 1 }}>
                Property Analytics
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { label: "● Live", bg: "#0D2A1A", color: C.green },
              { label: "v1.0",   bg: "#0D1F3A", color: C.blue  },
              { label: "Beta",   bg: "#1A1A20", color: C.muted, border: `0.5px solid ${C.border}` },
            ].map(p => (
              <span key={p.label} style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: p.bg, color: p.color, border: (p as any).border }}>
                {p.label}
              </span>
            ))}
          </div>
        </nav>

        {/* Scrollable content area */}
        <div className="apex-content" style={{  }}>
          {/* Search zone */}
          <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "clamp(20px,4vw,32px) clamp(16px,4vw,28px)" }}>
          <div style={{ ...ff, fontSize: 10, fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
            Land Deal Intelligence
          </div>
          <h1 style={{ ...ffH, fontSize: "clamp(20px,3.5vw,28px)", fontWeight: 800, letterSpacing: "-0.5px", color: C.text, lineHeight: 1.15, marginBottom: 8 }}>
            Search any property.{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              Understand it instantly.
              <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 2, background: C.blue, borderRadius: 2 }} />
            </span>
          </h1>
          <p style={{ ...ff, fontSize: 13, color: C.muted, marginBottom: 22, maxWidth: 520, lineHeight: 1.6 }}>
            Enter an address or APN — Apex surfaces the data that matters, structured for fast decisions.
          </p>

          <div style={{ display: "flex", maxWidth: 640, background: C.card, border: `1px solid ${C.border}`, borderRadius: 40, overflow: "hidden" }}>
            <select
              value={stype}
              onChange={e => setStype(e.target.value as "address" | "apn")}
              style={{ border: "none", background: "transparent", borderRight: `1px solid ${C.border}`, padding: "0 14px", height: 50, fontSize: 11, fontWeight: 700, color: C.muted, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", outline: "none", flexShrink: 0 }}
            >
              <option value="address">Address</option>
              <option value="apn">APN</option>
            </select>
            <input
              style={{ flex: 1, border: "none", background: "transparent", padding: "0 16px", fontSize: 14, color: C.text, fontFamily: "'Space Grotesk', sans-serif", outline: "none", height: 50, minWidth: 0 }}
              placeholder={stype === "address" ? "e.g., 4823 Ridgeline Rd, Flagstaff" : "e.g., 107-42-003C"}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search(query, stype)}
            />
            <button
              onClick={() => search(query, stype)}
              style={{ padding: "0 22px", background: C.text, border: "none", color: C.bg, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", height: 50, flexShrink: 0, letterSpacing: "0.3px", transition: "opacity 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              Analyse →
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <span style={{ ...ff, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Try:</span>
            {QUICK.map(q => (
              <button
                key={q.q}
                onClick={() => { setStype(q.t); setQuery(q.q); search(q.q, q.t); }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 30, padding: "5px 14px", fontSize: 11, color: C.muted, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area - controlled by apex-content above */}
        {isIdle && (
            <div style={{ padding: "clamp(50px,12vh,80px) 20px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.card, border: `1px solid ${C.border}`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5">
                  <circle cx="10" cy="10" r="7"/><path d="M21 21L15 15"/>
                </svg>
              </div>
              <div style={{ ...ffH, fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 6 }}>
                {notFound ? "Property not found" : "No property loaded"}
              </div>
              <div style={{ ...ff, fontSize: 13, color: C.muted, maxWidth: 340, margin: "0 auto" }}>
                {notFound ? "Try one of the demo searches, or check the address / APN." : "Search an address or APN above to get started"}
              </div>
            </div>
          )}

          {appState === "loading" && <LoadingApex />}

          {appState === "result" && property && (
            <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>

              {/* Overview */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "clamp(16px,3vw,22px)", marginBottom: 18 ,margin:10,marginTop:20}}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ ...ffH, fontSize: "clamp(15px,2.5vw,20px)", fontWeight: 700, color: C.text, letterSpacing: "-0.3px", marginBottom: 12, lineHeight: 1.3 }}>
                      {property.address}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {property.chips.map((ch, i) => (
                        <span key={i} style={{ ...ff, fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 16, ...(ch.color === "blue" ? { background: "#0D1F3A", color: C.blue } : { background: "#1A1A22", color: C.muted, border: `0.5px solid ${C.border}` }) }}>
                          {ch.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#0D2A1A", borderRadius: 30, padding: "7px 16px", flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#22C55E" strokeWidth="2.2">
                      <polyline points="1.5 6 4.5 9 10.5 2.5"/>
                    </svg>
                    <span style={{ ...ff, fontSize: 11, fontWeight: 600, color: C.green }}>Verified</span>
                  </div>
                </div>
                <div style={{ height: 1, background: C.border, margin: "14px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 14 }}>
                  <StatItem label="Lot size"     value={`${property.acres} ac`} sub="acres total" />
                  <StatItem label="Market value" value={property.marketValue}   sub={`Assessed ${property.assessedValue}`} />
                  <StatItem label="Last sale"    value={property.lastSalePrice} sub={property.lastSaleDate} />
                  <StatItem label="Zoning"       value={property.zoning}        sub={property.parcelClass} />
                  <StatItem label="County"       value={property.county}        sub={property.state} />
                </div>
              </div>

              <TileSlider tiles={property.tiles} />

              <div style={{ ...ffH, fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.muted, margin: 14 }}>
                Property details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12, margin: 18 }}>
                <DetCard title="Parcel details" rows={[
                  { key: "APN", value: property.apn },
                  { key: "County", value: property.county },
                  { key: "State", value: property.state },
                  { key: "Parcel class", value: property.parcelClass },
                  { key: "Land use", value: property.landUse },
                  { key: "Coordinates", value: property.gps, mono: true },
                ]} />
                <DetCard title="Ownership & history" rows={[
                  { key: "Owner name",      value: property.owner },
                  { key: "Mailing city",    value: property.mailCity },
                  { key: "Mailing state",   value: property.mailState },
                  { key: "Last sale date",  value: property.lastSaleDate },
                  { key: "Last sale price", value: property.lastSalePrice },
                  { key: "Market value",    value: property.marketValue },
                ]} />
                <DetCard title="Land characteristics" rows={[
                  { key: "Acreage", value: `${property.acres} acres` },
                  { key: "Zoning code", value: property.zoning },
                  { key: "Topography", value: property.topo },
                  { key: "Road type", value: property.road },
                  { key: "Legal description", value: property.legal, mono: true },
                ]} />
                <DetCard title="Utility snapshot" rows={[
                  { key: "Electric",       value: property.util.elec },
                  { key: "Water",          value: property.util.water },
                  { key: "Sewer / septic", value: property.util.sewer },
                  { key: "Gas",            value: property.util.gas },
                  { key: "Internet",       value: property.util.net },
                ]} />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", paddingTop: 16, paddingBottom: 10, borderTop: `1px solid ${C.border}` }}>
                <button
                  onClick={() => { setAppState("idle"); setQuery(""); setProperty(null); }}
                  style={{ padding: "9px 18px", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, fontWeight: 500, borderRadius: 30, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.muted; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
                >
                  ↺ New search
                </button>
          
                <button
                  style={{ padding: "9px 22px", background: C.text, border: "none", color: C.bg, fontSize: 12, fontWeight: 700, borderRadius: 30, cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.2px", transition: "opacity 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  Run deal analysis →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px clamp(16px,4vw,24px)", background: C.surface, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {[
              { n: "01", label: "Property Lookup",  active: true  },
              { n: "02", label: "Deal Intelligence", active: false },
              { n: "03", label: "Buyer Matching",    active: false },
            ].map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {i > 0 && <div style={{ width: 22, height: 1, background: C.border }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", ...ffH, fontSize: 9, fontWeight: 700, background: s.active ? C.text : "#1A1A22", color: s.active ? C.bg : C.muted }}>
                    {s.n}
                  </div>
                  <span style={{ ...ff, fontSize: 11, color: s.active ? C.text : C.muted, fontWeight: s.active ? 500 : 400 }}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span style={{ ...ff, fontSize: 10, color: C.muted }}>© 2026 Apex Intelligence</span>
        </div>
        </div>
      </div>
    </div>
  );
}