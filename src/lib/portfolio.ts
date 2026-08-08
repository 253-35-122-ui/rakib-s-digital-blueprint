import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string;
  tagline: string;
  department: string;
  university: string;
  semester: string;
  bio: string;
  about: string;
  standup_text: string;
  content_page_name: string;
  content_page_url: string;
  content_page_desc: string;
  photo_url: string | null;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
};

export type AcademicEntry = {
  id: string;
  title: string;
  institution: string;
  detail: string;
  display_order: number;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  display_order: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  display_order: number;
};

export type Competition = {
  id: string;
  name: string;
  detail: string;
  display_order: number;
};

export type GalleryPhoto = {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  featured: boolean;
  display_order: number;
};

async function ordered<T>(table: string): Promise<T[]> {
  const { data, error } = await (supabase as unknown as {
    from: (t: string) => {
      select: (s: string) => {
        order: (
          c: string,
          o: { ascending: boolean },
        ) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .from(table)
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}


export const profileQuery = {
  queryKey: ["profile"],
  queryFn: async (): Promise<Profile | null> => {
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },
};

export const academicQuery = {
  queryKey: ["academic_entries"],
  queryFn: () => ordered<AcademicEntry>("academic_entries"),
};
export const skillsQuery = { queryKey: ["skills"], queryFn: () => ordered<Skill>("skills") };
export const achievementsQuery = {
  queryKey: ["achievements"],
  queryFn: () => ordered<Achievement>("achievements"),
};
export const competitionsQuery = {
  queryKey: ["competitions"],
  queryFn: () => ordered<Competition>("competitions"),
};
export const galleryQuery = {
  queryKey: ["gallery_photos"],
  queryFn: () => ordered<GalleryPhoto>("gallery_photos"),
};

export const usePortfolio = () => ({
  profile: useQuery(profileQuery).data ?? null,
  academic: useQuery(academicQuery).data ?? [],
  skills: useQuery(skillsQuery).data ?? [],
  achievements: useQuery(achievementsQuery).data ?? [],
  competitions: useQuery(competitionsQuery).data ?? [],
  gallery: useQuery(galleryQuery).data ?? [],
});

export function telLink(n: string) {
  return `tel:${n.replace(/\s+/g, "")}`;
}

export function waLink(n: string) {
  const digits = n.replace(/\D/g, "");
  const intl = digits.startsWith("880") ? digits : `880${digits.replace(/^0/, "")}`;
  return `https://wa.me/${intl}`;
}
