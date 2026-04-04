"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

/** OCR 擬似フロー（API なし） */
export function DemoFab() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  function runOcrDemo() {
    setOpen(true);
    setPhase("loading");
    toast.info("パスポート画像を処理しています…（デモ）");
    setTimeout(() => {
      setPhase("done");
      toast.success("OCR が完了しました（デモ）");
    }, 1200);
  }

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={runOcrDemo}
          aria-label="パスポートスキャン（デモ）"
        >
          <ScanLine className="size-6" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={(o) => {
        setOpen(o);
        if (!o) setPhase("idle");
      }}>
        <SheetContent title="OCR 結果プレビュー">
          {phase === "loading" && (
            <div className="space-y-3 py-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
          {phase === "done" && (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-foreground">抽出結果（サンプル: Nuwan Kumara）</p>
              <ul className="space-y-1 text-muted">
                <li>氏名（英）: Pathirana Gamage Nuwan Kumara</li>
                <li>氏名（カナ）: ヌワン クマラ パティラナ ガマゲ</li>
                <li>生年月日: 1998-04-15</li>
                <li>パスポート: N1234567 / 2030-05-10</li>
              </ul>
              <Button className="w-full" variant="secondary" onClick={() => setOpen(false)}>
                閉じる
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
