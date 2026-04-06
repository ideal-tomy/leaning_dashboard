"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { IndustryPageHints } from "@/lib/industry-page-hints";

type Props = {
  docHints: IndustryPageHints["documents"];
};

export function PassportOcrDemo({ docHints }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function runScan() {
    setOpen(true);
    setLoading(true);
    toast.info("OCR 処理中…（デモ）");
    window.setTimeout(() => {
      setLoading(false);
      toast.success("抽出完了（デモ）");
    }, 1000);
  }

  return (
    <>
      <Button type="button" onClick={runScan} className="gap-2 min-h-11">
        <ScanLine className="size-4" />
        {docHints.ocrButtonLabel}
      </Button>

      <Sheet
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setLoading(false);
        }}
      >
        <SheetContent title={docHints.sheetTitle}>
          {loading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{docHints.ocrSampleName}</p>
              <ul className="list-inside list-disc text-muted">
                {docHints.ocrSampleLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
