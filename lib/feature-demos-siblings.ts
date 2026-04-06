import {
  FEATURE_DEMOS,
  filterFeatureDemosForRole,
  type FeatureDemoCatalogItem,
} from "@/lib/feature-demos-catalog";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";

/** 現在のデモを除き、ロールに応じてフィルタした兄弟デモ一覧（最大4件） */
export function getFeatureDemoSiblings(
  currentSlug: string,
  industry: EnabledIndustryKey,
  role: DemoRole
): FeatureDemoCatalogItem[] {
  return filterFeatureDemosForRole(FEATURE_DEMOS, industry, role).filter(
    (i) => i.slug !== currentSlug
  );
}
