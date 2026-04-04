import Link from "next/link";
import {
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  { href: "/messages", label: "メッセージ", icon: MessageSquare, desc: "シンハラ語デモ" },
  { href: "/matching", label: "マッチング", icon: ClipboardList, desc: "案件別提案" },
  { href: "/documents", label: "書類", icon: FileText, desc: "OCR・ステータス" },
  { href: "/knowledge", label: "ナレッジ", icon: Sparkles, desc: "AI FAQ（枠）" },
  { href: "/operations", label: "実務・収益", icon: Settings, desc: "ハブ" },
] as const;

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">その他</h1>
        <p className="mt-1 text-sm text-muted">モバイル用ショートカット</p>
      </div>
      <div className="grid gap-3">
        {links.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
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
    </div>
  );
}
