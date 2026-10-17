import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type Layer = {
  src: string;
  eyebrow: string;
  title: string;
  caption?: string;
};

/**
 * Signature portal effect: as the viewport scrolls through the section,
 * a stack of images zooms one into another — like entering a photograph.
 * Section is `layers.length * 100vh` tall; each layer owns a segment.
 */
export function ImagePortal({ layers }: { layers: Layer[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${layers.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {layers.map((layer, i) => (
          <PortalLayer
            key={i}
            layer={layer}
            index={i}
            total={layers.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function PortalLayer({
  layer,
  index,
  total,
  progress,
}: {
  layer: Layer;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each layer occupies a segment; when the segment enters, it scales from
  // a small "portal" hole up to fullscreen, then the next layer takes over.
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const isFirst = index === 0;

  // Scale: starts tiny (portal) unless it's the first, ends fullscreen, then
  // continues zooming past 1 as we move to next layer to create the "into" feel.
  const scale = useTransform(
    progress,
    [start, end, Math.min(end + segment * 0.6, 1)],
    isFirst ? [1, 1.4, 3.2] : [0.08, 1.2, 3.6]
  );

  const opacity = useTransform(
    progress,
    [
      Math.max(start - segment * 0.15, 0),
      start + segment * 0.1,
      end,
      Math.min(end + segment * 0.35, 1),
    ],
    isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0]
  );

  const blur = useTransform(
    progress,
    [start, start + segment * 0.15, end - segment * 0.15, end],
    ["8px", "0px", "0px", "6px"]
  );

  const textY = useTransform(progress, [start, end], [40, -40]);
  const textOpacity = useTransform(
    progress,
    [start, start + segment * 0.2, end - segment * 0.2, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, zIndex: index + 1 }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden"
        style={{ scale, filter: blur.get() ? `blur(${blur.get()})` : undefined }}
      >
        <motion.img
          src={layer.src}
          alt={layer.title}
          className="h-full w-full object-cover"
          style={{ filter: "saturate(1.05) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-veil)" }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <p className="eyebrow">{layer.eyebrow}</p>
        <h2 className="mt-4 font-display text-5xl text-ivory text-balance md:text-7xl lg:text-8xl">
          {layer.title}
        </h2>
        {layer.caption && (
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
            {layer.caption}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
