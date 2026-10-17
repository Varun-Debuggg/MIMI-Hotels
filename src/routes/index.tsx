import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ImagePortal } from "@/components/ImagePortal";
import { ReviewsWall } from "@/components/ReviewsWall";
import { Reveal } from "@/components/RevealSection";
import { LuxMarquee } from "@/components/Marquee";
import heroEntrance from "@/assets/hero-entrance.jpg";
import heroLobby from "@/assets/hero-lobby.jpg";
import heroSuite from "@/assets/hero-suite.jpg";
import heroPool from "@/assets/hero-pool.jpg";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroWedding from "@/assets/hero-wedding.jpg";
import heroNight from "@/assets/hero-night.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mimi Hotels — Timeless luxury in Jalalabad" },
      {
        name: "description",
        content:
          "A cinematic sanctuary in Shahjahanpur, Uttar Pradesh. Suites, dining, and celebrations, all shaped by unhurried hospitality.",
      },
      { property: "og:title", content: "Mimi Hotels — Timeless luxury in Jalalabad" },
      { property: "og:description", content: "A cinematic sanctuary in Shahjahanpur, Uttar Pradesh. Suites, dining, and celebrations, all shaped by unhurried hospitality." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />

        {/* Signature scroll story — image-into-image portal */}
        <ImagePortal
          layers={[
            {
              src: heroEntrance,
              eyebrow: "Chapter I · Arrival",
              title: "Step inside.",
              caption: "Brass doors, worn smooth by a thousand welcomes.",
            },
            {
              src: heroLobby,
              eyebrow: "Chapter II · The Lobby",
              title: "Held by candlelight.",
              caption: "A room built to slow the pulse.",
            },
            {
              src: heroSuite,
              eyebrow: "Chapter III · The Suite",
              title: "Where the day dissolves.",
              caption: "Silk, jasmine, and the last light on the garden wall.",
            },
            {
              src: heroPool,
              eyebrow: "Chapter IV · The Pool",
              title: "Dive into stillness.",
              caption: "The horizon, mirrored — twice a day, always different.",
            },
          ]}
        />

        <LuxMarquee />

        {/* Restaurant teaser */}
        <section className="relative overflow-hidden bg-obsidian py-32 md:py-48">
          <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 md:grid-cols-12 md:px-12">
            <Reveal className="md:col-span-5">
              <p className="eyebrow">Chapter V · The Table</p>
              <h2 className="mt-6 font-display text-5xl text-ivory md:text-7xl">
                Chef's table, <em className="gradient-ember not-italic">for four.</em>
              </h2>
              <p className="mt-8 max-w-md text-base leading-relaxed text-foreground/70">
                Twelve courses. One long evening. A menu that reads like a
                letter home — heirloom grains, single-origin ghee, and
                whatever the garden gave us that morning.
              </p>
              <Link to="/restaurant" className="btn-lux btn-lux-primary mt-10 inline-flex">
                See the menu
              </Link>
            </Reveal>
            <Reveal delay={0.2} className="md:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <motion.img
                  src={heroRestaurant}
                  alt="Chef's tasting menu, plated in candlelight"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                  width={1920}
                  height={1200}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-primary/20" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Wedding hall + night sky portal */}
        <ImagePortal
          layers={[
            {
              src: heroWedding,
              eyebrow: "Chapter VI · The Occasion",
              title: "Weddings, remembered.",
              caption: "A garden hall for the once-in-a-lifetime.",
            },
            {
              src: heroNight,
              eyebrow: "Chapter VII · Night",
              title: "The palace, at rest.",
              caption: "Lanterns lit, the world outside, forgotten.",
            },
          ]}
        />

        <ReviewsWall />

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-background py-40 text-center">
          <Reveal>
            <p className="eyebrow">Reserve</p>
            <h2 className="mx-auto mt-6 max-w-4xl font-display text-6xl text-ivory text-balance md:text-8xl">
              Your stay is <em className="gradient-ember not-italic">already</em> being remembered.
            </h2>
            <p className="mx-auto mt-8 max-w-lg text-base text-foreground/70">
              Rooms are limited, and the calendar fills in seasons.
              Reserve yours below.
            </p>
            <div className="mt-12 flex justify-center">
              <Link to="/booking" className="btn-lux btn-lux-primary">
                Begin your reservation →
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
