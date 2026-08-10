import { useEffect, useRef, useState } from "react";

const CREDIT = "Sadman Nahial Nafi";

/**
 * Futuristic, software-engineering inspired credit footer:
 * circuit grid, scanning beam, terminal-style typed name, glitch on hover.
 */
export function SiteFooter({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStart(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStart(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(CREDIT.slice(0, i));
      if (i >= CREDIT.length) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [start]);

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 blueprint opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 circuit opacity-60" aria-hidden="true" />
      <div className="beam" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            © {new Date().getFullYear()} {name}
          </p>
          <p className="text-sm text-muted-foreground">
            Civil Engineering · Daffodil International University
          </p>

          <div
            ref={ref}
            className="relative rounded-xl border border-border/80 bg-card/60 px-6 py-4 backdrop-blur-md corner-marks"
          >
            <span
              className="pointer-events-none absolute inset-x-6 -top-px h-px pulse-line"
              style={{ background: "var(--gradient-cad)" }}
              aria-hidden="true"
            />
            <p className="flex flex-wrap items-baseline justify-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Developed By
              </span>
              <a
                href="https://bd.linkedin.com/in/sadman-nahial-nafi"
                target="_blank"
                rel="noopener noreferrer"
                data-text={CREDIT}
                className="glitch inline-flex items-baseline font-display text-lg font-bold tracking-tight text-gradient sm:text-xl"
              >
                {typed || "\u00A0"}
                <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-accent" />
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
