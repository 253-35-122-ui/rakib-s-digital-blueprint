import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import profileAsset from "@/assets/rakib-profile.jpg.asset.json";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "academic", label: "Academic" },
  { id: "standup", label: "StandUP" },
  { id: "achievement", label: "Achievement" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

/** Animated truss ribbon that spans the nav bar. */
function TrussRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full opacity-40"
      viewBox="0 0 1200 32"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="truss-stroke" fill="none" strokeWidth="1">
        <line x1="0" y1="31" x2="1200" y2="31" />
        <line x1="0" y1="1" x2="1200" y2="1" />
        {Array.from({ length: 20 }).map((_, i) => {
          const x = i * 60;
          return (
            <g key={i} style={{ ["--tri-delay" as string]: `${i * 90}ms` }} className="truss-tri">
              <line x1={x} y1="31" x2={x + 30} y2="1" />
              <line x1={x + 30} y1="1" x2={x + 60} y2="31" />
              <line x1={x} y1="31" x2={x} y2="1" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Nav({ name, logo }: { name: string; logo?: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md shadow-[0_10px_40px_-24px_oklch(0_0_0/0.9)]"
          : "bg-transparent"
      }`}
    >
      {/* survey tape / progress rail */}
      <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
        <div className="survey-tape absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="absolute inset-y-0 left-0 w-full origin-left transition-transform duration-150"
          style={{ background: "var(--gradient-amber)", transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </div>

      {/* blueprint wash + sweeping level line */}
      <div
        className={`pointer-events-none absolute inset-0 blueprint transition-opacity duration-500 ${
          scrolled ? "opacity-30" : "opacity-15"
        }`}
        aria-hidden="true"
      />
      <div className="beam" aria-hidden="true" />
      <TrussRibbon />

      <nav className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#home" className="group flex min-w-0 items-center gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center">
            <span
              className="absolute inset-0 rounded-md spin-slow border border-dashed border-accent/50"
              aria-hidden="true"
            />
            <img
              src={logo || profileAsset.url}
              alt={`${name} logo`}
              className="h-8 w-8 rounded-md object-cover ring-1 ring-border transition-transform duration-500 group-hover:scale-110"
              loading="eager"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">{name}</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground sm:block">
              Civil Eng · DIU
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              style={{ ["--rise-delay" as string]: `${i * 70}ms` }}
              className={`nav-node rise relative rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                active === l.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              data-active={active === l.id}
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-card corner-marks transition-colors hover:border-accent/60 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={`relative overflow-y-auto overscroll-contain border-t border-border bg-background shadow-lg transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[calc(100dvh-4rem)] opacity-100" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 blueprint opacity-30" aria-hidden="true" />
        <ul className="relative mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {links.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                style={{ ["--rise-delay" as string]: open ? `${i * 55}ms` : "0ms" }}
                className={`${open ? "rise" : ""} nav-node block rounded-md px-3 py-3 font-mono text-sm uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary`}
                data-active={active === l.id}
              >
                <span className="mr-2 text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
