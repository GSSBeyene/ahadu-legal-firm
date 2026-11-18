import { createFileRoute } from "@tanstack/react-router";
import { PageHero, areas } from "@/components/site";

export const Route = createFileRoute("/practice-areas")({
  head: () => ({
    meta: [
      { title: "Practice Areas — Ahadu Law Firm" },
      { name: "description", content: "Civil, criminal, family, business, labor and property law services from Ahadu Law Firm." },
      { property: "og:title", content: "Practice Areas — Ahadu Law Firm" },
      { property: "og:description", content: "Civil, criminal, family, business, labor and property law." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Areas,
});

function Areas() {
  return (
    <>
      <PageHero eyebrow="What we do" title="Practice areas" text="Broad experience across the matters that affect people and businesses most." />
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => (
            <div key={a.t} className="bg-card p-6 md:p-10 transition hover:bg-secondary">
              <span className="font-serif text-4xl text-gold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-2xl font-semibold md:text-3xl">{a.t}</h3>
              <p className="mt-3 text-muted-foreground">{a.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
