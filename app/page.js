import Link from 'next/link';
import Timeline from './components/Timeline';
import { PLANS, CREDIT_COST_PER_VIDEO } from '@/lib/pricing';

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="wordmark">frame<span className="dot">·</span>flow</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/login" className="btn btn-ghost">Log in</Link>
            <Link href="/signup" className="btn btn-primary">Start free</Link>
          </div>
        </nav>

        <section style={{ padding: '64px 0 40px', maxWidth: 720 }}>
          <div className="timecode" style={{ marginBottom: 14 }}>00:00:00:00 — SCRIPT</div>
          <h1 style={{ fontSize: 56, lineHeight: 1.05 }}>
            Paste a script.<br />Get a finished minute of video.
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink-dim)', marginTop: 20, maxWidth: 520 }}>
            Frameflow narrates, scores and cuts your words into a full one-minute
            video automatically — no editing software, no timeline to drag.
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <Link href="/signup" className="btn btn-primary">Get {20} free credits</Link>
            <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
          </div>
        </section>

        <section style={{ margin: '40px 0' }}>
          <div className="timecode" style={{ marginBottom: 6 }}>00:00:00:00 — 00:01:00:00</div>
          <Timeline ticks={60} majorEvery={10} />
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, margin: '56px 0' }}>
          {[
            ['01', 'Write or paste', 'Drop in a script, a blog post, or a product description.'],
            ['02', 'We cut it to scenes', 'Your text is split into narrated scenes with matching captions.'],
            ['03', 'Render in minutes', 'A finished MP4 lands in your dashboard, ready to download.'],
          ].map(([n, title, body]) => (
            <div key={n} style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div className="timecode">{n}</div>
              <h3 style={{ fontSize: 19, margin: '8px 0' }}>{title}</h3>
              <p style={{ color: 'var(--ink-dim)', fontSize: 15, lineHeight: 1.5 }}>{body}</p>
            </div>
          ))}
        </section>

        <section className="card" style={{ margin: '56px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 26 }}>Simple, credit-based pricing</h2>
            <span className="timecode" style={{ color: '#6b6f7a' }}>
              1 minute video = {CREDIT_COST_PER_VIDEO} credits
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
            {PLANS.map((p) => (
              <div key={p.id} style={{ border: '1px solid rgba(20,22,28,0.12)', borderRadius: 6, padding: 20 }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 34, margin: '8px 0' }}>${p.price}</div>
                <div style={{ color: '#5b5f68', fontSize: 14 }}>{p.credits} credits · {p.blurb}</div>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ padding: '32px 0', borderTop: '1px solid var(--line)', color: 'var(--ink-dim)', fontSize: 14 }}>
          Frameflow · built on the JSON2Video API
        </footer>
      </div>
    </main>
  );
    }
