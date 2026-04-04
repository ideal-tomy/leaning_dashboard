"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";
import { IndustryProvider } from "@/components/industry-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <IndustryProvider>{children}</IndustryProvider>
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
