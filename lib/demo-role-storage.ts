import { parseDemoRole, type DemoRole } from "@/lib/demo-role";

const STORAGE_KEY = "template-demo-role";

export function readStoredDemoRole(): DemoRole | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseDemoRole(raw) : null;
  } catch {
    return null;
  }
}

export function writeStoredDemoRole(role: DemoRole): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
    /* ignore */
  }
}

export function clearStoredDemoRole(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
