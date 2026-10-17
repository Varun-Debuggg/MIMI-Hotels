import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/RevealSection";
import heroExterior from "@/assets/hero-exterior.jpg";

const timeline = [
  { year: "1962", title: "A single guesthouse", body: "The Mimi family opens seven rooms above the old bakery on Jalalabad's main road." },
  { year: "1988", title: "The garden hall", body: "A wedding hall is built in the courtyard for a niece's marriage — and never taken down." },
  { year: "2004", title: "The pavilion wing", body: "Three private pavilions rise around the new reflecting pool." },
  { year: "2021", title: "The chef's table", body: "A twelve-course tasting menu debuts, drawing regulars from Delhi and Lucknow." },
  { year: "Today", title: "A quieter luxury", body: "One family. Three generations. The same idea, unhurried." },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Story — Mimi Hotels" },
      { name: "description", content: "Three generations of unhurried hospitality in Jalalabad, Uttar Pradesh." },
      { property: "og:title", content: "The Story — Mimi Hotels" },
      { property: "og:description", content: "Three generations. One idea." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-40 pb-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="grid gap-16 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <p className="eyebrow">The Story</p>
              <h1 className="mt-6 font-display text-6xl text-ivory md:text-8xl">
                Three generations, <em className="gradient-ember not-italic">one idea.</em>
              </h1>
              <p className="mt-10 max-w-xl text-lg leading-relaxed text-foreground/75">
                Mimi Hotels began, as most beautiful things do, with a small
                room and a good meal. We have grown carefully since — never
                further than we could reach with both hands. Everything you
                see was chosen; nothing was resourced.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="md:col-span-5">
              <div className="aspect-[3/4] overflow-hidden rounded-sm">
                <img src={heroExterior} alt="Mimi Hotels exterior" loading="lazy"
                     className="h-full w-full object-cover" width={1920} height={1200} />
              </div>
            </Reveal>
          </div>

          <div className="mt-32">
            <Reveal><p className="eyebrow text-center">A slow history</p></Reveal>
            <ol className="mx-auto mt-16 max-w-3xl">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.08}>
                  <li className="relative border-l border-border/60 pb-16 pl-8 last:pb-0">
                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary shadow-glow" />
                    <p className="font-display text-3xl text-primary/90">{t.year}</p>
                    <h3 className="mt-2 font-display text-2xl text-ivory">{t.title}</h3>
                    <p className="mt-3 max-w-lg text-sm italic text-foreground/60">{t.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
