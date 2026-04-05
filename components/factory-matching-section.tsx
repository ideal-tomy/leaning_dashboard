"use client";

import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIndustry } from "@/components/industry-context";
import { DEMO_FACTORY_CLIENT_ID } from "@/lib/demo-factory-client";
import { buildFactoryScoutBlocks } from "@/lib/demo-factory-scout";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";
import { LearningComplianceBadge } from "@/components/learning-compliance-badge";

export function FactoryMatchingSection() {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const data = getIndustryDemoData(industry);
  const client = data.getClientById(DEMO_FACTORY_CLIENT_ID);
  const blocks = buildFactoryScoutBlocks(data, DEMO_FACTORY_CLIENT_ID);

  if (!client) {
    return (
      <p className="text-sm text-muted">デモ案件データが見つかりません。</p>
    );
  }

  const req = client.learningRequirementsDemo;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-5 text-primary" />
            自社の掲載条件（デモ）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>
            業種・現場:{" "}
            <span className="font-medium text-foreground">
              {client.industryJa}（{client.prefectureJa}
              {client.cityJa ? ` ${client.cityJa}` : ""}）
            </span>
          </p>
          {req ? (
            <ul className="space-y-1.5 rounded-lg border border-border/80 bg-background/80 p-3 text-xs leading-relaxed">
              <li>
                <span className="text-muted">日本語（対面認定）: </span>
                <span className="font-semibold text-foreground">
                  {req.minCertifiedJlpt} 以上
                </span>
              </li>
              <li>
                <span className="text-muted">職場倫理: </span>
                <span className="font-semibold text-foreground">
                  {req.ethicsPassRequired
                    ? "対面確認の合格が必須"
                    : "必須なし（デモ）"}
                </span>
              </li>
              {req.standardLabelJa ? (
                <li className="text-muted">{req.standardLabelJa}</li>
              ) : null}
            </ul>
          ) : null}
          <p className="text-xs leading-relaxed">
            以下は登録支援機関ごとに公開された候補のイメージです。実名・詳細は各候補の画面で確認できます（デモ）。
          </p>
        </CardContent>
      </Card>

      {blocks.map((block) => (
        <Card key={block.id}>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold leading-snug">
              {block.labelJa}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs">
              スカウト対象（デモ）
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {block.rows.length === 0 ? (
              <p className="py-3 text-center text-sm text-muted">
                表示できる候補がありません（デモ）。
              </p>
            ) : (
              <ul className="space-y-2">
                {block.rows.map(
                  ({ candidate, pct, reason, learningCompliance }) => (
                    <li
                      key={candidate.id}
                      className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={withDemoQuery(
                            `/candidates/${candidate.id}`,
                            industry,
                            role
                          )}
                          className="font-semibold text-primary hover:underline"
                        >
                          {candidate.displayName}
                        </Link>
                        <span className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="tabular-nums">
                            日本語 {candidate.jlpt}
                          </Badge>
                          {learningCompliance ? (
                            <LearningComplianceBadge
                              status={learningCompliance.status}
                              labelJa={learningCompliance.labelJa}
                            />
                          ) : null}
                          <Badge variant="ai" className="gap-0.5 text-xs">
                            <Sparkles className="size-3" />
                            {pct}%
                          </Badge>
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                        {reason}
                      </p>
                    </li>
                  )
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
