"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { withDemoQuery } from "@/lib/demo-query";
import { cn } from "@/lib/utils";

const items = [
  { href: "/worker", label: "ホーム" },
  { href: "/worker/learn", label: "学習" },
  { href: "/worker/progress", label: "進捗" },
  { href: "/worker/alerts", label: "お知らせ" },
  { href: "/worker/support", label: "サポート" },
] as const;

export function WorkerSubnav() {
  const pathname = usePathname();
  const { industry } = useIndustry();
  const { role } = useDemoRole();

  return (
    <nav
      className="flex gap-1.5 overflow-x-auto border-b border-border/80 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="ワーカー向けメニュー"
    >
      {items.map(({ href, label }) => {
        const active =
          href === "/worker"
            ? pathname === "/worker"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={withDemoQuery(href, industry, role)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted hover:bg-muted"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
