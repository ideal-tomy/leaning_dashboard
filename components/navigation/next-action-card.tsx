import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReasonTone = "danger" | "warning" | "success" | "ai" | "secondary";

type Props = {
  title: string;
  reasonTag: string;
  reasonTone?: ReasonTone;
  description?: string;
  actionHref: string;
  actionLabel: string;
  className?: string;
};

export function NextActionCard({
  title,
  reasonTag,
  reasonTone = "secondary",
  description,
  actionHref,
  actionLabel,
  className,
}: Props) {
  const badgeVariant =
    reasonTone === "ai"
      ? "ai"
      : reasonTone === "danger"
        ? "danger"
        : reasonTone === "warning"
          ? "warning"
          : reasonTone === "success"
            ? "success"
            : "secondary";

  return (
    <Card className={cn("border-primary/20 bg-primary/[0.03]", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <Badge variant={badgeVariant} className="shrink-0">
            {reasonTag}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {description ? <p className="text-xs text-muted">{description}</p> : null}
        <Button size="sm" asChild className="w-full">
          <Link href={actionHref}>
            {actionLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

