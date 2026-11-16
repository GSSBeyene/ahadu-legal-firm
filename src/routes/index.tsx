import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Handshake, Gavel } from "lucide-react";
import { LOGO, areas, lawyers, tel } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ahadu Law Firm — Betterment of Justice" },
      { name: "description", content: "Ahadu Law Firm offers trusted legal counsel in civil, criminal, family and business law in Ethiopia." },
      { property: "og:title", content: "Ahadu Law Firm — Betterment of Justice" },
      { property: "og:description", content: "Trusted legal counsel in civil, criminal, family and business law." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm text-crimson" style={{ fontFamily: "Noto Sans Ethiopic" }}>ኣሃዱ · ትካል ግልጋሎት ጥብቕና</p>
            <h1 className="mt-5 text-6xl font-semibold leading-[1.02] md:text-7xl">
              Justice, argued<br />with <em className="text-crimson">conviction.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Ahadu Law Firm stands beside individuals, families and businesses with honest advice and determined representation.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                Book a consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/practice-areas" className="inline-flex items-center rounded-sm border border-foreground px-6 py-3 font-semibold hover:bg-foreground hover:text-background">
                Our services
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -rotate-3 rounded-sm bg-gold/30" />
            <img src={LOGO} alt="Ahadu Law Firm logo" className="relative w-full rounded-sm shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
          {[
            { i: ShieldCheck, t: "Integrity", d: "Clear, honest advice on where you stand." },
            { i: Gavel, t: "Courtroom Strength", d: "Prepared, persuasive advocacy for every case." },
            { i: Handshake, t: "Personal Care", d: "Direct access to your lawyer by phone." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="flex gap-4">
              <I className="h-8 w-8 shrink-0 text-gold" />
              <div><h3 className="text-2xl">{t}</h3><p className="mt-1 text-sm text-primary-foreground/70">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-5xl font-semibold">Practice areas</h2>
          <Link to="/practice-areas" className="font-semibold text-crimson hover:underline">View all →</Link>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {areas.slice(0, 3).map((a, i) => (
            <div key={a.t} className="bg-card p-8">
              <span className="font-serif text-4xl text-gold">0{i + 1}</span>
              <h3 className="mt-4 text-2xl font-semibold">{a.t}</h3>
              <p className="mt-2 text-muted-foreground">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="text-5xl font-semibold">Meet our lawyers</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {lawyers.map((l) => (
              <div key={l.phone} className="group bg-card p-6 shadow-sm">
                <img src={l.photo} alt={l.name} className="aspect-square w-full object-cover grayscale transition group-hover:grayscale-0" />
                <h3 className="mt-5 text-2xl font-semibold">{l.name}</h3>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "Noto Sans Ethiopic" }}>{l.ti}</p>
                <a href={tel(l.phone)} className="mt-3 inline-block font-semibold text-crimson">{l.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
