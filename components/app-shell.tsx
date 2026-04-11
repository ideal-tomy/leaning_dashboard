"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  CircleHelp,
  Headphones,
  Home,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  appTemplateConfig,
  type TemplateNavItem,
} from "@/lib/app-template-config";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { unreadDemoMessageCount } from "@/lib/demo-messages";
import { DemoFab } from "@/components/demo-fab";
import { templateNavIcons } from "@/components/template-nav-icons";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { IndustrySecretModal } from "@/components/industry-secret-modal";
import { withDemoQuery } from "@/lib/demo-query";
import { demoRoleLabelJa, demoRoles, type DemoRole } from "@/lib/demo-role";

const SECRET_TAP_WINDOW_MS = 2000;
const SECRET_TAP_COUNT = 5;

/** はじめてガイドのスポットライト用（`data-guide-target` と一致） */
const ADMIN_NAV_GUIDE_TARGETS: Record<string, string> = {
  "/": "guide-nav-home",
  "/candidates": "guide-nav-candidates",
  "/clients": "guide-nav-clients",
  "/operations": "guide-nav-operations",
  "/revenue": "guide-nav-revenue",
  "/knowledge": "guide-nav-knowledge",
  "/messages": "guide-nav-messages",
  "/matching": "guide-nav-matching",
  "/documents": "guide-nav-documents",
};

const WORKER_NAV_GUIDE_TARGETS: Record<string, string> = {
  "/worker": "guide-worker-home",
  "/worker/learn": "guide-worker-learn",
  "/worker/progress": "guide-worker-progress",
  "/worker/alerts": "guide-worker-alerts",
  "/worker/support": "guide-worker-support",
};

const workerNavItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/worker", label: "ホーム", Icon: Home },
  { href: "/worker/learn", label: "学習", Icon: BookOpen },
  { href: "/worker/progress", label: "進捗", Icon: TrendingUp },
  { href: "/worker/alerts", label: "期限", Icon: Bell },
  { href: "/worker/support", label: "相談", Icon: Headphones },
];

function AdminMobileNavRow({
  items,
  pathname,
  industry,
  role,
  labelByHref,
  guideTargetByHref,
}: {
  items: readonly TemplateNavItem[];
  pathname: string;
  industry: EnabledIndustryKey;
  role: DemoRole;
  labelByHref: Record<string, string>;
  guideTargetByHref?: Record<string, string>;
}) {
  return (
    <div className="mx-auto flex max-w-7xl items-stretch overflow-x-auto overscroll-x-contain">
      {items.map(({ href, label, icon }) => {
        const Icon = templateNavIcons[icon];
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={withDemoQuery(href, industry, role)}
            data-guide-target={guideTargetByHref?.[href]}
            className={cn(
              "flex min-w-[4.25rem] shrink-0 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium leading-tight sm:min-w-[4.5rem]",
              active ? "text-primary" : "text-muted"
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="line-clamp-2 text-center">
              {labelByHref[href] ?? label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function WorkerMobileNavRow({
  pathname,
  industry,
  role,
  guideTargetByHref,
}: {
  pathname: string;
  industry: EnabledIndustryKey;
  role: DemoRole;
  guideTargetByHref?: Record<string, string>;
}) {
  return (
    <div className="mx-auto flex max-w-lg items-stretch justify-around">
      {workerNavItems.map((item) => {
        const { href, label, Icon } = item;
        const active =
          href === "/worker"
            ? pathname === "/worker"
            : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={withDemoQuery(href, industry, role)}
            data-guide-target={guideTargetByHref?.[href]}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
              active ? "text-primary" : "text-muted"
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const unread = unreadDemoMessageCount();
  const { industry } = useIndustry();
  const { role, setRole } = useDemoRole();
  const profile = getIndustryProfile(industry);
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretModalKey, setSecretModalKey] = useState(0);
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  function handleSecretTitleTap() {
    const now = Date.now();
    if (now - lastTapRef.current > SECRET_TAP_WINDOW_MS) {
      tapCountRef.current = 0;
    }
    lastTapRef.current = now;
    tapCountRef.current += 1;
    if (tapCountRef.current >= SECRET_TAP_COUNT) {
      tapCountRef.current = 0;
      setSecretModalKey((k) => k + 1);
      setSecretOpen(true);
    }
  }
  const { branding, shell } = appTemplateConfig;
  const topNavLabelByHref: Record<string, string> = {
    "/": profile.dashboardTitle,
    "/candidates": profile.labels.candidate,
    "/clients": profile.labels.client,
    "/operations": profile.labels.operations,
    "/revenue": profile.labels.revenue,
    "/knowledge": profile.labels.knowledge,
  };
  const bottomNavLabelByHref: Record<string, string> = {
    "/": "ホーム",
    "/personnel-hub": "人員・関係",
    "/partners": "取引先",
    "/candidates": profile.labels.candidate,
    "/clients": profile.labels.client,
    "/operations": profile.labels.operations,
    "/revenue": profile.labels.revenue,
    "/knowledge": profile.labels.knowledge,
    "/messages": "メッセージ",
    "/matching": profile.labels.matching,
    "/documents": profile.labels.documents,
  };

  const isWorker = role === "worker";
  const isClient = role === "client";

  const adminTopNavItems = shell.topNav.filter(
    (item) =>
      !(isClient && (item.href === "/operations" || item.href === "/revenue"))
  );

  /** クライアントは収益を非表示。派遣スタッフィングのクライアントは「その他」ページと同様に実務・書類も除外 */
  const adminBottomNavItemsBase = shell.bottomNav.filter((item) => {
    if (!isClient) return true;
    if (item.href === "/revenue") return false;
    if (
      industry === "staffing" &&
      (item.href === "/operations" || item.href === "/documents")
    ) {
      return false;
    }
    return true;
  });

  const constructionHubNav: TemplateNavItem[] = [
    { href: "/personnel-hub", label: "人員・関係", icon: "Users" },
    { href: "/partners", label: "取引先", icon: "Building2" },
  ];

  const adminBottomNavItems =
    industry === "construction" && !isClient
      ? [
          adminBottomNavItemsBase[0]!,
          ...constructionHubNav,
          ...adminBottomNavItemsBase.slice(1),
        ]
      : adminBottomNavItemsBase;

  const bypassShell =
    pathname.startsWith("/sales-demo") ||
    pathname.startsWith("/story") ||
    searchParams.get("storyEmbed") === "1";

  if (bypassShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSecretTitleTap}
              className="min-w-0 truncate text-left text-sm font-semibold text-primary-alt bg-transparent p-0 border-0 cursor-pointer"
            >
              {profile.productName || branding.productName}
            </button>
            {(profile.badgeLabel ?? branding.badgeLabel) ? (
              <Link
                href={withDemoQuery("/", industry, role)}
                className="shrink-0"
              >
                <Badge variant="ai" className="hidden sm:inline-flex">
                  {profile.badgeLabel ?? branding.badgeLabel}
                </Badge>
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="sr-only" htmlFor="demo-role-select">
              デモ表示ロール
            </label>
            <select
              id="demo-role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as DemoRole)}
              className="max-w-[7.5rem] rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium text-foreground md:max-w-none md:text-sm"
            >
              {demoRoles.map((r) => (
                <option key={r} value={r}>
                  {demoRoleLabelJa[r]}
                </option>
              ))}
            </select>
            <Link
              href={withDemoQuery("/guide", industry, role)}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/[0.06] px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/[0.1] md:text-sm"
              aria-label="営業デモ"
            >
              <CircleHelp className="size-4" />
              営業デモ
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-1 overflow-x-auto min-w-0">
            {isWorker
              ? workerNavItems.map((item) => {
                  const { href, label, Icon } = item;
                  const active =
                    href === "/worker"
                      ? pathname === "/worker"
                      : pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={withDemoQuery(href, industry, role)}
                      data-guide-target={WORKER_NAV_GUIDE_TARGETS[href]}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                        active
                          ? "bg-surface text-primary"
                          : "text-muted hover:text-foreground hover:bg-surface/80"
                      )}
                    >
                      <Icon className="size-4 shrink-0 opacity-80" />
                      {label}
                    </Link>
                  );
                })
              : adminTopNavItems.map(({ href, label, icon }) => {
                  const Icon = templateNavIcons[icon];
                  const active =
                    href === "/"
                      ? pathname === "/"
                      : pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={withDemoQuery(href, industry, role)}
                      data-guide-target={ADMIN_NAV_GUIDE_TARGETS[href]}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                        active
                          ? "bg-surface text-primary"
                          : "text-muted hover:text-foreground hover:bg-surface/80"
                      )}
                    >
                      <Icon className="size-4 shrink-0 opacity-80" />
                      {topNavLabelByHref[href] ?? label}
                    </Link>
                  );
                })}
          </nav>
          {shell.showMessagesLink ? (
            <Link
              href={withDemoQuery(
                isWorker ? "/worker/support" : "/messages",
                industry,
                role
              )}
              data-guide-target="guide-messages"
              className="relative flex items-center gap-1 rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground shrink-0"
              aria-label="メッセージ"
            >
              <MessageSquare className="size-5" />
              {!isWorker && unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          ) : (
            <div className="w-10 shrink-0" aria-hidden />
          )}
        </div>
        <div className="h-0.5 w-full bg-primary" aria-hidden />
        {isWorker ? (
          <nav
            className="md:hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            aria-label="メインナビゲーション（上部）"
          >
            <WorkerMobileNavRow
              pathname={pathname}
              industry={industry}
              role={role}
              guideTargetByHref={WORKER_NAV_GUIDE_TARGETS}
            />
          </nav>
        ) : (
          <nav
            className="md:hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            aria-label="メインナビゲーション（上部）"
          >
            <AdminMobileNavRow
              items={adminBottomNavItems}
              pathname={pathname}
              industry={industry}
              role={role}
              labelByHref={bottomNavLabelByHref}
              guideTargetByHref={ADMIN_NAV_GUIDE_TARGETS}
            />
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 md:pb-8">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur md:hidden"
        aria-label="メインナビゲーション（下部）"
      >
        {isWorker ? (
          <WorkerMobileNavRow
            pathname={pathname}
            industry={industry}
            role={role}
            guideTargetByHref={WORKER_NAV_GUIDE_TARGETS}
          />
        ) : (
          <AdminMobileNavRow
            items={adminBottomNavItems}
            pathname={pathname}
            industry={industry}
            role={role}
            labelByHref={bottomNavLabelByHref}
            guideTargetByHref={ADMIN_NAV_GUIDE_TARGETS}
          />
        )}
      </nav>

      {shell.showDemoFab ? <DemoFab /> : null}

      <IndustrySecretModal
        key={secretModalKey}
        open={secretOpen}
        onOpenChange={setSecretOpen}
      />
    </div>
  );
}
