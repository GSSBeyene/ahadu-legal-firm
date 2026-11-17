import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, Scale } from "lucide-react";
import logo from "@/assets/logo.jpg.asset.json";
import amanuelImg from "@/assets/lawyer-amanuel.jpg";
import destalemImg from "@/assets/lawyer-destalem.jpg";
import natanImg from "@/assets/lawyer-natan.jpg";

export const LOGO = logo.url;

export const lawyers = [
  { name: "Amanuel Kahsay", ti: "ኣማኑኤል ካሕሳይ", phone: "+251 914 837 542", photo: amanuelImg },
  { name: "Destalem Hadush", ti: "ደስታኣለም ሓዱሽ", phone: "+251 913 689 702", photo: destalemImg },
  { name: "Natan Hailay", ti: "ናታን ሃይላይ", phone: "+251 914 428 841", photo: natanImg },
];

export const tel = (p: string) => `tel:+${p.replace(/\D/g, "")}`;

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/practice-areas", label: "Practice Areas" },
  { to: "/team", label: "Our Lawyers" },
  { to: "/consultation", label: "Describe Your Case" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-gold">
            <Scale className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-2xl font-bold tracking-wide">AHADU</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Law Firm</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground underline decoration-gold decoration-2 underline-offset-8" }}>
              {n.label}
            </Link>
          ))}
          <a href={tel(lawyers[0]!.phone)} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Phone className="h-4 w-4" /> Call us
          </a>
        </nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-6 py-4 lg:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-medium">{n.label}</Link>
          ))}
          <a href={tel(lawyers[0]!.phone)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
            <Phone className="h-4 w-4" /> Call us
          </a>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-3xl font-bold">AHADU</p>
          <p className="mt-1 text-sm text-gold" style={{ fontFamily: "Noto Sans Ethiopic" }}>ትካል ግልጋሎት ጥብቕና</p>
          <p className="mt-4 text-sm text-primary-foreground/70">Betterment of Justice.</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">Call a lawyer</p>
          <ul className="space-y-2 text-sm">
            {lawyers.map((l) => (
              <li key={l.phone}><a href={tel(l.phone)} className="hover:text-gold">{l.name} — {l.phone}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">Explore</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-gold">{n.label}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} Ahadu Law Firm. All rights reserved.
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base md:mt-6 md:text-lg text-muted-foreground">{text}</p>
      </div>
    </section>
  );
}

export const areas = [
  { t: "Civil Litigation", d: "Representation in property, contract and civil disputes before all levels of court." },
  { t: "Criminal Defense", d: "Firm, informed defense protecting your rights from investigation through appeal." },
  { t: "Family & Inheritance", d: "Divorce, custody, marriage agreements, wills and succession matters." },
  { t: "Business & Commercial", d: "Company formation, contracts, licensing and commercial dispute resolution." },
  { t: "Labor & Employment", d: "Advice and representation for employees and employers in workplace matters." },
  { t: "Land & Property", d: "Title, lease, transfer and land-related claims handled with care." },
];
