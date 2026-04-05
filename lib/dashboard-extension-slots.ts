import { Camera, Clock, LayoutGrid, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { appTemplateConfig } from "@/lib/app-template-config";
import type {
  DashboardExtensionIconName,
  DashboardExtensionSlotBase,
} from "@/lib/dashboard-extension-types";
import type { DemoRole } from "@/lib/demo-role";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";

const extensionIcons: Record<DashboardExtensionIconName, LucideIcon> = {
  Clock,
  Sparkles,
  Camera,
  LayoutGrid,
};

export type ResolvedDashboardExtensionSlot = Omit<
  DashboardExtensionSlotBase,
  "enabled"
> & {
  iconComponent: LucideIcon;
};

/** テンプレ設定 × 業種オーバーライド後の拡張枠（表示用） */
export function resolveDashboardExtensionSlots(
  industry: EnabledIndustryKey,
  role?: DemoRole
): ResolvedDashboardExtensionSlot[] {
  const bases = appTemplateConfig.dashboard.extensionSlots;
  const hints = getIndustryPageHints(industry);
  const overrides = hints.dashboardExtensionOverrides ?? {};
  const clientOverrides =
    role === "client" ? (hints.dashboardExtensionClientOverrides ?? {}) : {};

  const out: ResolvedDashboardExtensionSlot[] = [];
  for (const base of bases) {
    if (!base.enabled) continue;
    const baseOverride = overrides[base.id];
    const clientLayer = clientOverrides[base.id];
    const o =
      clientLayer !== undefined
        ? { ...baseOverride, ...clientLayer }
        : baseOverride;
    if (o?.enabled === false) continue;

    const { enabled: _e, ...restOverride } = o ?? {};
    const merged: DashboardExtensionSlotBase = {
      ...base,
      ...restOverride,
      id: base.id,
      icon: base.icon,
      enabled: true,
    };

    out.push({
      id: merged.id,
      path: merged.path,
      icon: merged.icon,
      title: merged.title,
      subtitle: merged.subtitle,
      desktopTitle: merged.desktopTitle,
      desktopBody: merged.desktopBody,
      desktopCta: merged.desktopCta,
      iconComponent: extensionIcons[merged.icon],
    });
  }
  return out;
}
