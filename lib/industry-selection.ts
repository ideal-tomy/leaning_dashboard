import {
  defaultIndustryKey,
  parseEnabledIndustryKey,
  type EnabledIndustryKey,
} from "@/lib/industry-profiles";
import {
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/demo-query";
import type { DemoRole } from "@/lib/demo-role";

export type { DemoRole };

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

export { getRoleFromSearchParams, withDemoQuery };
