import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/RevealSection";
import heroSuite from "@/assets/hero-suite.jpg";
import heroLobby from "@/assets/hero-lobby.jpg";
import heroEntrance from "@/assets/hero-entrance.jpg";

const roomImages: Record<string, string> = {
  "heritage-suite": heroSuite,
  "royal-pavilion": heroLobby,
  "garden-retreat": heroEntrance,
};

type Room = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  price_per_night: number;
  capacity: number;
  size_sqft: number | null;
  amenities: string[];
  image_url: string;
};

const roomsQuery = queryOptions({
  queryKey: ["rooms"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data as Room[];
  },
});

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Suites & Pavilions — Mimi Hotels" },
      {
        name: "description",
        content:
          "Three ways to stay. Each one, its own weather. Heritage Suite, Royal Pavilion, Garden Retreat — at Mimi Hotels, Jalalabad.",
      },
      { property: "og:title", content: "Suites & Pavilions — Mimi Hotels" },
      { property: "og:description", content: "Three ways to stay at Mimi Hotels." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(roomsQuery);
  },
  component: RoomsPage,
});

function RoomsPage() {
  const { data: rooms } = useSuspenseQuery(roomsQuery);
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-40 pb-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <Reveal>
            <p className="eyebrow">The Suites</p>
            <h1 className="mt-6 font-display text-6xl text-ivory md:text-8xl">
              Three ways <em className="gradient-ember not-italic">to stay.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base text-foreground/70">
              Each room is its own small world. Choose the one that best fits
              the shape of your visit.
            </p>
          </Reveal>

          <div className="mt-24 space-y-32">
            {rooms.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RoomCard({ room, index }: { room: Room; index: number }) {
  const [hover, setHover] = useState(false);
  const flip = index % 2 === 1;
  const img = roomImages[room.slug] ?? heroSuite;
  return (
    <Reveal delay={0.05}>
      <div
        className={`grid items-center gap-12 md:grid-cols-12 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
      >
        <motion.div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="relative aspect-[4/5] overflow-hidden rounded-sm md:col-span-7"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={img}
            alt={room.name}
            loading="lazy"
            className="h-full w-full object-cover"
            animate={{ scale: hover ? 1.1 : 1.02 }}
            transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
            width={1920}
            height={1200}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory/80">
            <span>0{index + 1}</span>
            <span className="h-px w-8 bg-primary" />
            <span>{room.size_sqft} sq ft</span>
          </div>
        </motion.div>

        <div className="md:col-span-5">
          <p className="eyebrow">Suite No. 0{index + 1}</p>
          <h2 className="mt-4 font-display text-5xl text-ivory md:text-6xl">
            {room.name}
          </h2>
          {room.tagline && (
            <p className="mt-3 font-display text-xl italic text-primary/90">
              {room.tagline}
            </p>
          )}
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            {room.description}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 text-xs uppercase tracking-[0.15em] text-foreground/60">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span className="h-px w-3 bg-primary" />
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-end justify-between border-t border-border/60 pt-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                From
              </p>
              <p className="mt-1 font-display text-4xl text-ivory">
                ₹{Number(room.price_per_night).toLocaleString("en-IN")}
                <span className="ml-2 text-sm text-muted-foreground">/ night</span>
              </p>
            </div>
            <Link
              to="/booking"
              search={{ room: room.slug }}
              className="btn-lux btn-lux-primary"
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
