import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeSupabaseUrl<T>(url: T): T {
  if (url === null || url === undefined) return url;
  
  const currentUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!currentUrl) return url;

  if (typeof url === "string") {
    let resolved = url.replace(/https:\/\/[a-zA-Z0-9-]+\.supabase\.co/gi, currentUrl);

    // Fall back to local public assets for known files that might be missing in the new storage bucket
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.16.02")) {
      return "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.02.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.16.03")) {
      return "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.03.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.16.05")) {
      return "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.05.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.16.06")) {
      return "/Willsons-college/WhatsApp Image 2026-07-05 at 15.16.06.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.18.36")) {
      return "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.18.36.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.19.27__1_") || resolved.includes("15.19.27%20(1)")) {
      return "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.27 (1).jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.19.27")) {
      return "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.27.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.19.28")) {
      return "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.28.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Image_2026-07-05_at_15.19.29")) {
      return "/NNSS-UMOPU/WhatsApp Image 2026-07-05 at 15.19.29.jpeg" as unknown as T;
    }
    if (resolved.includes("WhatsApp_Video_2026-07-05_at_15.19.19")) {
      return "/NNSS-UMOPU/WhatsApp Video 2026-07-05 at 15.19.19.mp4" as unknown as T;
    }

    return resolved as unknown as T;
  }

  if (Array.isArray(url)) {
    return url.map((item) => sanitizeSupabaseUrl(item)) as unknown as T;
  }

  return url;
}
