"use client";

import Link from "next/link";
import { useSalesDemoBeatClass } from "@/components/story-demo/sales-demo-beat-context";
import { cn } from "@/lib/utils";

export type PageTagLink = {
  id: string;
  label: string;
  href: string;
  /** 営業デモ postMessage ビート id（アクティブ時に枠） */
  demoBeatId?: string;
};

type Props = {
  label: string;
  currentId: string;
  tags: PageTagLink[];
  mobileScrollable?: boolean;
  stickyOnMobile?: boolean;
  mobileTopClassName?: string;
  /** 営業ストーリー iframe 用：各タブに追加するクラス */
  demoLinkClassName?: string;
};

const NO_TAG_BEAT = "__no_sales_demo_tag_beat__";

function TagLink({
  tag,
  active,
  demoLinkClassName,
}: {
  tag: PageTagLink;
  active: boolean;
  demoLinkClassName?: string;
}) {
  const beatAccent = useSalesDemoBeatClass(
    tag.demoBeatId ?? NO_TAG_BEAT
  );
  const beatClass = tag.demoBeatId ? beatAccent : "";
  return (
    <Link
      href={tag.href}
      scroll={false}
      className={cn(
        "shrink-0 border-b-2 px-0.5 py-1 text-sm font-medium transition-colors whitespace-nowrap",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted hover:text-foreground",
        demoLinkClassName,
        beatClass
      )}
    >
      {tag.label}
    </Link>
  );
}

export function PageTagLinks({
  label,
  currentId,
  tags,
  mobileScrollable = false,
  stickyOnMobile = false,
  mobileTopClassName = "top-14",
  demoLinkClassName,
}: Props) {
  return (
    <div
      className={cn(
        "border-b border-border/70 pb-2",
        stickyOnMobile && `sticky z-30 ${mobileTopClassName} md:static`,
        stickyOnMobile && "bg-surface/95 backdrop-blur"
      )}
    >
      <span className="sr-only">{label}</span>
      <div
        className={cn(
          "flex items-center gap-3",
          mobileScrollable
            ? "overflow-x-auto whitespace-nowrap pb-0.5 md:mt-0 md:flex-wrap md:overflow-visible md:whitespace-normal"
            : "flex-wrap md:mt-0"
        )}
      >
        {tags.map((tag) => (
          <TagLink
            key={tag.id}
            tag={tag}
            active={tag.id === currentId}
            demoLinkClassName={demoLinkClassName}
          />
        ))}
      </div>
    </div>
  );
}
