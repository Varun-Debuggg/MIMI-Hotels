import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/RevealSection";
import heroRestaurant from "@/assets/hero-restaurant.jpg";

const menu = [
  { course: "I", name: "Amuse", body: "Charcoal-smoked ghee, kokum pearl, warm milk skin." },
  { course: "II", name: "Cold", body: "Sun-ripened melon, black salt, curry leaf oil." },
  { course: "III", name: "Grain", body: "Ancient red rice, aged coconut, brown butter." },
  { course: "IV", name: "Garden", body: "Tandoor-charred greens, jaggery vinegar, walnut cream." },
  { course: "V", name: "Fire", body: "Slow lamb, saffron jus, bone marrow toast." },
  { course: "VI", name: "Sweet", body: "Rose kulfi, cardamom shortbread, saffron honey." },
];

export const Route = createFileRoute("/restaurant")({
  head: () => ({
    meta: [
      { title: "Dining — Mimi Hotels" },
      {
        name: "description",
        content:
          "A chef's table of twelve courses at Mimi Hotels. Heirloom ingredients, candlelight, and a menu that reads like a letter home.",
      },
      { property: "og:title", content: "Dining — Mimi Hotels" },
      { property: "og:description", content: "A chef's table of twelve courses." },
    ],
  }),
  component: RestaurantPage,
});

function RestaurantPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-40 pb-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-6">
              <Reveal>
                <p className="eyebrow">The Table</p>
                <h1 className="mt-6 font-display text-6xl text-ivory md:text-8xl">
                  A menu that <em className="gradient-ember not-italic">reads like a letter.</em>
                </h1>
                <p className="mt-8 max-w-md text-base leading-relaxed text-foreground/70">
                  Six seatings a night. Twelve courses. Each plate touched by
                  what the garden gave us that morning, and only that.
                </p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/70">
                  Served 7pm — later, if you like.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="md:col-span-6">
              <motion.div
                initial={{ scale: 1.15, filter: "blur(20px)" }}
                whileInView={{ scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                className="aspect-[4/5] overflow-hidden rounded-sm"
              >
                <img
                  src={heroRestaurant}
                  alt="Candlelit dining room, single plated course"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  width={1920}
                  height={1200}
                />
              </motion.div>
            </Reveal>
          </div>

          <div className="mt-32">
            <Reveal>
              <p className="eyebrow text-center">The Six Movements</p>
            </Reveal>
            <ul className="mx-auto mt-16 max-w-3xl">
              {menu.map((m, i) => (
                <Reveal key={m.course} delay={i * 0.06}>
                  <li className="group flex items-baseline gap-8 border-b border-border/40 py-8 transition-all duration-500 hover:border-primary/60 hover:pl-4">
                    <span className="font-display text-3xl text-primary/70 md:text-4xl">
                      {m.course}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-3xl text-ivory md:text-4xl">
                        {m.name}
                      </h3>
                      <p className="mt-2 text-sm italic text-foreground/60">
                        {m.body}
                      </p>
                    </div>
                    <span className="text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      ✦
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
