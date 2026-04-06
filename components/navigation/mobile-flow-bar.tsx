"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  backHref: string;
  backLabel: string;
  pageLabel: string;
  nextHref?: string;
  nextLabel?: string;
};

export function MobileFlowBar({
  backHref,
  backLabel,
  pageLabel,
  nextHref,
  nextLabel,
}: Props) {
  return (
    <div className="md:hidden p-1">
      <div className="grid grid-cols-3 items-center gap-2">
        <div className="min-w-0">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="w-full justify-start gap-1 text-xs whitespace-nowrap"
          >
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
              <span className="truncate">{backLabel}</span>
            </Link>
          </Button>
        </div>
        <p className="truncate text-center text-sm font-semibold text-foreground whitespace-nowrap">
          {pageLabel}
        </p>
        <div className="min-w-0">
          {nextHref && nextLabel ? (
            <Button size="sm" asChild className="w-full gap-1 text-xs whitespace-nowrap">
              <Link href={nextHref}>
                <span className="truncate">{nextLabel}</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <div className="h-9 w-full" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}

