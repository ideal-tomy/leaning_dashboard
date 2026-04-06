import Link from "next/link";
import { cn } from "@/lib/utils";

export type PageTagLink = {
  id: string;
  label: string;
  href: string;
};

type Props = {
  label: string;
  currentId: string;
  tags: PageTagLink[];
  mobileScrollable?: boolean;
  stickyOnMobile?: boolean;
  mobileTopClassName?: string;
};

export function PageTagLinks({
  label,
  currentId,
  tags,
  mobileScrollable = false,
  stickyOnMobile = false,
  mobileTopClassName = "top-14",
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
        {tags.map((tag) => {
          const active = tag.id === currentId;
          return (
            <Link
              key={tag.id}
              href={tag.href}
            scroll={false}
              className={cn(
                "shrink-0 border-b-2 px-0.5 py-1 text-sm font-medium transition-colors whitespace-nowrap",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {tag.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

