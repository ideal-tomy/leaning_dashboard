import { redirect } from "next/navigation";
import { VisaDraftDemo } from "@/components/feature-demos/visa-draft-demo";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VisaPdfFeatureDemoPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  if (industry === "staffing" && role === "client") {
    redirect(withDemoQuery("/feature-demos", industry, role));
  }

  return <VisaDraftDemo variant="feature-demos" />;
}
