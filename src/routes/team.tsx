import { useLanguage } from '@/components/language';
import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { PageHero, lawyers, tel } from "@/components/site";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Lawyers — Ahadu Law Firm" },
      { name: "description", content: "Meet Amanuel Kahsay, Destalem Hadush and Natan Hailay of Ahadu Law Firm." },
      { property: "og:title", content: "Our Lawyers — Ahadu Law Firm" },
      { property: "og:description", content: "Meet the advocates of Ahadu Law Firm." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Team,
});

function Team() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero eyebrow="ጠበቓታት · Advocates" title={t("Our lawyers")} text="Speak directly with the advocate who will handle your case." />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:py-20 md:grid-cols-3">
        {lawyers.map((l) => (
          <article key={l.phone}>
            <img src={l.photo} alt={l.name} className="aspect-square w-full object-cover" />
            <h2 className="mt-6 text-3xl font-semibold">{l.name}</h2>
            <p className="text-muted-foreground" style={{ fontFamily: "Noto Sans Ethiopic" }}>{l.ti}</p>
            <p className="mt-1 text-sm uppercase tracking-widest text-crimson">{t("Advocate")}</p>
            <a href={tel(l.phone)} className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90">
              <Phone className="h-4 w-4" /> {l.phone}
            </a>
          </article>
        ))}
      </section>
    </>
  );
}
