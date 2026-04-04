import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

/** ダッシュボード用：スマホ（md 未満）のみ表示。タイトル＋サブタイトル 1〜2 行想定 */
export function DashboardMobileCardSlim({
  href,
  icon: Icon,
  title,
  subtitle,
}: Props) {
  return (
    <Link
      href={href}
      className="group block h-full min-h-0 min-w-0 md:hidden"
    >
      <Card className="flex h-full min-h-0 items-start gap-1.5 border-border p-2 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-md">
        <Icon
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-foreground">
            {title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-muted">
            {subtitle}
          </p>
        </div>
      </Card>
    </Link>
  );
}
