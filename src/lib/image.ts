export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

/** Validates an image file. Returns an error message, or null when the file is fine. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return "Unsupported file type. Please upload a JPG, PNG or WEBP image.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 8 MB.`;
  }
  return null;
}

/**
 * Validates, downscales and compresses an image so pages stay fast.
 * Aspect ratio is always preserved.
 */
export async function fileToDataUrl(file: File, maxSize = 1400, quality = 0.82): Promise<string> {
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("That image could not be read. Try a different file.");
  });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image in this browser.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}
