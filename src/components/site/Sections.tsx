import {
  Award,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MessageCircle,
  Mic,
  Phone,
  Ruler,
  Sparkles,
  Star,
  Trophy,
  Users,
  ArrowRight,
  HardHat,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/site/Reveal";
import {
  type Achievement,
  type AcademicEntry,
  type Competition,
  type GalleryPhoto,
  type Profile,
  type Skill,
  telLink,
  waLink,
} from "@/lib/portfolio";

export type SectionState = { loading?: boolean | undefined; error?: unknown };

function SectionHeading({
  eyebrow,
  title,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  invert?: boolean;
}) {
  return (
    <Reveal className="mb-10 max-w-2xl sm:mb-14">
      <p className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
        <span className="inline-block h-px w-8 bg-accent pulse-line" />
        {eyebrow}
      </p>
      <h2
        className={`text-balance text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl ${
          invert ? "" : "text-gradient"
        }`}
      >
        {title}
      </h2>
      <div className="mt-5 h-[3px] w-28 gradient-amber rounded-full" />
    </Reveal>
  );
}

/** Renders loading / error / empty feedback. Returns null when there is content to show. */
function StateBlock({
  loading,
  error,
  empty,
  emptyText,
  rows = 3,
}: SectionState & { empty: boolean; emptyText: string; rows?: number }) {
  if (loading) {
    return (
      <div className="grid gap-4" aria-busy="true" aria-live="polite">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
        <span className="sr-only">Loading…</span>
      </div>
    );
  }
  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        This content could not be loaded right now. Please refresh the page.
      </p>
    );
  }
  if (empty) return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  return null;
}

function TrussPattern({ animate = false }: { animate?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 120"
      className="pointer-events-none w-full max-w-full text-accent/50"
    >
      <g stroke="currentColor" strokeWidth="1.5" fill="none" className={animate ? "draw-line" : ""}>
        <path d="M0 110 H400 M0 110 L50 20 L100 110 L150 20 L200 110 L250 20 L300 110 L350 20 L400 110" />
        <path d="M50 20 H350" />
      </g>
      <g fill="currentColor" className="text-accent">
        {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
          <circle key={x} cx={x} cy={110} r="2.5" opacity="0.7" />
        ))}
      </g>
    </svg>
  );
}

function Blueprints() {
  return (
    <>
      <div className="absolute inset-0 blueprint-lg opacity-70" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-3xl float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-24 h-[22rem] w-[22rem] rounded-full bg-cad/10 blur-3xl float-slow"
        style={{ animationDelay: "1.4s" }}
        aria-hidden="true"
      />
    </>
  );
}

export function Hero({ profile, skills }: { profile: Profile | null; skills: Skill[] }) {
  const interests = skills.slice(0, 6);
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-28">
      <Blueprints />
      <div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
      {/* rotating survey compass */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute right-[-6rem] top-24 hidden h-[26rem] w-[26rem] text-accent/15 spin-slow lg:block"
      >
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M100 4 V196 M4 100 H196 M30 30 L170 170 M170 30 L30 170" stroke="currentColor" strokeWidth="0.6" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <span
            className="rise inline-flex max-w-full items-center gap-2 rounded-full border border-accent/40 bg-card/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent backdrop-blur"
            style={{ ["--rise-delay" as string]: "60ms" }}
          >
            <HardHat className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {profile?.tagline || "Civil Engineering Student & Creative Enthusiast"}
            </span>
          </span>

          <h1
            className="rise mt-6 text-balance text-[2.5rem] font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ ["--rise-delay" as string]: "160ms" }}
          >
            <span className="text-gradient">{profile?.name || "MD Abu Hasnat Rakib"}</span>
          </h1>

          <div
            className="rise mt-5 flex items-center gap-3"
            style={{ ["--rise-delay" as string]: "240ms" }}
          >
            <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-accent to-transparent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cad">
              Structure • Stage • Story
            </span>
          </div>

          <p
            className="rise mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ ["--rise-delay" as string]: "320ms" }}
          >
            {profile?.bio}
          </p>

          {interests.length > 0 ? (
            <ul
              className="rise mt-7 flex flex-wrap gap-2"
              aria-label="Interests"
              style={{ ["--rise-delay" as string]: "400ms" }}
            >
              {interests.map((s) => (
                <li
                  key={s.id}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          ) : null}

          <div
            className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            style={{ ["--rise-delay" as string]: "480ms" }}
          >
            <Button asChild size="lg" className="group w-full glow-ring sm:w-auto">
              <a href="#academic">
                Explore My Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#contact">Contact Me</a>
            </Button>
          </div>

          <dl
            className="rise mt-12 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:max-w-lg sm:grid-cols-3 sm:gap-4"
            style={{ ["--rise-delay" as string]: "560ms" }}
          >
            {[
              { k: "Department", v: profile?.department },
              { k: "Level", v: profile?.semester },
              { k: "University", v: profile?.university },
            ].map((s) => (
              <div key={s.k} className="card-surface corner-marks card-hover min-w-0 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {s.k}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="rise relative mx-auto w-full max-w-[18rem] sm:max-w-sm"
          style={{ ["--rise-delay" as string]: "300ms" }}
        >
          <div
            className="absolute -inset-4 rounded-[1.75rem] border border-accent/30 float-slow"
            aria-hidden="true"
          />
          <div
            className="absolute -inset-8 rounded-[2.25rem] border border-dashed border-cad/20"
            aria-hidden="true"
          />
          <div className="card-surface corner-marks scanline noise relative overflow-hidden p-3 glow-ring">
            <div className="aspect-4/5 w-full overflow-hidden rounded-lg bg-secondary">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={`Portrait of ${profile.name}`}
                  className="h-full w-full object-cover object-top transition-transform duration-[1.2s] hover:scale-105"
                  width={640}
                  height={800}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="grid h-full w-full place-items-center px-6 text-center text-sm text-muted-foreground">
                  Upload a formal profile photo from the admin panel
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-1 pt-3 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Profile / 001
              </span>
              <span className="font-mono text-[10px] tracking-widest text-accent">CE • DIU</span>
            </div>
          </div>
          <div className="mt-6">
            <TrussPattern animate />
          </div>
        </div>
      </div>

      {/* scrolling technical marquee */}
      <div className="relative mt-16 overflow-hidden border-y border-border/60 bg-card/30 py-3">
        <div className="marquee-track gap-10">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10 pr-10">
              {["AutoCAD", "Truss Design", "Structural Analysis", "Public Speaking", "Stand-Up Comedy", "Video Editing", "Event Organizing", "Script Writing"].map(
                (t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
                  >
                    <Compass className="h-3.5 w-3.5 text-accent" />
                    {t}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About({
  profile,
  skills,
  loading,
  error,
}: { profile: Profile | null; skills: Skill[] } & SectionState) {
  const creative = skills.filter((s) => s.category === "Creative");
  const soft = skills.filter((s) => s.category === "Soft Skill");
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="About" title="Engineering precision, creative energy" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="card-surface corner-marks card-hover min-w-0 p-6 sm:p-8">
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {profile?.about}
            </p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { k: "Name", v: profile?.name },
                { k: "Department", v: profile?.department },
                { k: "University", v: profile?.university },
                { k: "Semester", v: profile?.semester },
              ].map((i) => (
                <div
                  key={i.k}
                  className="min-w-0 rounded-lg border border-border/70 bg-secondary/40 p-4 transition-colors hover:border-accent/50"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {i.k}
                  </dt>
                  <dd className="mt-1.5 font-semibold">{i.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="grid gap-6">
          <Reveal delay={120}>
            <div className="card-surface card-hover p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 shrink-0 text-accent" /> Passion &amp; Currently Doing
              </h3>
              <div className="mt-3">
                <StateBlock
                  loading={loading}
                  error={error}
                  empty={creative.length === 0}
                  emptyText="No creative skills added yet."
                  rows={1}
                />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {creative.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="card-surface card-hover p-6">
              <h3 className="flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4 shrink-0 text-accent" /> Soft Skills
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {soft.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
              {!loading && soft.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No soft skills added yet.</p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Academic({
  entries,
  skills,
  loading,
  error,
}: { entries: AcademicEntry[]; skills: Skill[] } & SectionState) {
  const technical = skills.filter((s) => s.category === "Technical");
  return (
    <section id="academic" className="relative overflow-hidden border-y border-border py-20 sm:py-28">
      <div className="absolute inset-0 blueprint opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Academic" title="Educational journey" />
        <StateBlock
          loading={loading}
          error={error}
          empty={entries.length === 0}
          emptyText="No academic history added yet."
        />
        {entries.length > 0 ? (
          <ol className="relative space-y-6 border-l-2 border-dashed border-accent/30 pl-7">
            {entries.map((e, i) => (
              <Reveal as="li" key={e.id} delay={i * 90} className="relative">
                <span className="absolute -left-[38px] top-6 grid h-5 w-5 place-items-center rounded-full border border-accent bg-background">
                  <span className="h-2 w-2 rounded-full bg-accent glow-ring" />
                </span>
                <div className="card-surface corner-marks card-hover min-w-0 p-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg gradient-amber text-primary-foreground">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                        {e.title}
                      </p>
                      <h3 className="mt-1.5 text-xl font-semibold leading-snug">{e.institution}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        ) : null}

        {technical.length > 0 ? (
          <>
            <Reveal>
              <h3 className="mt-16 mb-6 text-2xl font-bold tracking-tight">Technical Skills</h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technical.map((s, i) => (
                <Reveal key={s.id} delay={i * 70}>
                  <div className="card-surface corner-marks card-hover group flex min-w-0 items-center gap-4 p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg gradient-amber text-primary-foreground transition-transform duration-500 group-hover:rotate-[-8deg]">
                      <Ruler className="h-4 w-4" />
                    </span>
                    <span className="truncate font-medium">{s.name}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function StandUp({
  profile,
  skills,
  achievements,
}: {
  profile: Profile | null;
  skills: Skill[];
  achievements: Achievement[];
}) {
  const highlights = skills
    .filter((s) => s.category !== "Technical")
    .slice(0, 6)
    .map((s) => s.name);
  const topAchievement = achievements[0];
  return (
    <section id="standup" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 gradient-ink" aria-hidden="true" />
      <div className="absolute inset-0 blueprint-lg opacity-60" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="StandUP" title="A creative side beyond Civil Engineering" />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="min-w-0">
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {profile?.standup_text}
            </p>
            {topAchievement ? (
              <div className="mt-7 flex items-center gap-3 rounded-xl border border-accent/50 bg-accent/10 px-5 py-4 glow-ring">
                <Trophy className="h-5 w-5 shrink-0 text-accent" />
                <span className="min-w-0 text-sm font-semibold">{topAchievement.title}</span>
              </div>
            ) : null}
            <ul className="mt-7 flex flex-wrap gap-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-border bg-card/50 px-3 py-1 text-sm text-muted-foreground"
                >
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <div className="card-surface corner-marks card-hover min-w-0 p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                <Mic className="h-4 w-4" /> Content Creation
              </span>
              <h3 className="mt-4 text-3xl font-bold">{profile?.content_page_name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {profile?.content_page_desc}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 text-xs">
                {["Funny Content", "Comedy", "Informative Content"].map((c) => (
                  <li key={c} className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                    {c}
                  </li>
                ))}
              </ul>
              {profile?.content_page_url ? (
                <Button asChild className="group mt-7 w-full">
                  <a href={profile.content_page_url} target="_blank" rel="noreferrer noopener">
                    <Facebook className="h-4 w-4" /> Visit {profile.content_page_name} Page
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Achievements({
  achievements,
  competitions,
  loading,
  error,
}: {
  achievements: Achievement[];
  competitions: Competition[];
} & SectionState) {
  return (
    <section id="achievement" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Achievement" title="Milestones & competitions" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-5">
          <StateBlock
            loading={loading}
            error={error}
            empty={achievements.length === 0}
            emptyText="No achievements added yet."
            rows={2}
          />
          {achievements.map((a, i) => (
            <Reveal key={a.id} delay={i * 90}>
              <article className="card-surface corner-marks card-hover group min-w-0 overflow-hidden">
                {a.image_url ? (
                  <div className="overflow-hidden">
                    <img
                      src={a.image_url}
                      alt={a.title}
                      loading="lazy"
                      decoding="async"
                      className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex min-w-0 gap-4 p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15 text-accent transition-transform duration-500 group-hover:rotate-12">
                    <Award className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="card-surface corner-marks min-w-0 p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Star className="h-5 w-5 shrink-0 text-accent" /> Truss Competition Participation
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Designing and building trusses at national engineering competitions.
            </p>
            {!loading && competitions.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No competitions added yet.</p>
            ) : null}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {competitions.map((c) => (
                <li
                  key={c.id}
                  className="min-w-0 rounded-lg border border-border bg-secondary/40 px-4 py-3 transition-colors hover:border-accent/60"
                >
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">{c.detail}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <TrussPattern />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Gallery({ photos, loading, error }: { photos: GalleryPhoto[] } & SectionState) {
  const featured = photos.filter((p) => p.featured);
  return (
    <section id="gallery" className="relative overflow-hidden border-y border-border py-20 sm:py-28">
      <div className="absolute inset-0 blueprint opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Gallery" title="Moments & work" />
        <StateBlock
          loading={loading}
          error={error}
          empty={photos.length === 0}
          emptyText="No photos added yet."
          rows={2}
        />

        {featured.length > 0 ? (
          <div className="mb-10 grid gap-5 sm:grid-cols-2">
            {featured.slice(0, 2).map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <figure className="card-surface corner-marks card-hover group overflow-hidden p-0">
                  <div className="overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title || p.caption || "Featured photo"}
                      loading="lazy"
                      decoding="async"
                      className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-72"
                    />
                  </div>
                  <figcaption className="flex flex-wrap items-center gap-2 p-4">
                    <span className="rounded-full gradient-amber px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                      Featured
                    </span>
                    <span className="min-w-0 truncate font-semibold">{p.title || p.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : null}

        {photos.length > 0 ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {photos.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90} className="break-inside-avoid">
                <figure className="card-surface card-hover group overflow-hidden p-0">
                  <div className="overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title || p.caption || "Gallery photo"}
                      loading="lazy"
                      decoding="async"
                      className="w-full transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:transition-none"
                    />
                  </div>
                  {(p.title || p.caption) && (
                    <figcaption className="p-4">
                      {p.title ? <p className="font-semibold leading-snug">{p.title}</p> : null}
                      {p.caption ? (
                        <p className="mt-1 text-sm text-muted-foreground">{p.caption}</p>
                      ) : null}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Contact({ profile }: { profile: Profile | null }) {
  if (!profile) return null;
  const items = [
    { icon: Phone, label: "Phone", value: profile.phone, href: telLink(profile.phone) },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: profile.whatsapp,
      href: waLink(profile.whatsapp),
    },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  ].filter((i) => i.value);

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Contact" title="Let's build something together" />
      <div className="grid gap-5 sm:grid-cols-3">
        {items.map((i, idx) => (
          <Reveal key={i.label} delay={idx * 90}>
            <a
              href={i.href}
              target={i.label === "WhatsApp" ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="card-surface corner-marks card-hover group flex min-w-0 items-center gap-4 p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15 text-accent transition-transform duration-500 group-hover:scale-110">
                <i.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {i.label}
                </span>
                <span className="block truncate font-semibold">{i.value}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {profile.facebook ? (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={profile.facebook} target="_blank" rel="noreferrer noopener">
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </Button>
          ) : null}
          {profile.instagram ? (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={profile.instagram} target="_blank" rel="noreferrer noopener">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </Button>
          ) : null}
          {profile.content_page_url ? (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={profile.content_page_url} target="_blank" rel="noreferrer noopener">
                <Mic className="h-4 w-4" /> {profile.content_page_name}
              </a>
            </Button>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
