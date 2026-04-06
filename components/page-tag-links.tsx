import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
};

export function PageTagLinks({ label, currentId, tags }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/80 bg-card p-3">
      <Badge variant="outline" className="text-xs">
        {label}
      </Badge>
      {tags.map((tag) => {
        const active = tag.id === currentId;
        return (
          <Link
            key={tag.id}
            href={tag.href}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-muted hover:text-foreground"
            )}
          >
            {tag.label}
          </Link>
        );
      })}
    </div>
  );
}

