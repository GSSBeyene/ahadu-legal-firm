import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [{ title: 'Reset Password — Ahadu Law Firm' }, { name: 'description', content: 'Set a new password for your Ahadu team account.' }, { property: 'og:title', content: 'Reset Password — Ahadu Law Firm' }, { property: 'og:description', content: 'Secure account recovery for the Ahadu team.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setRecovery(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery' || sessionStorage.getItem('ahadu-recovery') === 'true'); }, []);
  return <section className="mx-auto max-w-md px-6 py-16"><h1 className="mb-6 text-4xl">Set a new password</h1>{recovery ? <form className="space-y-5" onSubmit={async (e) => { e.preventDefault(); if (password !== confirm) { setMessage('Passwords do not match.'); return; } setBusy(true); const { error } = await supabase.auth.updateUser({ password }); setBusy(false); if (error) setMessage(error.message); else { sessionStorage.removeItem('ahadu-recovery'); await navigate({ to: '/dashboard' }); } }}><label className="block">New password<input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-input bg-card p-3" /></label><label className="block">Confirm password<input required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2 w-full border border-input bg-card p-3" /></label><Button disabled={busy}>{busy ? 'Saving…' : 'Save password'}</Button></form> : <p>Please open the password reset link from your email.</p>}{message && <p role="alert" className="mt-4 text-sm text-destructive">{message}</p>}</section>;
}