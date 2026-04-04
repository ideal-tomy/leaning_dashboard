import type { ReactNode } from "react";
import { WorkerSubnav } from "@/components/worker-subnav";

export default function WorkerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md space-y-4 px-1 pb-12">
      <WorkerSubnav />
      {children}
    </div>
  );
}
