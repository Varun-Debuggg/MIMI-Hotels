import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/rooms", label: "Suites" },
  { to: "/restaurant", label: "Dining" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "The Story" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled ? "py-3 backdrop-blur-xl" : "py-6"
      }`}
      style={{
        background: scrolled
          ? "linear-gradient(180deg, oklch(0.10 0.01 60 / 0.75), oklch(0.10 0.01 60 / 0))"
          : "transparent",
      }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 font-display text-lg text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            M
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg tracking-wide text-foreground">
              Mimi Hotels
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              Jalalabad · Est. Timeless
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <Link
          to="/booking"
          className="btn-lux btn-lux-primary text-[10px]"
        >
          Reserve
        </Link>
      </div>
    </header>
  );
}
