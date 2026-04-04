import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { parseEnabledIndustryKey } from "@/lib/industry-profiles";

const STORAGE_KEY = "template-industry-profile";

export function readStoredIndustry(): EnabledIndustryKey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseEnabledIndustryKey(raw) : null;
  } catch {
    return null;
  }
}

export function writeStoredIndustry(industry: EnabledIndustryKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, industry);
  } catch {
    /* ignore */
  }
}

export function clearStoredIndustry(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
