import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { defaultDemoRole, parseDemoRole, type DemoRole } from "@/lib/demo-role";

type SearchParamsInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | null
  | undefined;

export function getRoleFromSearchParams(
  searchParams: SearchParamsInput
): DemoRole {
  if (!searchParams) return defaultDemoRole;

  if (searchParams instanceof URLSearchParams) {
    return parseDemoRole(searchParams.get("role"));
  }

  const raw = searchParams.role;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return parseDemoRole(value ?? null);
}

/** `industry` と `role` を常に付与（既存クエリはマージ）。`extra` で追加クエリを付与。 */
export function withDemoQuery(
  href: string,
  industry: EnabledIndustryKey,
  role: DemoRole,
  extra?: Record<string, string>
): string {
  const hashIdx = href.indexOf("#");
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const qIdx = withoutHash.indexOf("?");
  const pathname = qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash;
  const search = qIdx >= 0 ? withoutHash.slice(qIdx + 1) : "";
  const params = new URLSearchParams(search);
  params.set("industry", industry);
  params.set("role", role);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      params.set(k, v);
    }
  }
  const qs = params.toString();
  return `${pathname}?${qs}${hash}`;
}
