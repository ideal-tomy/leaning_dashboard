"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultIndustryKey,
  parseEnabledIndustryKey,
} from "@/lib/industry-profiles";
import { getRoleFromSearchParams } from "@/lib/demo-query";
import {
  defaultDemoRole,
  parseDemoRole,
  type DemoRole,
} from "@/lib/demo-role";
import {
  readStoredDemoRole,
  writeStoredDemoRole,
} from "@/lib/demo-role-storage";

type DemoRoleContextValue = {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
};

const DemoRoleContext = createContext<DemoRoleContextValue | null>(null);

export function useDemoRole(): DemoRoleContextValue {
  const v = useContext(DemoRoleContext);
  if (!v) {
    throw new Error("useDemoRole must be used within DemoRoleProvider");
  }
  return v;
}

export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = useMemo(
    () => getRoleFromSearchParams(searchParams),
    [searchParams]
  );

  useEffect(() => {
    const current = searchParams.get("role");
    if (current) {
      writeStoredDemoRole(parseDemoRole(current));
      return;
    }
    const stored = readStoredDemoRole();
    if (stored && stored !== defaultDemoRole) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("role", stored);
      if (!params.get("industry")) {
        params.set("industry", defaultIndustryKey);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
  }, [pathname, router, searchParams]);

  const setRole = useCallback(
    (next: DemoRole) => {
      writeStoredDemoRole(next);
      const params = new URLSearchParams(searchParams.toString());
      params.set("role", next);
      const ind = params.get("industry");
      if (!ind) {
        params.set("industry", defaultIndustryKey);
      } else {
        params.set("industry", parseEnabledIndustryKey(ind));
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
      router.refresh();
    },
    [pathname, router, searchParams]
  );

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return (
    <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>
  );
}
