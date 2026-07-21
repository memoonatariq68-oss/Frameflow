'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PLANS } from '@/lib/pricing';

export default function PricingPage() {
  const [loadingId, setLoadingId] = useState(null);

  async function buy(planId) {
    setLoadingId(planId);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    setLoadingId(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || 'Could not start checkout');
  }

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <nav className="nav">
        <Link href="/" className="wordmark">frame<span className="dot">·</span>flow</Link>
        <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
      </nav>

      <h1 style={{ fontSize: 32, marginTop: 24 }}>Buy credits</h1>
      <p style={{ color: 'var(--ink-dim)', marginBottom: 32 }}>Credits never expire. Use them whenever you generate a video.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {PLANS.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700 }}>{p.name}</div>
            <div style={{ fontSize: 40, margin: '12px 0 4px' }}>${p.price}</div>
            <div style={{ color: '#5b5f68', fontSize: 14, marginBottom: 20 }}>{p.credits} credits · {p.blurb}</div>
            <button
              onClick={() => buy(p.id)}
              disabled={loadingId === p.id}
              className="btn btn-primary"
              style={{ marginTop: 'auto', justifyContent: 'center' }}
            >
              {loadingId === p.id ? 'Redirecting…' : `Buy ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
  }
