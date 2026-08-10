/** Lightweight field validators used by the admin forms. */

export type ValidateOptions = { optional?: string[] };

export function validateField(key: string, raw: unknown, options: ValidateOptions = {}): string | null {
  const value = typeof raw === "string" ? raw.trim() : "";
  const optional = options.optional ?? [];

  // Uploaded images are stored inline as data URLs — they are not text/links.
  if (value.startsWith("data:image/")) return null;

  if (key === "name" && !value && !optional.includes("name")) return "Name is required.";
  if (key === "title" && !value && !optional.includes("title")) return "Title is required.";

  if (key === "email" && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Enter a valid email address.";
  }

  if ((key === "phone" || key === "whatsapp") && value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) return "Enter a valid phone number.";
  }

  if (/(url|facebook|instagram)$/.test(key) && value) {
    try {
      const u = new URL(value);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("bad");
    } catch {
      return "Enter a full link starting with https://";
    }
  }

  if (value.length > 4000) return "This text is too long.";
  return null;
}

export function validateValues(
  values: Record<string, unknown>,
  keys: string[],
  options: ValidateOptions = {},
) {
  const errors: Record<string, string> = {};
  for (const key of keys) {
    const message = validateField(key, values[key], options);
    if (message) errors[key] = message;
  }
  return errors;
}
