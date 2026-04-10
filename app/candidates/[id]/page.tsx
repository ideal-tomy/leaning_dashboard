import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { CandidateActivityTimeline } from "@/components/candidate-activity-timeline";
import { CandidateBasicProfileFull } from "@/components/candidate-basic-profile-full";
import { CandidateDetailHeroStrip } from "@/components/candidate-detail-hero-strip";
import { CandidateDetailTabsShell } from "@/components/candidate-detail-tabs-shell";
import { CandidateDispatchHistory } from "@/components/candidate-dispatch-history";
import { CandidateDocChecklist } from "@/components/candidate-doc-checklist";
import { CandidateDocumentResolutionPanel } from "@/components/candidate-document-resolution-panel";
import { CandidateDocumentVault } from "@/components/candidate-document-vault";
import { CandidateInterviewLogs } from "@/components/candidate-interview-logs";
import { CandidateLearningDemoPanel } from "@/components/candidate-learning-demo-panel";
import { LearningComplianceBadge } from "@/components/learning-compliance-badge";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import {
  DEMO_REFERENCE_DATE_ISO,
  daysUntilDateIso,
} from "@/lib/candidate-detail-helpers";
import type { DemoRole } from "@/lib/demo-role";

function maskPassportNumber(num: string): string {
  if (num.length <= 3) return "••••";
  return `•••••${num.slice(-3)}`;
}

function showAdminContact(role: DemoRole): boolean {
  return role === "admin";
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CandidateDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const cd = getIndustryPageHints(industry).candidateDetail;
  const data = getIndustryDemoData(industry);
  const c = data.getCandidateById(id);
  if (!c) notFound();

  const assigned = c.plannedAssignment
    ? data.getClientById(c.plannedAssignment.clientId)
    : undefined;
  const match = assigned
    ? data.scoreCandidateForClient(c, assigned)
    : null;

  const referenceDateIso = DEMO_REFERENCE_DATE_ISO;
  const adminContact = showAdminContact(role);
  const passportExpiryDays = daysUntilDateIso(
    c.passportExpiry,
    referenceDateIso
  );

  const rawTab = resolvedSearchParams?.tab;
  const tabParam = Array.isArray(rawTab) ? rawTab[0] : rawTab;
  const allowedTabs = new Set(["basic", "learning", "docs", "history", "ai"]);
  const initialTab =
    tabParam && allowedTabs.has(tabParam) ? tabParam : "basic";

  const showDocResolution =
    Boolean(c.detailDemo?.documentResolution) ||
    c.pipelineStatus === "document_blocked" ||
    Boolean(c.documentAlertJa);

  return (
    <TemplatePageStack>
      <MobileParentBackLink
        href={withDemoQuery("/candidates", industry, role)}
        label={`${profile.labels.candidate}一覧`}
      />

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 hidden gap-1 self-start md:inline-flex"
      >
        <Link href={withDemoQuery("/candidates", industry, role)}>
          <ArrowLeft className="size-4" />
          {profile.labels.candidate}一覧
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src={c.photoUrl}
          alt=""
          width={120}
          height={120}
          className="rounded-2xl border border-border bg-surface"
          unoptimized
        />
        <div className="flex-1 space-y-2">
          <TemplatePageHeader title={c.displayName} />
          <p className="text-sm text-muted">
            {c.legalNameFull} / {c.nameKatakana}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">
              <Sparkles className="mr-1 size-3" />
              AI {c.aiScore}
            </Badge>
            <Badge>{c.pipelineStatusLabelJa}</Badge>
            {cd.showJlptBadge ? (
              <Badge variant="secondary">{c.jlpt}</Badge>
            ) : null}
          </div>
          {c.learningDemo ? (
            <p className="text-xs text-muted">
              表示中の日本語レベル（{c.jlpt}）は対面認定ベースの想定です。オンライン上の到達（例: N3
              相当コース進行）は「学習・認定」タブで確認できます。
            </p>
          ) : null}
          {c.aiScoreRationale && (
            <p className="text-sm text-muted">{c.aiScoreRationale}</p>
          )}
        </div>
      </div>

      <CandidateDetailHeroStrip
        candidate={c}
        assigned={assigned}
        role={role}
        referenceDateIso={referenceDateIso}
      />

      <CandidateActivityTimeline
        events={c.detailDemo?.activityEvents}
        referenceDateIso={referenceDateIso}
      />

      <div className="flex flex-wrap justify-end gap-4 text-sm">
        <Link
          className="font-medium text-primary hover:underline"
          href={withDemoQuery("/documents", industry, role, {
            highlight: "deadlines",
          })}
        >
          期限が近い手続き（書類ハブ）
        </Link>
        {industry === "staffing" ? (
          <Link
            className="font-medium text-primary hover:underline"
            href={withDemoQuery("/learning-insights", industry, role)}
          >
            学習サマリー
          </Link>
        ) : null}
      </div>

      <CandidateDetailTabsShell
        key={`${id}-${initialTab}`}
        defaultValue={initialTab}
        tabList={
          <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger value="basic">{cd.tabBasic}</TabsTrigger>
            <TabsTrigger value="learning">学習・認定</TabsTrigger>
            <TabsTrigger value="docs">{cd.tabDocs}</TabsTrigger>
            <TabsTrigger value="history">{cd.tabHistory}</TabsTrigger>
            <TabsTrigger value="ai">{cd.tabAi}</TabsTrigger>
          </TabsList>
        }
      >
        <TabsContent value="basic">
          <CandidateBasicProfileFull
            candidate={c}
            profileCardTitle={cd.profileCardTitle}
            adminContact={adminContact}
          />
        </TabsContent>

        <TabsContent value="learning">
          {c.learningDemo ? (
            <CandidateLearningDemoPanel
              data={c.learningDemo}
              referenceDateIso={referenceDateIso}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">学習・対面認定（デモ）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted">
                <p>
                  この候補者にはオンライン／対面の分割デモがまだありません。
                </p>
                {industry === "staffing" ? (
                  <p className="text-xs">
                    参考表示:{" "}
                    <Link
                      href={withDemoQuery(
                        "/candidates/cand-nuwan-kumara",
                        industry,
                        role
                      )}
                      className="font-medium text-primary hover:underline"
                    >
                      Nuwan Kumara
                    </Link>
                    の詳細を開いてください。
                  </p>
                ) : (
                  <p className="text-xs">
                    参考は派遣スタッフィング業種の「Nuwan
                    Kumara」詳細に同タブがあります。業種を切り替えてご確認ください。
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.docsCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {showDocResolution ? (
                <CandidateDocumentResolutionPanel
                  guide={c.detailDemo?.documentResolution}
                  documentAlertJa={c.documentAlertJa}
                  industry={industry}
                  role={role}
                />
              ) : null}
              <div className="space-y-1">
                <p>
                  <span className="text-muted">{cd.docsPrimaryLabel}</span>{" "}
                  {adminContact ? (
                    c.passportNumber
                  ) : (
                    <span className="tracking-wider">
                      {maskPassportNumber(c.passportNumber)}
                    </span>
                  )}{" "}
                  / {cd.docsExpiryLabel} {c.passportExpiry}
                  {passportExpiryDays != null ? (
                    <span className="ml-2 text-xs text-muted">
                      （
                      {passportExpiryDays > 365
                        ? `有効期限まで約${Math.round(passportExpiryDays / 365)}年`
                        : passportExpiryDays > 0
                          ? `有効期限まであと${passportExpiryDays}日`
                          : passportExpiryDays === 0
                            ? "有効期限当日"
                            : `有効期限から${Math.abs(passportExpiryDays)}日経過`}
                      ）
                    </span>
                  ) : null}
                </p>
                <p>
                  <span className="text-muted">{cd.docsSecondaryLabel}</span>{" "}
                  {c.coeStatusJa}
                </p>
              </div>
              {!showDocResolution && c.documentAlertJa ? (
                adminContact ? (
                  <p className="font-medium text-danger">{c.documentAlertJa}</p>
                ) : (
                  <p className="font-medium text-warning">
                    書類面で要確認の項目があります。詳細は支援機関にお問い合わせください（デモ）。
                  </p>
                )
              ) : null}
              <div>
                <p className="mb-2 text-xs font-medium text-muted">
                  ドキュメント保管庫（連携イメージ）
                </p>
                <CandidateDocumentVault
                  items={c.detailDemo?.storedDocuments}
                  role={role}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted">
                  書類チェックリスト
                </p>
                <CandidateDocChecklist
                  items={c.detailDemo?.docChecklist}
                  referenceDateIso={referenceDateIso}
                />
              </div>
              {adminContact ? (
                <p className="text-xs text-muted">{cd.docsOcrNote}</p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.historyCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              {c.detailDemo?.interviewLogs?.length ? (
                <CandidateInterviewLogs
                  entries={c.detailDemo.interviewLogs}
                />
              ) : (
                <p className="text-muted">{cd.historyPlaceholder}</p>
              )}
              <CandidateDispatchHistory
                entries={c.detailDemo?.dispatchHistory}
                planned={
                  c.plannedAssignment && assigned
                    ? {
                        tradeNameJa: assigned.tradeNameJa,
                        jobTitleJa: c.plannedAssignment.jobTitleJa,
                        monthlySalaryJpy: c.plannedAssignment.monthlySalaryJpy,
                        salaryLabel: cd.plannedAssignmentSalaryLabel,
                      }
                    : null
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{cd.aiCardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {assigned && match ? (
                <>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{assigned.tradeNameJa}</span>
                    との適合目安:{" "}
                    <span className="text-lg font-bold text-primary">
                      {match.pct}%
                    </span>
                    {match.learningCompliance ? (
                      <LearningComplianceBadge
                        status={match.learningCompliance.status}
                        labelJa={match.learningCompliance.labelJa}
                      />
                    ) : null}
                  </p>
                  <p className="leading-relaxed text-muted">{match.reason}</p>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted">{cd.aiEmptyAssignment}</p>
                  <Button variant="link" className="h-auto p-0 text-primary" asChild>
                    <Link href={withDemoQuery("/matching", industry, role)}>
                      {cd.aiMatchingLinkLabel}
                    </Link>
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted">{cd.aiFooterNote}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </CandidateDetailTabsShell>
    </TemplatePageStack>
  );
}
