import type { DemoRole } from "@/lib/demo-role";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";

export type DashboardViewMode = "support_org" | "factory";

export function resolveDashboardViewMode(
  industry: EnabledIndustryKey,
  role: DemoRole
): DashboardViewMode {
  if (industry === "staffing" && role === "client") {
    return "factory";
  }
  return "support_org";
}

