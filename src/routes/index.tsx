import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Nav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/SiteFooter";
import profileAsset from "@/assets/rakib-profile.jpg.asset.json";

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

const TITLE = "MD Abu Hasnat Rakib | Civil Engineering Student & Creative Enthusiast";
const DESCRIPTION =
  "Portfolio of MD Abu Hasnat Rakib — Civil Engineering student at Daffodil International University, truss competitor, stand-up comedian and content creator.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "MD Abu Hasnat Rakib",
          jobTitle: "Civil Engineering Student",
          affiliation: { "@type": "CollegeOrUniversity", name: "Daffodil International University" },
          knowsAbout: [
            "Civil Engineering",
            "Truss Making",
            "Stand-Up Comedy",
            "Video Editing",
            "Script Writing",
            "Public Speaking",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const profileQ = useQuery(profileQuery);
  const academicQ = useQuery(academicQuery);
  const skillsQ = useQuery(skillsQuery);
  const achievementsQ = useQuery(achievementsQuery);
  const competitionsQ = useQuery(competitionsQuery);
  const galleryQ = useQuery(galleryQuery);

  const profile = profileQ.data ?? null;
  const skills = skillsQ.data ?? [];
  const achievements = achievementsQ.data ?? [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Nav name={profile?.name ?? "MD Abu Hasnat Rakib"} logo={profile?.logo_url ?? profile?.photo_url ?? null} />
      <main>
        <Hero profile={profile} skills={skills} />
        <About
          profile={profile}
          skills={skills}
          loading={skillsQ.isLoading || profileQ.isLoading}
          error={skillsQ.error ?? profileQ.error}
        />
        <Academic
          entries={academicQ.data ?? []}
          skills={skills}
          loading={academicQ.isLoading}
          error={academicQ.error}
        />
        <StandUp profile={profile} skills={skills} achievements={achievements} />
        <Achievements
          achievements={achievements}
          competitions={competitionsQ.data ?? []}
          loading={achievementsQ.isLoading || competitionsQ.isLoading}
          error={achievementsQ.error ?? competitionsQ.error}
        />
        <Gallery
          photos={galleryQ.data ?? []}
          loading={galleryQ.isLoading}
          error={galleryQ.error}
        />
        <Contact profile={profile} />
      </main>
      <SiteFooter name={profile?.name ?? "MD Abu Hasnat Rakib"} />

    </div>
  );
}
