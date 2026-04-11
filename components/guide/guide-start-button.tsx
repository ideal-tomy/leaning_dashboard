"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { withDemoQuery } from "@/lib/demo-query";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";

export function GuideStartButton({
  industry,
  role,
}: {
  industry: EnabledIndustryKey;
  role: DemoRole;
}) {
  const router = useRouter();
  return (
    <Button
      type="button"
      size="lg"
      className="h-12 w-full text-base sm:w-auto sm:min-w-[12rem]"
      onClick={() => {
        router.push(withDemoQuery("/story", industry, role));
      }}
    >
      デモを再生
    </Button>
  );
}
