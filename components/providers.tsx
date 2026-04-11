"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";
import { IndustryProvider } from "@/components/industry-context";
import { DemoRoleProvider } from "@/components/demo-role-context";
import { SalesDemoBeatProvider } from "@/components/story-demo/sales-demo-beat-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <IndustryProvider>
          <DemoRoleProvider>
            <SalesDemoBeatProvider>{children}</SalesDemoBeatProvider>
          </DemoRoleProvider>
        </IndustryProvider>
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
