import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Review = {
  id: string;
  guest_name: string | null;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
};

const EASE = [0.19, 1, 0.22, 1] as const;

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-3 w-3 ${i < n ? "fill-ember" : "fill-ivory/15"}`}
          aria-hidden
        >
          <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Each card drifts on its own axis and micro-rotation so no two animate the same.
  const seed = index % 6;
  const yShift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [seed % 2 ? 90 : -90, seed % 2 ? -90 : 90]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [seed * 0.6 - 1.5, -(seed * 0.6 - 1.5)]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.3]);

  // Break the grid on wider screens — offset every other card vertically.
  const offsetClass = seed % 2 ? "md:translate-y-24" : "";

  return (
    <motion.article
      ref={cardRef}
      style={{ y: yShift, rotate, opacity }}
      className={`group relative ${offsetClass}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: EASE, delay: (index % 3) * 0.12 }}
        className="glass-card relative overflow-hidden rounded-sm p-8 md:p-10"
      >
        {/* Ember accent that pulses on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
          style={{ background: "radial-gradient(closest-side, var(--ember), transparent)" }}
        />

        <div className="flex items-center justify-between">
          <Stars n={review.rating} />
          <span className="eyebrow text-[10px] text-foreground/40">
            {new Date(review.created_at).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {review.title ? (
          <h3 className="mt-6 font-display text-2xl leading-tight text-ivory md:text-3xl">
            "{review.title}"
          </h3>
        ) : null}

        <p className="mt-5 text-sm leading-relaxed text-foreground/70 md:text-[15px]">
          {review.body}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          <span className="font-display text-sm italic text-ivory/80">
            — {review.guest_name ?? "A guest"}
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function ReviewsWall() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  useEffect(() => {
    let alive = true;
    supabase
      .from("reviews")
      .select("id, guest_name, rating, title, body, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(9)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          setError("Reviews are resting.");
          return;
        }
        setReviews((data ?? []) as Review[]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-obsidian py-32 md:py-48"
      aria-labelledby="reviews-heading"
    >
      {/* Parallax backdrop wash */}
      <motion.div
        aria-hidden
        style={{ y: backdropY }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[120%]"
      >
        <div className="absolute left-1/2 top-24 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
             style={{ background: "radial-gradient(closest-side, var(--ember), transparent)" }} />
      </motion.div>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.header style={{ y: headingY }} className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Chapter · Voices</p>
          <h2
            id="reviews-heading"
            className="mt-6 font-display text-5xl text-ivory text-balance md:text-7xl"
          >
            What our <em className="gradient-ember not-italic">guests</em> remember.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-foreground/70">
            A wall of unedited notes, sent long after checkout — from the people
            who came, and stayed a little longer than they meant to.
          </p>
        </motion.header>

        <div className="mt-24">
          {reviews === null ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-card h-72 animate-pulse rounded-sm"
                  aria-hidden
                />
              ))}
            </div>
          ) : reviews.length === 0 || error ? (
            <p className="text-center text-sm text-foreground/50">
              {error ?? "The first stories are being written."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <ReviewCard key={r.id} review={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
