"use client";

import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIndustry } from "@/components/industry-context";
import { DEMO_FACTORY_CLIENT_ID } from "@/lib/demo-factory-client";
import { buildFactoryScoutBlocks } from "@/lib/demo-factory-scout";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { useDemoRole } from "@/components/demo-role-context";
import { MatchingCandidateRow } from "@/components/matching-candidate-row";

function agencyLeftColumn(labelJa: string) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-foreground">{labelJa}</p>
      <p className="text-xs leading-relaxed text-muted">
        登録支援機関から公開された候補とのマッチング（デモ）
      </p>
    </div>
  );
}

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
              <ol className="space-y-3">
                {block.rows.map(
                  ({ candidate, pct, reason, learningCompliance }, idx) => (
                    <MatchingCandidateRow
                      key={candidate.id}
                      left={agencyLeftColumn(block.labelJa)}
                      pct={pct}
                      reason={reason}
                      candidate={candidate}
                      learningCompliance={learningCompliance}
                      industry={industry}
                      role={role}
                      rowIndex={idx}
                    />
                  )
                )}
              </ol>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
