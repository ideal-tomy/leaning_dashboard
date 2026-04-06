"use client";

import Link from "next/link";
import {
  ClipboardList,
  Cpu,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateMobileFlowSection, TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { withDemoQuery } from "@/lib/demo-query";

const links = [
  { href: "/feature-demos", label: "技術・DXデモ", icon: Cpu, desc: "OCR・AI 一覧から体験" },
  { href: "/messages", label: "メッセージ", icon: MessageSquare, desc: "シンハラ語デモ" },
  { href: "/matching", label: "マッチング", icon: ClipboardList, desc: "案件別提案" },
  { href: "/documents", label: "書類", icon: FileText, desc: "OCR・ステータス" },
  { href: "/knowledge", label: "ナレッジ", icon: Sparkles, desc: "AI FAQ（枠）" },
  { href: "/operations", label: "実務", icon: Settings, desc: "オペレーション" },
  { href: "/revenue", label: "収益", icon: TrendingUp, desc: "収益ダッシュ" },
] as const;

export default function MorePage() {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const hideDocsAndOps = industry === "staffing" && role === "client";
  const visibleLinks = hideDocsAndOps
    ? links.filter(
        (l) =>
          l.href !== "/documents" &&
          l.href !== "/operations" &&
          l.href !== "/revenue"
      )
    : links;

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel="その他"
        />
      </TemplateMobileFlowSection>
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">その他</h1>
        <p className="mt-1 text-sm text-muted">モバイル用ショートカット</p>
      </div>
      <div className="grid gap-3">
        {visibleLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={withDemoQuery(href, industry, role)}>
            <Card className="transition-all hover:border-primary/30">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <Icon className="size-5 text-primary" />
                <div>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-primary">開く →</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TemplatePageStack>
  );
}
