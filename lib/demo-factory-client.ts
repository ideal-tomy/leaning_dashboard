import type { ClientCompany } from "@data/types";

/** 工場ロール（client）デモでログインしている派遣先の固定 ID */
export const DEMO_FACTORY_CLIENT_ID = "client-marufuku" as const;

export function getDemoFactoryClient(
  clients: ClientCompany[]
): ClientCompany | undefined {
  return clients.find((c) => c.id === DEMO_FACTORY_CLIENT_ID);
}
