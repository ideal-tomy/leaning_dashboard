import { cn } from "@/lib/utils";

/** 一覧系ページの縦スタック（space-y-6） */
export function TemplatePageStack({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

/** 収益ダッシュ等の KPI 4枚グリッド */
export function TemplateKpiGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {children}
    </div>
  );
}

/** 2カラム（タブレット以下は1列） */
export function TemplateTwoColumnGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-2", className)}>{children}</div>
  );
}

/** ページ見出し＋説明（ダッシュ・内ページ共通） */
export function TemplatePageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-semibold text-primary-alt">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
}

/** ダッシュボード用（やや小さめ見出し） */
export function TemplateDashboardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-primary-alt sm:text-2xl">
        {title}
      </h1>
      <p className="mt-1 text-xs text-muted sm:text-sm">{subtitle}</p>
    </div>
  );
}
