import { useLanguage } from '@/components/language';
import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { PageHero, lawyers, tel } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ahadu Law Firm" },
      { name: "description", content: "Call Ahadu Law Firm to book a legal consultation." },
      { property: "og:title", content: "Contact — Ahadu Law Firm" },
      { property: "og:description", content: "Call us to book a legal consultation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero eyebrow="Get in touch" title={t("Book a consultation")} text="Call any of our advocates directly. We'll listen to your situation and advise you on the next step." />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:py-20 md:grid-cols-3">
        {lawyers.map((l) => (
          <a key={l.phone} href={tel(l.phone)} className="group flex min-w-0 items-center gap-4 border border-border bg-card p-6 transition hover:border-gold hover:shadow-lg">
            <img src={l.photo} alt={l.name} className="h-16 w-16 shrink-0 rounded-full object-cover md:h-20 md:w-20" />
            <div>
              <p className="font-serif text-2xl font-semibold">{l.name}</p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-crimson"><Phone className="h-4 w-4" /> {l.phone}</p>
            </div>
          </a>
        ))}
      </section>
    </>
  );
}
