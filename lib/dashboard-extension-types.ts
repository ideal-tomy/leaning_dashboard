export type DashboardExtensionSlotId =
  | "attendanceBilling"
  | "knowledgeAi"
  | "fieldReports"
  | "customInsight";

export type DashboardExtensionIconName =
  | "Clock"
  | "Sparkles"
  | "Camera"
  | "LayoutGrid";

export type DashboardExtensionSlotBase = {
  id: DashboardExtensionSlotId;
  enabled: boolean;
  path: string;
  icon: DashboardExtensionIconName;
  title: string;
  subtitle: string;
  desktopTitle: string;
  desktopBody: string;
  desktopCta: string;
};

/** 業種ごとの差し替え。enabled: false でスロット非表示 */
export type DashboardExtensionOverride = Partial<
  Omit<DashboardExtensionSlotBase, "id" | "icon">
> & {
  enabled?: boolean;
};
