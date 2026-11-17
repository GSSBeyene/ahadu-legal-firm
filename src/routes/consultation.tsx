import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { Copy, Loader2, Phone, Sparkles, Square } from "lucide-react";
import { PageHero, areas, lawyers, tel } from "@/components/site";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Describe Your Case — Ahadu Law Firm" },
      { name: "description", content: "Describe your legal issue and get an AI-prepared consultation summary to share with Ahadu Law Firm." },
      { property: "og:title", content: "Describe Your Case — Ahadu Law Firm" },
      { property: "og:description", content: "Prepare for your consultation with an AI-powered case summary." },
    ],
  }),
  component: Consultation,
});

const ERR = "[[ERROR]]";

function inline(t: string): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*)/g).map((s, i) => (s.startsWith("**") && s.endsWith("**") ? <strong key={i}>{s.slice(2, -2)}</strong> : s));
}

function Summary({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-[15px] leading-relaxed">
      {text.split("\n").map((l, i) => {
        if (l.startsWith("## ")) return <h3 key={i} className="pt-4 text-xl font-semibold first:pt-0">{l.slice(3)}</h3>;
        if (/^\s*[-*] /.test(l)) return <p key={i} className="pl-5 -indent-3">• {inline(l.replace(/^\s*[-*] /, ""))}</p>;
        if (!l.trim()) return null;
        return <p key={i}>{inline(l)}</p>;
      })}
    </div>
  );
}

function Consultation() {
  const [form, setForm] = useState({ name: "", phone: "", area: "", issue: "" });
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const ctrl = useRef<AbortController | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setText(""); setError(""); setBusy(true); setCopied(false);
    const ac = new AbortController(); ctrl.current = ac;
    try {
      const res = await fetch("/api/consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form), signal: ac.signal });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const at = acc.indexOf(ERR);
        if (at >= 0) { setText(acc.slice(0, at).trim()); setError(acc.slice(at + ERR.length)); break; }
        setText(acc);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
    } finally { setBusy(false); ctrl.current = null; }
  }

  const field = "w-full rounded-sm border border-input bg-card px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-ring/30";

  return (
    <>
      <PageHero eyebrow="Case intake" title="Describe your legal issue" text="Tell us what happened in your own words. Our AI-powered assistant prepares a clear summary for our advocates so your consultation starts on the right foot." />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:py-20 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Full name</span>
              <input required maxLength={100} className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Phone</span>
              <input required type="tel" maxLength={30} className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          </div>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Type of matter</span>
            <select className={field} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
              <option value="">Not sure</option>
              {areas.map((a) => <option key={a.t}>{a.t}</option>)}
            </select></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">What happened?</span>
            <textarea required minLength={20} maxLength={4000} rows={9} className={field} placeholder="Describe the situation, dates, people involved and what you'd like to achieve. You may write in English, Tigrinya or Amharic." value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} /></label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-gold" />} {busy ? "Preparing summary…" : "Prepare my summary"}
            </button>
            {busy && <button type="button" onClick={() => ctrl.current?.abort()} className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground px-6 py-3 font-semibold"><Square className="h-4 w-4" /> Stop</button>}
          </div>
          <p className="text-xs text-muted-foreground">This summary is not legal advice. Information you enter is processed by AI to prepare the summary and is not stored.</p>
        </form>

        <div className="min-h-[24rem] border border-border bg-card p-6 md:p-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-crimson">Consultation summary</p>
          {!text && !error && !busy && <p className="text-muted-foreground">Your summary will appear here.</p>}
          {busy && !text && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Reviewing your description…</p>}
          {text && <Summary text={text} />}
          {error && <p className="mt-4 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {text && !busy && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-3 text-sm text-muted-foreground">Copy this summary, then call one of our advocates to book your consultation.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); }} className="inline-flex items-center gap-2 rounded-sm border border-foreground px-4 py-2 text-sm font-semibold"><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy summary"}</button>
                {lawyers.map((l) => <a key={l.phone} href={tel(l.phone)} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Phone className="h-4 w-4" /> {l.name.split(" ")[0]}</a>)}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
