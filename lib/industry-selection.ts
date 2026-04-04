import {
  defaultIndustryKey,
  parseEnabledIndustryKey,
  type EnabledIndustryKey,
} from "@/lib/industry-profiles";

type SearchParamsInput =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | null
  | undefined;

export function getIndustryFromSearchParams(
  searchParams: SearchParamsInput
): EnabledIndustryKey {
  if (!searchParams) return defaultIndustryKey;

  if (searchParams instanceof URLSearchParams) {
    return parseEnabledIndustryKey(searchParams.get("industry"));
  }

  const raw = searchParams.industry;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return parseEnabledIndustryKey(value);
}

export function withIndustryQuery(
  href: string,
  industry: EnabledIndustryKey
): string {
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}industry=${industry}`;
}
