export type DemoRole = "admin" | "client" | "worker";

export const demoRoles: DemoRole[] = ["admin", "client", "worker"];

export const defaultDemoRole: DemoRole = "admin";

export function parseDemoRole(value: string | null | undefined): DemoRole {
  if (value === "admin" || value === "client" || value === "worker") {
    return value;
  }
  return defaultDemoRole;
}

export const demoRoleLabelJa: Record<DemoRole, string> = {
  admin: "支援機関",
  client: "工場",
  worker: "ワーカー",
};
