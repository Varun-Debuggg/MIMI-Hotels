const words = [
  "Handcrafted hospitality",
  "Since forever",
  "Mimi Hotels",
  "A quieter luxury",
  "Jalalabad",
  "Uttar Pradesh",
];

export function LuxMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border/40 bg-obsidian/60 py-8">
      <div className="flex w-max marquee gap-16">
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <div key={i} className="flex items-center gap-16">
            <span className="font-display text-4xl italic text-foreground/80 md:text-6xl">
              {w}
            </span>
            <span className="text-primary text-3xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
