import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-obsidian pt-24 pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto grid max-w-[1600px] gap-16 px-6 md:grid-cols-4 md:px-12">
        <div className="md:col-span-2">
          <p className="eyebrow">Mimi Hotels</p>
          <h3 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
            A quieter kind of <em className="gradient-ember not-italic">luxury.</em>
          </h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Jalalabad, Shahjahanpur, Uttar Pradesh 242221. A house built on
            hospitality — where each arrival is remembered by name.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-5">Discover</p>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/rooms", label: "Suites & Pavilions" },
              { to: "/restaurant", label: "Dining" },
              { to: "/gallery", label: "Gallery" },
              { to: "/about", label: "Our Story" },
              { to: "/booking", label: "Reservations" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/70 transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Contact</p>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li>Jalalabad, Shahjahanpur</li>
            <li>Uttar Pradesh 242221, India</li>
            <li className="pt-2">reservations@mimihotels.in</li>
            <li>+91 · reserved on request</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-[1600px] flex-col items-start justify-between gap-4 border-t border-border/30 px-6 pt-8 text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:flex-row md:items-center md:px-12">
        <p>© {new Date().getFullYear()} Mimi Hotels · All rights reserved</p>
        <p>Crafted with intention</p>
      </div>
    </footer>
  );
}
