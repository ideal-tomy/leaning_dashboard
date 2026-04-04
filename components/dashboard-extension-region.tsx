import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMobileCardSlim } from "@/components/dashboard-mobile-card-slim";
import { resolveDashboardExtensionSlots } from "@/lib/dashboard-extension-slots";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";

type Props = {
  industry: EnabledIndustryKey;
};

/** ダッシュボード下段：拡張枠スロット（テンプレ設定＋業種オーバーライド） */
export function DashboardExtensionRegion({ industry }: Props) {
  const slots = resolveDashboardExtensionSlots(industry);
  if (slots.length === 0) return null;

  return (
    <div className="col-span-full grid min-w-0 grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-4 xl:gap-6">
      {slots.map((slot) => {
        const href = withIndustryQuery(slot.path, industry);
        const Icon = slot.iconComponent;
        return (
          <div
            key={slot.id}
            className="flex h-full min-h-0 min-w-0 flex-col"
          >
            <DashboardMobileCardSlim
              href={href}
              icon={Icon}
              title={slot.title}
              subtitle={slot.subtitle}
            />
            <Link
              href={href}
              className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
            >
              <Card className="flex h-full min-h-0 flex-1 flex-col border-dashed transition-all group-hover:border-primary/40 group-hover:shadow-md">
                <CardHeader className="shrink-0 p-5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                    {slot.desktopTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-5 pt-0 text-sm text-muted">
                  <p className="min-h-0 flex-1 leading-snug">
                    {slot.desktopBody}
                  </p>
                  <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 font-medium text-primary">
                    {slot.desktopCta}{" "}
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
