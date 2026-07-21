'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { CREDIT_COST_PER_VIDEO } from '@/lib/pricing';

export default function Dashboard() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [credits, setCredits] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [videos, setVideos] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
    if (profile) setCredits(profile.credits);

    const { data: vids } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (vids) setVideos(vids);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const processing = videos.filter((v) => v.status === 'processing');
    if (processing.length === 0) return;
    const t = setInterval(async () => {
      for (const v of processing) {
        const res = await fetch(`/api/status/${v.id}`);
        if (res.ok) loadData();
      }
    }, 6000);
    return () => clearInterval(t);
  }, [videos, loadData]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setError('');
    if (credits !== null && credits < CREDIT_COST_PER_VIDEO) {
      setError(`You need ${CREDIT_COST_PER_VIDEO} credits for a one-minute video. Top up on the pricing page.`);
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setPrompt('');
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <nav className="nav">
        <Link href="/" className="wordmark">frame<span className="dot">·</span>flow</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="timecode">{credits === null ? '—' : credits} credits</span>
          <Link href="/pricing" className="btn btn-ghost">Buy credits</Link>
          <button onClick={handleLogout} className="btn btn-ghost">Log out</button>
        </div>
      </nav>

      <section className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>New video</h1>
        <p style={{ color: '#5b5f68', marginBottom: 16, fontSize: 14 }}>
          Paste your script below. It becomes a narrated, captioned, one-minute video — {CREDIT_COST_PER_VIDEO} credits per video.
        </p>
        <form onSubmit={handleGenerate}>
          <textarea
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste or write your script here…"
            rows={6}
            style={{
              width: '100%', padding: 14, borderRadius: 4, border: '1px solid rgba(20,22,28,0.15)',
              fontSize: 15, fontFamily: 'var(--body)', resize: 'vertical',
            }}
          />
          {error && <p style={{ color: 'var(--accent)', fontSize: 14, marginTop: 8 }}>{error}</p>}
          <button className="btn btn-primary" disabled={generating} style={{ marginTop: 14 }}>
            {generating ? 'Sending to render…' : 'Generate video'}
          </button>
        </form>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Your videos</h2>
        {videos.length === 0 && <p style={{ color: 'var(--ink-dim)' }}>Nothing yet — generate your first video above.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {videos.map((v) => (
            <div key={v.id} style={{ border: '1px solid var(--line)', borderRadius: 6, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 480 }}>
                  {v.prompt}
                </div>
                <div className="timecode" style={{ marginTop: 4 }}>
                  {new Date(v.created_at).toLocaleString()} · {v.status}
                </div>
              </div>
              {v.status === 'done' && v.video_url && (
                <a href={v.video_url} target="_blank" rel="noreferrer" className="btn btn-primary">Download</a>
              )}
              {v.status === 'processing' && <span className="timecode">rendering…</span>}
              {v.status === 'failed' && <span style={{ color: 'var(--accent)', fontSize: 14 }}>failed</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
      }
