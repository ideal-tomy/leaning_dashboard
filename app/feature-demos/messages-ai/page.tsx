"use client";

import { MessagesPageContent } from "@/app/messages/messages-page-content";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { withDemoQuery } from "@/lib/demo-query";

export default function MessagesAiFeatureDemoPage() {
  const { industry } = useIndustry();
  const { role } = useDemoRole();

  return (
    <MessagesPageContent
      flowBack={{
        href: withDemoQuery("/feature-demos", industry, role),
        label: "技術デモ一覧",
      }}
      featureDemoExplain
    />
  );
}
