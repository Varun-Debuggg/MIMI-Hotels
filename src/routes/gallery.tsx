import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ImagePortal } from "@/components/ImagePortal";
import { Reveal } from "@/components/RevealSection";
import a from "@/assets/hero-exterior.jpg";
import b from "@/assets/hero-lobby.jpg";
import c from "@/assets/hero-suite.jpg";
import d from "@/assets/hero-pool.jpg";
import e from "@/assets/hero-restaurant.jpg";
import f from "@/assets/hero-wedding.jpg";
import g from "@/assets/hero-night.jpg";
import h from "@/assets/hero-entrance.jpg";

const grid = [
  { src: a, span: "md:col-span-8 md:row-span-2", alt: "Exterior at golden hour" },
  { src: b, span: "md:col-span-4", alt: "The lobby" },
  { src: c, span: "md:col-span-4", alt: "The suite" },
  { src: d, span: "md:col-span-6", alt: "Infinity pool" },
  { src: e, span: "md:col-span-6", alt: "Dining" },
  { src: f, span: "md:col-span-8", alt: "Wedding hall" },
  { src: g, span: "md:col-span-4 md:row-span-2", alt: "Palace at night" },
  { src: h, span: "md:col-span-8", alt: "Entrance" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Mimi Hotels" },
      { name: "description", content: "An immersive gallery of Mimi Hotels — every room, every hour." },
      { property: "og:title", content: "Gallery — Mimi Hotels" },
      { property: "og:description", content: "An immersive photographic gallery." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <ImagePortal
          layers={[
            { src: a, eyebrow: "Gallery", title: "Every hour, a different house." },
            { src: b, eyebrow: "The Lobby", title: "Where guests become residents." },
            { src: c, eyebrow: "The Suite", title: "Draped in evening." },
            { src: g, eyebrow: "Night", title: "Lit from within." },
          ]}
        />

        <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <Reveal>
            <p className="eyebrow">The Archive</p>
            <h2 className="mt-6 font-display text-5xl text-ivory md:text-7xl">
              A quieter <em className="gradient-ember not-italic">catalogue.</em>
            </h2>
          </Reveal>

          <div className="mt-16 grid auto-rows-[320px] grid-cols-1 gap-4 md:grid-cols-12">
            {grid.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.1, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                whileHover={{ scale: 0.99 }}
                className={`group relative overflow-hidden rounded-sm ${g.span}`}
              >
                <motion.img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                />
                <div className="absolute inset-0 bg-obsidian/0 transition-colors duration-500 group-hover:bg-obsidian/30" />
                <div className="absolute bottom-4 left-4 translate-y-4 text-[10px] uppercase tracking-[0.28em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.alt}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
