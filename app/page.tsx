import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardKillerCards } from "@/components/dashboard-killer-cards";
import { DashboardTopCardGrid } from "@/components/dashboard-top-card-grid";
import { DashboardExtensionRegion } from "@/components/dashboard-extension-region";
import { TemplateDashboardHeader } from "@/components/templates/layout-primitives";
import { appTemplateConfig } from "@/lib/app-template-config";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import { getDemoFactoryClient } from "@/lib/demo-factory-client";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { buildDashboardTopCards } from "@/lib/dashboard-top-cards";
import { resolveDashboardViewMode } from "@/lib/dashboard-view-mode";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  if (role === "worker") {
    redirect(withDemoQuery("/worker", industry, role));
  }
  const profile = getIndustryProfile(industry);
  const isFactoryStaffing = industry === "staffing" && role === "client";
  const data = getIndustryDemoData(industry);
  const factoryClient = isFactoryStaffing
    ? getDemoFactoryClient(data.clients)
    : undefined;
  const pipeline = data.getPipelineCounts();
  const docAlerts = data.countDocumentAlerts();
  const viewMode = resolveDashboardViewMode(industry, role);
  const topCards = buildDashboardTopCards(viewMode, industry, role, {
    totalCandidates: data.candidates.length,
    n3OrAbove: data.countN3OrAbove(),
    docAlerts,
    totalClients: data.clients.length,
    totalOpenSlots: data.totalOpenSlots(),
    trainingCount: pipeline.training,
    awaitingEntryCount: pipeline.awaiting_entry,
    activeAssignments: factoryClient?.operations.currentAssignees ?? 0,
  });
  const { dashboard } = appTemplateConfig;

  return (
    <div className="space-y-6 sm:space-y-8">
      <TemplateDashboardHeader
        title={profile.dashboardTitle || dashboard.pageTitle}
        subtitle={profile.dashboardSubtitle || dashboard.pageSubtitle}
      />

      <DashboardKillerCards industry={industry} role={role} />
      <Separator />

      <div className="space-y-4">
        <DashboardTopCardGrid cards={topCards} />
        <Card className="border-dashed border-primary/30 bg-primary/[0.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              オプション機能（必要時に追加）
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted">
            トップは主要導線のみ表示しています。下記の拡張枠から、運用や説明に合わせて機能を追加できます。
          </CardContent>
        </Card>
        <DashboardExtensionRegion industry={industry} role={role} />
      </div>
    </div>
  );
}
