import type { Candidate, CandidatePipelineStatus, ClientCompany } from "@data/types";
import * as staffing from "@/lib/demo-data.staffing";
import * as realEstate from "@/lib/demo-data.real-estate";
import * as professional from "@/lib/demo-data.professional";
import * as construction from "@/lib/demo-data.construction";
import * as medical from "@/lib/demo-data.medical";
import * as sales from "@/lib/demo-data.sales";
import * as logistics from "@/lib/demo-data.logistics";
import * as education from "@/lib/demo-data.education";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";

type DemoDataModule = {
  clients: ClientCompany[];
  candidates: Candidate[];
  getClientById: (id: string) => ClientCompany | undefined;
  getCandidateById: (id: string) => Candidate | undefined;
  getPipelineCounts: () => Record<CandidatePipelineStatus, number>;
  countN3OrAbove: () => number;
  getTopCandidatesByAiScore: (limit: number) => Candidate[];
  countDocumentAlerts: () => number;
  totalOpenSlots: () => number;
  monthlyRevenueTrend: () => { month: string; amountManYen: number }[];
  scoreCandidateForClient: (
    candidate: Candidate,
    client: ClientCompany
  ) => { pct: number; reason: string };
  getMatchesForClient: (
    clientId: string
  ) => { candidate: Candidate; pct: number; reason: string }[];
};

const registry: Record<EnabledIndustryKey, DemoDataModule> = {
  staffing,
  "real-estate": realEstate,
  professional,
  construction,
  medical,
  sales,
  logistics,
  education,
};

export function getIndustryDemoData(industry: EnabledIndustryKey): DemoDataModule {
  return registry[industry];
}
