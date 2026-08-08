import { supabase } from "@/integrations/supabase/client";

/** Loosely-typed client for generic table CRUD in the admin panel. */
type LooseQuery = {
  select: (s: string) => {
    order: (c: string, o: { ascending: boolean }) => Promise<{ data: unknown; error: unknown }>;
  };
  insert: (v: Record<string, unknown>) => Promise<{ error: unknown }>;
  update: (v: Record<string, unknown>) => {
    eq: (c: string, v: string) => Promise<{ error: unknown }>;
  };
  delete: () => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
};

export const db = supabase as unknown as { from: (table: string) => LooseQuery };

export function errMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Something went wrong";
}
