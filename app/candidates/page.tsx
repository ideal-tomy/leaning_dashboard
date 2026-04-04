import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidatesSection } from "./candidates-section";

function Fallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <CandidatesSection />
    </Suspense>
  );
}
