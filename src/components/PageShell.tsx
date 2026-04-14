import { useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

type SearchType = 'address' | 'apn'

interface PageShellProps {
  title: string
  children: ReactNode
}

export default function PageShell({ title, children }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const search = useCallback((q: string, t?: SearchType) => {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate('/', { state: { search: { q: trimmed, t: t ?? 'address' } } })
    setSidebarOpen(false)
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', color: '#F5F5F7', background: '#0A0A0C', fontFamily: 'Space Grotesk, sans-serif' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; background: #0A0A0C; overflow-x: hidden; }
        html { height: auto; }
        input, select, button, textarea { -webkit-appearance: none; appearance: none; border-radius: 0; }
        input, select { font-size: 16px; }
        @media (min-width: 1024px) {
          .apex-wrapper { display: flex; height: 100vh; overflow: hidden; width: 100%; }
          .apex-sidebar { position: fixed !important; left: 0; top: 0; height: 100vh; width: 260px; transform: none !important; transition: none !important; z-index: 50; }
          .apex-main-wrap { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; width: calc(100% - 260px); margin-left: 260px; }
          .apex-navbar { position: sticky; top: 0; z-index: 30; flex-shrink: 0; width: 100%; }
          .apex-content { flex: 1; overflow-y: auto; overflow-x: hidden; width: 100%; }
          .apex-hamburger { display: none !important; }
          .apex-overlay { display: none !important; }
        }
        @media (max-width: 1023px) {
          .apex-wrapper { display: flex; flex-direction: column; min-height: 100vh; width: 100%; }
          .apex-sidebar { position: fixed !important; top: 0; left: 0; width: 100%; height: 100vh; z-index: 50; }
          .apex-navbar { position: sticky; top: 0; z-index: 25; flex-shrink: 0; width: 100%; }
          .apex-content { flex: 1; overflow-y: auto; width: 100%; }
        }
      `}</style>

      <div className="apex-wrapper">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSearch={search} />
        <div className="apex-main-wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <nav className="apex-navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px clamp(16px,4vw,28px)', background: '#111114', borderBottom: '1px solid #222228', flexWrap: 'wrap', gap: 12, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="apex-hamburger"
                onClick={() => setSidebarOpen(true)}
                style={{ background: 'none', border: 'none', color: '#B0B0C0', cursor: 'pointer', fontSize: 20, padding: '2px 6px', display: 'flex', alignItems: 'center' }}
              >☰</button>
              <div style={{ width: 34, height: 34, background: '#F5F5F7', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 17, color: '#0A0A0C', flexShrink: 0 }}>
                W
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 'clamp(14px,3vw,17px)', color: '#F5F5F7', letterSpacing: '-0.3px' }}>
                  Landwiz
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: '#B0B0C0', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 1 }}>
                  Land Deal Intelligence
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: '● Live', bg: '#0D2A1A', color: '#22C55E' },
                { label: 'v1.0', bg: '#0D1F3A', color: '#3B82F6' },
                { label: 'Beta', bg: '#1A1A20', color: '#B0B0C0', border: '0.5px solid #222228' },
              ].map(p => (
                <span key={p.label} style={{ fontSize: 'clamp(10px, 2vw, 11px)', fontWeight: 600, padding: 'clamp(4px, 2vw, 6px) clamp(12px, 3vw, 14px)', borderRadius: 20, background: p.bg, color: p.color, border: (p as any).border }}>
                  {p.label}
                </span>
              ))}
            </div>
          </nav>

          <div className="apex-content">
            <div style={{ padding: 'clamp(28px, 4vw, 36px) clamp(16px, 4vw, 28px)' }}>
              <div style={{ maxWidth: 840, margin: '0 auto' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#7A7A8A', marginBottom: 10 }}>
                  {title}
                </div>
                <div style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 150px)' }}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
