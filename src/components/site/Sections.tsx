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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 max-w-2xl sm:mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <div className="mt-4 h-px w-24 bg-accent" />
    </div>
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
      <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        This content could not be loaded right now. Please refresh the page.
      </p>
    );
  }
  if (empty) return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  return null;
}

function TrussPattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 120"
      className="pointer-events-none w-full max-w-full text-primary/15"
    >
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M0 110 H400 M0 110 L50 20 L100 110 L150 20 L200 110 L250 20 L300 110 L350 20 L400 110" />
        <path d="M50 20 H350" />
      </g>
    </svg>
  );
}

export function Hero({ profile, skills }: { profile: Profile | null; skills: Skill[] }) {
  const interests = skills.slice(0, 6);
  return (
    <section id="home" className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 blueprint opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="reveal min-w-0">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Ruler className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">
              {profile?.tagline || "Civil Engineering Student & Creative Enthusiast"}
            </span>
          </span>
          <h1 className="mt-5 text-balance text-[2rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {profile?.name || "MD Abu Hasnat Rakib"}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile?.bio}
          </p>

          {interests.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Interests">
              {interests.map((s) => (
                <li
                  key={s.id}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#academic">Explore My Work</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#contact">Contact Me</a>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:max-w-lg sm:grid-cols-3 sm:gap-4">
            {[
              { k: "Department", v: profile?.department },
              { k: "Level", v: profile?.semester },
              { k: "University", v: profile?.university },
            ].map((s) => (
              <div key={s.k} className="card-surface min-w-0 p-3">
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</dt>
                <dd className="mt-1 text-sm font-semibold leading-snug">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal relative mx-auto w-full max-w-[18rem] sm:max-w-sm">
          <div className="absolute -inset-3 rounded-3xl border border-accent/40" aria-hidden="true" />
          <div className="card-surface relative overflow-hidden p-3">
            <div className="aspect-4/5 w-full overflow-hidden rounded-lg bg-secondary">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={`Portrait of ${profile.name}`}
                  className="h-full w-full object-cover object-top"
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
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Profile
              </span>
              <span className="text-xs text-accent">CE • DIU</span>
            </div>
          </div>
          <div className="mt-4 opacity-80">
            <TrussPattern />
          </div>
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
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading eyebrow="About" title="Engineering precision, creative energy" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface min-w-0 p-5 sm:p-6 lg:col-span-2">
          <p className="text-pretty leading-relaxed text-muted-foreground">{profile?.about}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { k: "Name", v: profile?.name },
              { k: "Department", v: profile?.department },
              { k: "University", v: profile?.university },
              { k: "Semester", v: profile?.semester },
            ].map((i) => (
              <div key={i.k} className="min-w-0 rounded-lg bg-secondary/70 p-4">
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.k}</dt>
                <dd className="mt-1 font-semibold">{i.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-6">
          <div className="card-surface p-5 sm:p-6">
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
            <ul className="mt-3 flex flex-wrap gap-2">
              {creative.map((s) => (
                <li
                  key={s.id}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-5 sm:p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4 shrink-0 text-accent" /> Soft Skills
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {soft.map((s) => (
                <li
                  key={s.id}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                >
                  {s.name}
                </li>
              ))}
            </ul>
            {!loading && soft.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No soft skills added yet.</p>
            ) : null}
          </div>
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
    <section id="academic" className="border-y border-border bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Academic" title="Educational journey" />
        <StateBlock
          loading={loading}
          error={error}
          empty={entries.length === 0}
          emptyText="No academic history added yet."
        />
        {entries.length > 0 ? (
          <ol className="relative space-y-5 border-l border-border pl-6">
            {entries.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[31px] top-4 grid h-5 w-5 place-items-center rounded-full border border-accent bg-background">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <div className="card-surface min-w-0 p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {e.title}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold leading-snug">{e.institution}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {technical.length > 0 ? (
          <>
            <h3 className="mt-12 mb-5 text-xl font-bold tracking-tight sm:mt-14">
              Technical Skills
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technical.map((s) => (
                <div
                  key={s.id}
                  className="card-surface flex min-w-0 items-center gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md gradient-ink text-primary-foreground">
                    <Ruler className="h-4 w-4" />
                  </span>
                  <span className="truncate font-medium">{s.name}</span>
                </div>
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
    <section id="standup" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 gradient-ink" aria-hidden="true" />
      <div className="absolute inset-0 blueprint opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 text-primary-foreground sm:px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">StandUP</p>
        <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-4xl">
          A creative side beyond Civil Engineering
        </h2>
        <div className="mt-4 h-px w-24 bg-accent" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-w-0">
            <p className="max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
              {profile?.standup_text}
            </p>
            {topAchievement ? (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-accent/50 bg-background/10 px-4 py-3">
                <Trophy className="h-5 w-5 shrink-0 text-accent" />
                <span className="min-w-0 text-sm font-semibold">{topAchievement.title}</span>
              </div>
            ) : null}
            <ul className="mt-6 flex flex-wrap gap-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-primary-foreground/25 px-3 py-1 text-sm text-primary-foreground/85"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-xl border border-primary-foreground/20 bg-background/10 p-5 backdrop-blur-sm sm:p-6">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
              <Mic className="h-4 w-4" /> Content Creation
            </span>
            <h3 className="mt-3 text-2xl font-bold">{profile?.content_page_name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
              {profile?.content_page_desc}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs">
              {["Funny Content", "Comedy", "Informative Content"].map((c) => (
                <li key={c} className="rounded-full bg-background/15 px-3 py-1">
                  {c}
                </li>
              ))}
            </ul>
            {profile?.content_page_url ? (
              <Button asChild className="mt-6 w-full" variant="secondary">
                <a href={profile.content_page_url} target="_blank" rel="noreferrer noopener">
                  <Facebook className="h-4 w-4" /> Visit {profile.content_page_name} Page
                </a>
              </Button>
            ) : null}
          </div>
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
    <section id="achievement" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading eyebrow="Achievement" title="Milestones & competitions" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <StateBlock
            loading={loading}
            error={error}
            empty={achievements.length === 0}
            emptyText="No achievements added yet."
            rows={2}
          />
          {achievements.map((a) => (
            <article
              key={a.id}
              className="card-surface min-w-0 overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              {a.image_url ? (
                <img
                  src={a.image_url}
                  alt={a.title}
                  loading="lazy"
                  decoding="async"
                  className="h-44 w-full object-cover"
                />
              ) : null}
              <div className="flex min-w-0 gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Award className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="card-surface min-w-0 p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Star className="h-5 w-5 shrink-0 text-accent" /> Truss Competition Participation
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Designing and building trusses at national engineering competitions.
          </p>
          {!loading && competitions.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No competitions added yet.</p>
          ) : null}
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {competitions.map((c) => (
              <li
                key={c.id}
                className="min-w-0 rounded-lg border border-border bg-secondary/60 px-4 py-3"
              >
                <p className="truncate font-semibold">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <TrussPattern />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Gallery({ photos, loading, error }: { photos: GalleryPhoto[] } & SectionState) {
  const featured = photos.filter((p) => p.featured);
  return (
    <section id="gallery" className="border-y border-border bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Gallery" title="Moments & work" />
        <StateBlock
          loading={loading}
          error={error}
          empty={photos.length === 0}
          emptyText="No photos added yet."
          rows={2}
        />

        {featured.length > 0 ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {featured.slice(0, 2).map((p) => (
              <figure key={p.id} className="card-surface overflow-hidden p-0">
                <img
                  src={p.image_url}
                  alt={p.title || p.caption || "Featured photo"}
                  loading="lazy"
                  decoding="async"
                  className="h-56 w-full object-cover sm:h-64"
                />
                <figcaption className="flex flex-wrap items-center gap-2 p-4">
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                    Featured
                  </span>
                  <span className="min-w-0 truncate font-semibold">{p.title || p.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        {photos.length > 0 ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {photos.map((p) => (
              <figure
                key={p.id}
                className="card-surface group break-inside-avoid overflow-hidden p-0"
              >
                <img
                  src={p.image_url}
                  alt={p.title || p.caption || "Gallery photo"}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                {(p.title || p.caption) && (
                  <figcaption className="p-4">
                    {p.title ? <p className="font-semibold leading-snug">{p.title}</p> : null}
                    {p.caption ? (
                      <p className="mt-1 text-sm text-muted-foreground">{p.caption}</p>
                    ) : null}
                  </figcaption>
                )}
              </figure>
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
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading eyebrow="Contact" title="Let's talk" />
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((i) => (
          <a
            key={i.label}
            href={i.href}
            target={i.label === "WhatsApp" ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="card-surface flex min-w-0 items-center gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
              <i.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                {i.label}
              </span>
              <span className="block truncate font-semibold">{i.value}</span>
            </span>
          </a>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
    </section>
  );
}
