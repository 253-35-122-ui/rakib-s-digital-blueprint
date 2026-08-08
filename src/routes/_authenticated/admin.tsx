import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  GraduationCap,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mic,
  Phone,
  Save,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CrudSection, ImageField } from "@/components/admin/CrudSection";
import { db, errMessage } from "@/lib/db";
import { profileQuery, type Profile } from "@/lib/portfolio";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | MD Abu Hasnat Rakib" },
      { name: "description", content: "Manage portfolio content, gallery and contact details." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard" },
      { property: "og:description", content: "Manage portfolio content." },
    ],
  }),
  component: AdminPage,
});

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "standup", label: "StandUP", icon: Mic },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "competitions", label: "Truss Competitions", icon: Trophy },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "contact", label: "Contact & Social", icon: Phone },
] as const;

type SectionId = (typeof nav)[number]["id"];

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [section, setSection] = useState<SectionId>("dashboard");

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <h1 className="truncate text-base font-bold tracking-tight">Portfolio Admin</h1>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="h-4 w-4" /> <span className="hidden sm:inline">View site</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium ${
                section === n.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <ul className="sticky top-24 space-y-1">
            {nav.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setSection(n.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    section === n.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <n.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{n.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0">
          {section === "dashboard" && <Dashboard />}
          {section === "profile" && <ProfileForm variant="profile" />}
          {section === "standup" && <ProfileForm variant="standup" />}
          {section === "contact" && <ProfileForm variant="contact" />}
          {section === "academic" && (
            <CrudSection
              table="academic_entries"
              title="Academic entries"
              description="University, HSC, SSC and any other education."
              defaults={{ title: "", institution: "", detail: "" }}
              fields={[
                { key: "title", label: "Label (e.g. University)" },
                { key: "institution", label: "Institution" },
                { key: "detail", label: "Details", type: "textarea" },
              ]}
            />
          )}
          {section === "skills" && (
            <CrudSection
              table="skills"
              title="Skills"
              description="Category must be Technical, Soft Skill or Creative."
              defaults={{ name: "", category: "Technical" }}
              fields={[
                { key: "name", label: "Skill name" },
                { key: "category", label: "Category", placeholder: "Technical / Soft Skill / Creative" },
              ]}
            />
          )}
          {section === "achievements" && (
            <CrudSection
              table="achievements"
              title="Achievements"
              description="Awards and recognitions shown on the public site."
              defaults={{ title: "", description: "", image_url: null }}
              fields={[
                { key: "title", label: "Title" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "image_url", label: "Image", type: "image" },
              ]}
            />
          )}
          {section === "competitions" && (
            <CrudSection
              table="competitions"
              title="Truss competitions"
              description="Universities where truss competitions were attended."
              defaults={{ name: "", detail: "Truss competition participant" }}
              fields={[
                { key: "name", label: "University / Competition" },
                { key: "detail", label: "Detail" },
              ]}
            />
          )}
          {section === "gallery" && (
            <CrudSection
              table="gallery_photos"
              title="Gallery"
              description="Upload photos, set captions, mark featured and control the order."
              defaults={{ title: "", caption: "", image_url: "", featured: false }}
              fields={[
                { key: "image_url", label: "Photo", type: "image" },
                { key: "title", label: "Title" },
                { key: "caption", label: "Caption" },
                { key: "featured", label: "Featured photo", type: "switch" },
              ]}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Dashboard() {
  const counts = [
    { label: "Gallery Photos", table: "gallery_photos" },
    { label: "Achievements", table: "achievements" },
    { label: "Skills", table: "skills" },
    { label: "Competitions", table: "competitions" },
  ];
  return (
    <section>
      <h2 className="mb-5 text-xl font-bold tracking-tight">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.map((c) => (
          <StatCard key={c.table} label={c.label} table={c.table} />
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Every change you save here appears instantly on the public portfolio.
      </p>
    </section>
  );
}

function StatCard({ label, table }: { label: string; table: string }) {
  const { data } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await db
        .from(table)
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw new Error(errMessage(error));
      return (data ?? []) as unknown[];
    },
  });
  return (
    <div className="card-surface p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-black">{data?.length ?? 0}</p>
    </div>
  );
}

type PField = { key: string; label: string; type?: "textarea" | "image" };

const groups: Record<string, PField[]> = {
  profile: [
    { key: "name", label: "Name" },
    { key: "tagline", label: "Tagline" },
    { key: "department", label: "Department" },
    { key: "university", label: "University" },
    { key: "semester", label: "Semester" },
    { key: "bio", label: "Hero intro", type: "textarea" as const },
    { key: "about", label: "About text", type: "textarea" as const },
    { key: "photo_url", label: "Profile photo", type: "image" as const },
  ],
  standup: [
    { key: "standup_text", label: "Stand-up section text", type: "textarea" as const },
    { key: "content_page_name", label: "Content page name" },
    { key: "content_page_url", label: "Content page link" },
    { key: "content_page_desc", label: "Content page description", type: "textarea" as const },
  ],
  contact: [
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" },
    { key: "facebook", label: "Facebook profile" },
    { key: "instagram", label: "Instagram" },
    { key: "content_page_url", label: "Content page link" },
  ],
};

function ProfileForm({ variant }: { variant: keyof typeof groups }) {
  const qc = useQueryClient();
  const { data } = useQuery(profileQuery);
  const [edits, setEdits] = useState<Record<string, unknown>>({});

  const save = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error("Profile not loaded yet");
      const { error } = await db.from("profile").update(edits).eq("id", data.id);
      if (error) throw new Error(errMessage(error));
    },
    onSuccess: () => {
      toast.success("Saved");
      setEdits({});
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const value = (key: string) =>
    (key in edits ? edits[key] : (data as unknown as Record<string, unknown> | null)?.[key]) ?? "";

  if (!data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const titleMap: Record<string, string> = {
    profile: "Profile",
    standup: "StandUP & content page",
    contact: "Contact & social links",
  };

  return (
    <section>
      <h2 className="mb-5 text-xl font-bold tracking-tight">{titleMap[variant]}</h2>
      <div className="card-surface grid gap-4 p-5 sm:grid-cols-2">
        {groups[variant].map((f) => {
          if (f.type === "image") {
            return (
              <div key={f.key} className="sm:col-span-2">
                <ImageField
                  label={f.label}
                  value={(value(f.key) as string) || null}
                  onChange={(v) => setEdits({ ...edits, [f.key]: v })}
                />
              </div>
            );
          }
          if (f.type === "textarea") {
            return (
              <div key={f.key} className="space-y-2 sm:col-span-2">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Textarea
                  id={f.key}
                  rows={4}
                  value={value(f.key) as string}
                  onChange={(e) => setEdits({ ...edits, [f.key]: e.target.value })}
                />
              </div>
            );
          }
          return (
            <div key={f.key} className="space-y-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                value={value(f.key) as string}
                onChange={(e) => setEdits({ ...edits, [f.key]: e.target.value })}
              />
            </div>
          );
        })}
        <div className="sm:col-span-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </div>
    </section>
  );
}

export type { Profile };
