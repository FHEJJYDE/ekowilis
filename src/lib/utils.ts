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
    return url.replace(/https:\/\/[a-zA-Z0-9-]+\.supabase\.co/gi, currentUrl) as unknown as T;
  }

  if (Array.isArray(url)) {
    return url.map((item) => sanitizeSupabaseUrl(item)) as unknown as T;
  }

  return url;
}
