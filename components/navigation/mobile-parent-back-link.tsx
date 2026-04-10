import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  className?: string;
};

/**
 * 詳細ページ用（md 以上は非表示）。グローバルナビに加え、親一覧へ戻る導線のみ残す。
 */
export function MobileParentBackLink({ href, label, className }: Props) {
  return (
    <div className={cn("md:hidden pb-3", className)}>
      <Link
        href={href}
        className="inline-flex max-w-full items-center gap-1 text-sm text-muted hover:text-foreground -mx-1 px-1"
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{label}</span>
      </Link>
    </div>
  );
}
