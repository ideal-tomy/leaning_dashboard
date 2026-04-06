"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  Languages,
  ScanLine,
  Users,
} from "lucide-react";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { getFeatureDemoSiblings } from "@/lib/feature-demos-siblings";
import { withDemoQuery } from "@/lib/demo-query";
import type { FeatureDemoCatalogItem } from "@/lib/feature-demos-catalog";

function FeatureDemoCardIcon({ slug }: { slug: string }) {
  const className = "size-4";
  switch (slug) {
    case "passport-ocr":
      return <ScanLine className={className} aria-hidden />;
    case "visa-pdf":
      return <FileText className={className} aria-hidden />;
    case "knowledge-ai":
      return <BookOpen className={className} aria-hidden />;
    case "messages-ai":
      return <Languages className={className} aria-hidden />;
    case "matching-ai":
      return <Users className={className} aria-hidden />;
    default:
      return <BookOpen className={className} aria-hidden />;
  }
}

type Props = {
  currentSlug: string;
};

export function FeatureDemoSiblingGrid({ currentSlug }: Props) {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const siblings = getFeatureDemoSiblings(currentSlug, industry, role);

  if (siblings.length === 0) return null;

  return (
    <section className="space-y-3" aria-label="ほかの技術デモ">
      <h2 className="text-sm font-semibold text-foreground">
        ほかの技術デモ
      </h2>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] overscroll-x-contain lg:grid lg:snap-none lg:grid-cols-4 lg:overflow-visible lg:pb-0"
        role="list"
      >
        {siblings.map((item) => (
          <SiblingCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}

function SiblingCard({ item }: { item: FeatureDemoCatalogItem }) {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const href = withDemoQuery(item.routePath, industry, role);

  return (
    <Link
      href={href}
      role="listitem"
      className="block w-[min(88vw,18.5rem)] shrink-0 snap-start rounded-xl border border-border/80 bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-md lg:w-auto lg:min-w-0"
    >
      <div className="flex items-start gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FeatureDemoCardIcon slug={item.slug} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {item.title}
          </p>
          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">
            {item.summary}
          </p>
          <p className="mt-2 text-xs font-medium text-primary">体験する →</p>
        </div>
      </div>
    </Link>
  );
}
