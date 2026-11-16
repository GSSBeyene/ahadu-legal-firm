import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ahadu Law Firm" },
      { name: "description", content: "Learn about Ahadu Law Firm, its values and its commitment to the betterment of justice." },
      { property: "og:title", content: "About — Ahadu Law Firm" },
      { property: "og:description", content: "Our values and commitment to the betterment of justice." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Rooted in community. Committed to justice." text="Ahadu — meaning “one” — reflects our belief that everyone deserves equal, dedicated access to the law." />
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-2">
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>Ahadu Law Firm is a team of practicing advocates providing legal services to individuals, families and businesses.</p>
          <p>We listen first, explain your options plainly, and then fight for the best possible outcome — whether in negotiation, mediation or the courtroom.</p>
        </div>
        <dl className="grid grid-cols-2 gap-8">
          {[["3", "Dedicated advocates"], ["6+", "Practice areas"], ["1", "Mission: justice"], ["24/7", "Reachable by phone"]].map(([n, l]) => (
            <div key={l} className="border-t-2 border-gold pt-4">
              <dt className="font-serif text-5xl font-semibold">{n}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
