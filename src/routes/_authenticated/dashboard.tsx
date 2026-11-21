import { useLanguage } from '@/components/language';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, Phone, RefreshCw, Search, UserRound, X } from 'lucide-react';
import { getDashboard, saveProfile } from '@/lib/dashboard.functions';
import { Button } from '@/components/ui/button';
import { ConsultationSummary } from '@/components/consultation-summary';
import { tel } from '@/components/site';

const options = (page: number, search: string) => queryOptions({ queryKey: ['consultations', page, search], queryFn: () => getDashboard({ data: { page, search } }) });
export const Route = createFileRoute('/_authenticated/dashboard')({
  validateSearch: (input: Record<string, unknown>): { page?: number | undefined; search?: string | undefined; case?: string | undefined } => ({ page: Math.max(0, Math.floor(Number(input['page']) || 0)), search: typeof input['search'] === 'string' ? input['search'].slice(0, 100) : '', case: typeof input['case'] === 'string' ? input['case'] : undefined }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 0, search: search.search ?? '' }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(options(deps.page, deps.search)),
  head: () => ({ meta: [ { title: 'Consultation Dashboard — Ahadu Law Firm' }, { name: 'description', content: 'Private Ahadu team consultation inbox.' }, { property: 'og:title', content: 'Consultation Dashboard — Ahadu Law Firm' }, { property: 'og:description', content: 'Private consultation summaries for the Ahadu team.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' } ] }),
  errorComponent: ({ error }) => { const { t } = useLanguage(); const router = useRouter(); return <section className="mx-auto max-w-3xl px-6 py-20"><h1 className="text-4xl">{t("Team access")}</h1><p role="alert" className="my-6">{t(error instanceof Error ? error.message : 'Consultations could not be loaded.')}</p><Button onClick={() => router.invalidate()}>{t("Try again")}</Button></section>; },
  notFoundComponent: () => { const { t } = useLanguage(); return <p className="p-8">{t("Consultation not found.")}</p>; },
  component: Dashboard,
});

function Dashboard() {
  const { t } = useLanguage();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isFetching } = useSuspenseQuery(options(search.page ?? 0, search.search ?? ''));
  const queryClient = useQueryClient();
  const updateProfile = useServerFn(saveProfile);
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const selected = data.cases.find((item) => item.id === search.case);
  const page = search.page ?? 0;
  return <section className="mx-auto max-w-7xl px-6 py-12">
    <div className="flex flex-wrap items-start justify-between gap-5 border-b border-border pb-8"><div><p className="text-xs font-semibold uppercase tracking-widest text-crimson">{t("Ahadu • Team workspace")}</p><h1 className="mt-3 text-4xl sm:text-5xl">{t("Consultation inbox")}</h1><p className="mt-3 text-muted-foreground">{data.count} {data.count === 1 ? t("consultation") : t("consultations")}{data.profile ? ` · ${data.profile}` : ''}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => { setName(data.profile); setProfileOpen(!profileOpen); setMessage(''); }}><UserRound />{t("Profile")}</Button><Button variant="outline" size="icon" title={t("Refresh consultations")} aria-label={t("Refresh consultations")} disabled={isFetching} onClick={() => queryClient.invalidateQueries({ queryKey: [t("consultations")] })}><RefreshCw className={isFetching ? 'animate-spin' : ''} /></Button></div></div>
    {profileOpen && <form className="my-6 flex flex-wrap items-end gap-3 border-b border-border pb-6" onSubmit={async (event) => { event.preventDefault(); setSaving(true); try { await updateProfile({ data: { displayName: name } }); await queryClient.invalidateQueries({ queryKey: [t("consultations")] }); setMessage(t("Profile saved.")); } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save profile.'); } finally { setSaving(false); } }}><label className="text-sm font-medium">{t("Display name")}<input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block rounded-sm border border-input bg-card p-3" /></label><Button disabled={saving}>{saving ? t("Saving…") : t("Save profile")}</Button><p role="status" className="w-full text-sm">{message}</p></form>}
    <form className="my-6 flex max-w-md items-center gap-2" onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); navigate({ search: { search: String(form.get('search') ?? ''), page: 0 } }); }}><div className="flex flex-1 items-center gap-3 border border-input bg-card px-3"><Search className="h-4 w-4 text-muted-foreground" /><input key={search.search} name="search" aria-label={t("Search client names")} placeholder={t("Search client names")} maxLength={100} defaultValue={search.search} className="min-w-0 flex-1 bg-transparent py-3 outline-none" /></div><Button type="submit" variant="outline">{t("Search")}</Button></form>
    <div className={`grid gap-8 ${selected ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]' : ''}`}>
      <div className="min-w-0">{data.cases.length === 0 ? <div className="border-y border-border py-16 text-center"><FileText className="mx-auto mb-4 h-8 w-8 text-muted-foreground" /><h2 className="text-2xl">{search.search ? t("No matching consultations") : t("No consultations yet")}</h2></div> : <ul className="divide-y divide-border border-y border-border">{data.cases.map((item) => <li key={item.id} className={item.id === selected?.id ? 'bg-secondary' : ''}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal rounded-none px-4 py-5 text-left" onClick={() => navigate({ search: (prev) => ({ ...prev, case: item.id }) })}><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><span className="break-words text-base font-semibold">{item.client_name}</span><span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span></div><p className="mt-2 text-sm text-muted-foreground">{t(item.matter_type || 'Unclassified')} · {item.phone}</p><p className="mt-2 line-clamp-2 break-words text-sm font-normal">{item.issue}</p><span className="mt-3 inline-block text-xs font-semibold text-crimson">{item.generation_status === 'ready' ? t("Summary ready") : item.generation_status === 'preparing' ? t("Preparing summary") : t("Summary unavailable")}</span></div><ArrowRight className="ml-3" /></Button></li>)}</ul>}
      <div className="mt-5 flex items-center justify-between"><Button variant="outline" disabled={page === 0} onClick={() => navigate({ search: (prev) => ({ ...prev, page: page - 1, case: undefined }) })}><ArrowLeft />{t("Previous")}</Button><span className="text-xs text-muted-foreground">{t("Page")} {page + 1}</span><Button variant="outline" disabled={(page + 1) * 20 >= data.count} onClick={() => navigate({ search: (prev) => ({ ...prev, page: page + 1, case: undefined }) })}>{t("Next")}<ArrowRight /></Button></div></div>
      {selected && <article className="min-w-0 border-t border-gold pt-6"><div className="flex items-start justify-between gap-3"><div><h2 className="break-words text-3xl">{selected.client_name}</h2><p className="mt-2 text-sm text-muted-foreground">{t(selected.matter_type || 'Unclassified')}</p></div><Button variant="ghost" size="icon" aria-label={t("Close consultation")} onClick={() => navigate({ search: (prev) => ({ ...prev, case: undefined }) })}><X /></Button></div><Button asChild className="my-5"><a href={tel(selected.phone)}><Phone />{selected.phone}</a></Button><h3 className="mb-3 text-xl">{t("Client’s description")}</h3><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{selected.issue}</p><div className="mt-6 border-t border-border pt-6"><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-crimson">{t("AI-prepared summary")}</p>{selected.summary ? <ConsultationSummary text={selected.summary} /> : <p className="text-sm text-muted-foreground">{selected.generation_status === 'preparing' ? t("The summary is still being prepared. Refresh to check again.") : t("The summary could not be completed. The original issue and phone number are saved above.")}</p>}</div></article>}
    </div>
  </section>;
}