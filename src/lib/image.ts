export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB source file
const MAX_STORED_BYTES = 1_400_000; // ~1.4 MB encoded data URL

/** Validates an image file. Returns an error message, or null when the file is fine. */
export function validateImageFile(file: File): string | null {
  const type = file.type.toLowerCase();
  if (type && !type.startsWith("image/")) {
    return "That file is not an image. Please choose a photo (JPG, PNG, WEBP, HEIC).";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 25 MB.`;
  }
  return null;
}

async function decode(file: File): Promise<{ width: number; height: number; draw: CanvasImageSource; done: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return { width: bitmap.width, height: bitmap.height, draw: bitmap, done: () => bitmap.close() };
    } catch {
      /* fall through to <img> decoding (HEIC, exotic formats, older browsers) */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode-failed"));
      el.src = url;
    });
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      draw: img,
      done: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error(
      "That image could not be read by your browser (HEIC photos often fail). Please convert it to JPG or PNG and try again.",
    );
  }
}

/**
 * Validates, downscales and compresses an image so pages stay fast.
 * Aspect ratio is always preserved and the result is kept small enough to store.
 */
export async function fileToDataUrl(file: File, maxSize = 1400, quality = 0.82): Promise<string> {
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);

  const src = await decode(file);
  try {
    let size = maxSize;
    let q = quality;
    let out = "";
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const scale = Math.min(1, size / Math.max(src.width, src.height));
      const w = Math.max(1, Math.round(src.width * scale));
      const h = Math.max(1, Math.round(src.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not process image in this browser.");
      ctx.drawImage(src.draw, 0, 0, w, h);
      out = canvas.toDataURL("image/jpeg", q);
      if (out.length <= MAX_STORED_BYTES) break;
      q = Math.max(0.5, q - 0.12);
      size = Math.round(size * 0.8);
    }
    if (!out.startsWith("data:image/")) throw new Error("Could not process image in this browser.");
    return out;
  } finally {
    src.done();
  }
}
