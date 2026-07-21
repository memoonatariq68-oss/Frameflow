'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="wordmark" style={{ marginBottom: 32 }}>frame<span className="dot">·</span>flow</div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Log in</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email" required placeholder="you@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password" required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={{ color: 'var(--accent)', fontSize: 14 }}>{error}</p>}
        <button className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p style={{ marginTop: 24, color: 'var(--ink-dim)', fontSize: 14 }}>
        No account yet? <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link>
      </p>
    </main>
  );
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: 4,
  border: '1px solid var(--line)',
  background: 'var(--panel-dim)',
  color: 'var(--ink)',
  fontSize: 15,
};
