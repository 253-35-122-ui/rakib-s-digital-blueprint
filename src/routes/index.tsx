import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Nav } from "@/components/site/Nav";
import {
  About,
  Academic,
  Achievements,
  Contact,
  Gallery,
  Hero,
  StandUp,
} from "@/components/site/Sections";
import {
  academicQuery,
  achievementsQuery,
  competitionsQuery,
  galleryQuery,
  profileQuery,
  skillsQuery,
} from "@/lib/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MD Abu Hasnat Rakib | Civil Engineering Student & Creative Enthusiast" },
      {
        name: "description",
        content:
          "Portfolio of MD Abu Hasnat Rakib — Civil Engineering student at Daffodil International University, truss competitor, stand-up comedian and content creator.",
      },
      {
        property: "og:title",
        content: "MD Abu Hasnat Rakib | Civil Engineering Student & Creative Enthusiast",
      },
      {
        property: "og:description",
        content:
          "Civil Engineering, truss competitions, public speaking, stand-up comedy and content creation.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const profile = useQuery(profileQuery).data ?? null;
  const academic = useQuery(academicQuery).data ?? [];
  const skills = useQuery(skillsQuery).data ?? [];
  const achievements = useQuery(achievementsQuery).data ?? [];
  const competitions = useQuery(competitionsQuery).data ?? [];
  const gallery = useQuery(galleryQuery).data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Nav name={profile?.name ?? "MD Abu Hasnat Rakib"} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} skills={skills} />
        <Academic entries={academic} skills={skills} />
        <StandUp profile={profile} skills={skills} />
        <Achievements achievements={achievements} competitions={competitions} />
        <Gallery photos={gallery} />
        <Contact profile={profile} />
      </main>
      <footer className="border-t border-border py-8">
        <p className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {profile?.name ?? "MD Abu Hasnat Rakib"} · Civil Engineering,
          Daffodil International University
        </p>
      </footer>
    </div>
  );
}
