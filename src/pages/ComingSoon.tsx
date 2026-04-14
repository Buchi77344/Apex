import { Link } from 'react-router-dom'

interface ComingSoonProps {
  title: string
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0C', color: '#F5F5F7', fontFamily: 'Space Grotesk, sans-serif', padding: '32px', boxSizing: 'border-box' }}>
      <section style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: '#16161A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
            🚧
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7A7A8A' }}>
              Coming soon
            </p>
            <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.05 }}>
              {title}
            </h1>
          </div>
        </div>

        <p style={{ margin: 0, maxWidth: 640, lineHeight: 1.75, color: '#B0B0C0' }}>
          This section is not available yet. We’re building it now, and it will be ready soon.
        </p>

        <div style={{ marginTop: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px', background: '#111114', borderRadius: 12, color: '#F5F5F7', textDecoration: 'none', fontWeight: 700, border: '1px solid #222228' }}>
            Back to Property Search
          </Link>
        </div>
      </section>
    </div>
  )
}
