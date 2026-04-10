import Link from "next/link";
import { Mail, MessageSquare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { demoClientRequests } from "@/lib/demo-client-requests";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function urgencyBadge(urgency: "high" | "medium" | "low") {
  if (urgency === "high") return <Badge variant="danger">要対応</Badge>;
  if (urgency === "medium") return <Badge variant="warning">注意</Badge>;
  return <Badge variant="secondary">確認</Badge>;
}

export default async function ClientRequestsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const selectedIdRaw = resolvedSearchParams?.requestId;
  const selectedId = typeof selectedIdRaw === "string" ? selectedIdRaw : null;
  const selected =
    demoClientRequests.find((request) => request.id === selectedId) ??
    demoClientRequests[0];

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title="未対応クライアント要望"
        description="受信一覧を確認し、AI要約と対応提案を参考に一次対応を進めます。"
      />

      <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">受信一覧（デモ）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoClientRequests.map((request) => {
              const href = withDemoQuery(
                `/client-requests?requestId=${request.id}`,
                industry,
                role
              );
              return (
                <Link
                  key={request.id}
                  href={href}
                  className="block rounded-lg border border-border p-3 hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{request.subject}</p>
                      <p className="text-[11px] text-muted">
                        {request.clientName} / {request.receivedAt}
                      </p>
                    </div>
                    {urgencyBadge(request.urgency)}
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">要望詳細（デモ）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{selected.subject}</p>
              <p className="text-[11px] text-muted">
                {selected.clientName} / {selected.receivedAt}
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.channel === "email" ? (
                  <Badge variant="outline" className="gap-1">
                    <Mail className="size-3.5" />
                    Email
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <MessageSquare className="size-3.5" />
                    Message
                  </Badge>
                )}
                {urgencyBadge(selected.urgency)}
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/[0.05] p-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-primary">
                <Sparkles className="size-3.5" />
                AI要約
              </p>
              <p className="text-sm">{selected.aiSummary}</p>
              <p className="mt-2 text-[11px] text-muted">
                推奨対応: {selected.aiRecommendedAction}
              </p>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="mb-1 text-[11px] font-semibold text-muted">メール本文（原文・デモ）</p>
              <p className="text-sm leading-relaxed">{selected.body}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TemplatePageStack>
  );
}

