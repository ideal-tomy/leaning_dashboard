import { Badge } from "@/components/ui/badge";
import type { LearningComplianceStatus } from "@data/types";

function variantForStatus(
  s: LearningComplianceStatus
): "success" | "warning" | "danger" | "secondary" {
  switch (s) {
    case "ok":
      return "success";
    case "partial":
      return "warning";
    case "gap":
      return "danger";
    default:
      return "secondary";
  }
}

export function LearningComplianceBadge({
  status,
  labelJa,
}: {
  status: LearningComplianceStatus;
  labelJa: string;
}) {
  if (!labelJa) return null;
  return <Badge variant={variantForStatus(status)}>{labelJa}</Badge>;
}
