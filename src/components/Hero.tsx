import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroExterior from "@/assets/hero-exterior.jpg";

export function Hero() {
  return (
    <section className="relative flex h-screen min-h-[720px] w-full items-end overflow-hidden">
      {/* Background image with slow zoom */}
      <div className="absolute inset-0">
        <img
          src={heroExterior}
          alt="Mimi Hotels — cinematic exterior at golden hour"
          className="kenburns h-full w-full object-cover"
          width={1920}
          height={1200}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.08 0.01 60 / 0.55) 0%, oklch(0.08 0.01 60 / 0.15) 40%, oklch(0.08 0.01 60 / 0.95) 100%)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="drift absolute h-1 w-1 rounded-full bg-primary/60"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i * 0.7) % 12}s`,
              animationDuration: `${8 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      {/* Top eyebrow marker */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute inset-x-0 top-28 z-10 flex justify-center"
      >
        <div className="glass-card flex items-center gap-3 rounded-full px-5 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/80">
            Jalalabad · Uttar Pradesh
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-32 md:px-12 md:pb-40">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="eyebrow"
        >
          A house of quiet grandeur
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, filter: "blur(24px)", y: 40 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.6, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 font-display text-6xl leading-[0.95] text-ivory text-balance md:text-8xl lg:text-[9rem]"
        >
          Experience{" "}
          <em className="gradient-ember not-italic">timeless</em>{" "}
          luxury.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-8 max-w-xl font-display text-2xl italic text-foreground/70 md:text-3xl"
        >
          Where elegance meets comfort — an unhurried world, held together
          by candlelight, silk, and the slow arc of the sun.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <Link to="/booking" className="btn-lux btn-lux-primary group">
            Book your stay
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link to="/rooms" className="btn-lux group">
            Explore the experience
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ivory/50"
      >
        <span>Enter the world</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
