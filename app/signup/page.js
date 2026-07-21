'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="wordmark" style={{ marginBottom: 32 }}>frame<span className="dot">·</span>flow</div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Create your account</h1>
      <p style={{ color: 'var(--ink-dim)', marginBottom: 28 }}>Get 20 free credits — enough for two one-minute videos.</p>

      {sent ? (
        <p>Check your email to confirm your account, then <Link href="/login" style={{ color: 'var(--accent)' }}>log in</Link>.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email" required placeholder="you@email.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          {error && <p style={{ color: 'var(--accent)', fontSize: 14 }}>{error}</p>}
          <button className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      )}

      <p style={{ marginTop: 24, color: 'var(--ink-dim)', fontSize: 14 }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--accent)' }}>Log in</Link>
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
