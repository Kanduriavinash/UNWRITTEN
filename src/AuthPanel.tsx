import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export default function AuthPanel() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password });
        if (error) throw error;
        setMessage('If your college email is allowed, check your inbox for the verification link. You must verify your email before signing in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw error;
        setMessage('Signed in.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!isSupabaseConfigured) return <section className="auth-panel"><div className="auth-icon"><LockKeyhole size={22}/></div><div><h3>Private campus access</h3><p>Authentication is prepared, but no Supabase project is connected yet. Preview mode stays available below.</p><span className="auth-status">Not connected · no real accounts created</span></div></section>;

  if (userEmail) return <section className="auth-panel"><div className="auth-icon"><Mail size={22}/></div><div className="auth-copy"><h3>You're signed in</h3><p>{userEmail}</p><span className="auth-status">This only confirms your account session; discovery and messaging are still preview-only.</span><button className="auth-submit signout" onClick={async () => { await supabase!.auth.signOut(); setMessage('Signed out.'); }}>Sign out</button></div></section>;

  return <section className="auth-panel auth-form-panel"><div className="auth-icon"><LockKeyhole size={22}/></div><div className="auth-copy"><h3>{mode === 'signup' ? 'Join your campus' : 'Welcome back'}</h3><p>Use your approved college email. Email verification must be enabled in Supabase.</p><form onSubmit={submit} className="auth-form"><label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@your-college.edu" required /></label><label>Password<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></label><button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button></form><button className="auth-switch" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); }}>{mode === 'signup' ? 'Already registered? Sign in' : 'New here? Create an account'}</button>{message && <p className="auth-message" role="status">{message}</p>}<span className="auth-status">College domain enforcement must be installed in the database before launch.</span></div></section>;
}
