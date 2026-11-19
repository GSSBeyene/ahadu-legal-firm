import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { LovableMark } from '@lovable.dev/cloud-auth-js/react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useTeamSession } from '@/components/team-session';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth')({
  head: () => ({ meta: [{ title: 'Team Sign-in — Ahadu Law Firm' }, { name: 'description', content: 'Secure sign-in for the Ahadu Law Firm team.' }, { property: 'og:title', content: 'Team Sign-in — Ahadu Law Firm' }, { property: 'og:description', content: 'Access the private Ahadu consultation inbox.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  component: Auth,
});
function Auth() {
  const user = useTeamSession();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const field = 'mt-2 block w-full rounded-sm border border-input bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring';
  async function social(provider: 'google' | 'lovable') {
    setMessage('');
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) setMessage(result.error.message);
      else if (!result.redirected) await navigate({ to: '/dashboard' });
    } catch { setMessage('Sign-in could not be completed. Please try again.'); }
  }
  return <section className="mx-auto max-w-md px-6 py-16"><LockKeyhole className="mb-5 h-7 w-7 text-crimson" /><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ahadu team</p><h1 className="my-4 text-4xl">{mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Team sign-in'}</h1>
    {user ? <div><p className="mb-6 text-sm text-muted-foreground">You are signed in.</p><Button onClick={() => navigate({ to: '/dashboard' })}>Open consultation inbox</Button></div> : <>
      <form className="space-y-5" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setMessage(''); try {
        if (mode === 'forgot') { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) throw error; setMessage('Check your email for a password reset link.'); }
        else if (mode === 'signup') { const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } }); if (error) throw error; if (data.session) await navigate({ to: '/dashboard' }); else setMessage('Check your email to confirm your account. Only approved team accounts can read consultations.'); }
        else { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; await navigate({ to: '/dashboard' }); }
      } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign-in failed.'); } finally { setBusy(false); } }}>
        <label className="block text-sm font-semibold">Email<input required type="email" autoComplete="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} className={field} /></label>
        {mode !== 'forgot' && <label className="block text-sm font-semibold">Password<input required type="password" minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} className={field} /></label>}
        <Button className="h-12 w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Sign in'}</Button>
      </form>
      {mode !== 'forgot' && <div className="mt-6 space-y-3 border-t border-border pt-6"><Button variant="outline" className="h-11 w-full" onClick={() => social('google')}><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</Button><Button variant="outline" className="h-11 w-full" onClick={() => social('lovable')}><LovableMark />Continue with Lovable</Button></div>}
      <div className="mt-5 flex flex-wrap gap-2"><Button variant="link" className="px-0" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); }}>{mode === 'signup' ? 'Back to sign-in' : 'Create team account'}</Button><Button variant="link" onClick={() => { setMode(mode === 'forgot' ? 'signin' : 'forgot'); setMessage(''); }}>{mode === 'forgot' ? 'Back to sign-in' : 'Forgot password?'}</Button></div>
    </>}
    {message && <p role="status" className="mt-5 border-l-2 border-crimson pl-4 text-sm">{message}</p>}
  </section>;
}