export function parsePageTag<const T extends readonly string[]>(
  value: string | null | undefined,
  allowed: T,
  fallback: T[number]
): T[number] {
  if (!value) return fallback;
  return (allowed as readonly string[]).includes(value) ? (value as T[number]) : fallback;
}

