"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, Check, FileText, PenLine, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { cn } from "@/lib/utils";
import { withDemoQuery } from "@/lib/demo-query";
import { FeatureDemoExplainSection } from "@/components/feature-demos/feature-demo-explain-section";
import { FeatureDemoSiblingGrid } from "@/components/feature-demos/feature-demo-sibling-grid";

const DEMO_SAVE_URL =
  "https://vault.haken-dash.example.jp/drafts/visa-renewal-pack-demo.pdf";

const STEPS = [
  { id: 0, label: "入力", icon: PenLine },
  { id: 1, label: "プレビュー", icon: FileText },
  { id: 2, label: "保存", icon: Check },
] as const;

type FormState = {
  fullName: string;
  passportNo: string;
  passportExpiry: string;
  residenceExpiry: string;
};

const OCR_DUMMY: FormState = {
  fullName: "SILVA KUMARA PERERA",
  passportNo: "N1234567",
  passportExpiry: "2030-11-30",
  residenceExpiry: "2027-03-15",
};

export type VisaDraftDemoVariant = "documents" | "feature-demos";

export function VisaDraftDemo({ variant }: { variant: VisaDraftDemoVariant }) {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const profile = getIndustryProfile(industry);
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    passportNo: "",
    passportExpiry: "",
    residenceExpiry: "",
  });
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const isFeature = variant === "feature-demos";
  const backHref = isFeature
    ? withDemoQuery("/feature-demos", industry, role)
    : withDemoQuery("/documents", industry, role);
  const backLabel = isFeature ? "技術デモ一覧" : `${profile.labels.documents}管理`;

  const update = useCallback((key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const onFileChange = useCallback(() => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    toast.info("画像から読み取り中…（デモ）");
    window.setTimeout(() => {
      setForm(OCR_DUMMY);
      setOcrLoading(false);
      toast.success("抽出完了（デモ）");
    }, 1100);
  }, []);

  const canGoPreview =
    form.fullName.trim() &&
    form.passportNo.trim() &&
    form.passportExpiry.trim() &&
    form.residenceExpiry.trim();

  const runSaveDemo = useCallback(() => {
    setSavedUrl(DEMO_SAVE_URL);
    toast.success("PDF を保存しました（デモ）");
  }, []);

  return (
    <TemplatePageStack>
      <MobileParentBackLink href={backHref} label={backLabel} />

      {!isFeature ? (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-2 hidden gap-1 self-start md:inline-flex"
        >
          <Link href={withDemoQuery("/documents", industry, role)}>
            <ArrowLeft className="size-4" />
            {profile.labels.documents}管理に戻る
          </Link>
        </Button>
      ) : null}

      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <TemplatePageHeader
            title="申請書類下書き（デモ）"
            description="下書きはブラウザ内のみです。保存先URLは架空のデモ表示です。"
          />
        </div>
        <Badge variant="ai" className="shrink-0">
          デモ
        </Badge>
      </div>

      <nav
        className="flex flex-wrap items-center gap-2 text-sm"
        aria-label="手順"
      >
        {STEPS.map(({ id, label, icon: Icon }, i) => (
          <div key={id} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="text-muted" aria-hidden>
                →
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (id === 1 && !canGoPreview) return;
                if (id === 2 && !canGoPreview) return;
                setStep(id);
              }}
              disabled={(id === 1 || id === 2) && !canGoPreview}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors",
                step === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:bg-surface",
                (id === 1 || id === 2) && !canGoPreview && "opacity-50"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </button>
          </div>
        ))}
      </nav>

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. 画像または手入力</CardTitle>
            <p className="text-sm text-muted">
              パスポート等の画像を選ぶと、デモ用の固定値がフォームに入ります。手で編集もできます。
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="visa-demo-file"
                className="text-sm font-medium leading-none"
              >
                画像アップロード（任意）
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileRef}
                  id="visa-demo-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="size-4" />
                  ファイルを選択
                </Button>
                {ocrLoading ? (
                  <div className="flex min-w-[8rem] flex-1 items-center gap-2">
                    <Skeleton className="h-4 max-w-xs flex-1" />
                    <span className="text-xs text-muted">読み取り中…</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="f-name" className="text-sm font-medium leading-none">
                  氏名（ローマ字等）
                </label>
                <Input
                  id="f-name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="例: YAMADA TARO"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="f-passport" className="text-sm font-medium leading-none">
                  パスポート番号
                </label>
                <Input
                  id="f-passport"
                  value={form.passportNo}
                  onChange={(e) => update("passportNo", e.target.value)}
                  placeholder="例: TR1234567"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="f-pexp" className="text-sm font-medium leading-none">
                  パスポート有効期限
                </label>
                <Input
                  id="f-pexp"
                  type="date"
                  className="tabular-nums"
                  value={form.passportExpiry}
                  onChange={(e) => update("passportExpiry", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="f-rexp" className="text-sm font-medium leading-none">
                  在留期限（予定含む）
                </label>
                <Input
                  id="f-rexp"
                  type="date"
                  className="tabular-nums"
                  value={form.residenceExpiry}
                  onChange={(e) => update("residenceExpiry", e.target.value)}
                />
              </div>
            </div>

            <Button
              type="button"
              disabled={!canGoPreview}
              onClick={() => setStep(1)}
            >
              プレビューへ
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. 提出用下書き（プレビュー）</CardTitle>
            <p className="text-sm text-muted">
              指定フォーマットに沿ったテキスト案です（デモ表示）。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-surface/50 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {`【ビザ更新・在留申請 下書き（デモ）】

1. 氏名（旅券記載）: ${form.fullName}
2. 旅券番号: ${form.passportNo}
3. 旅券有効期限: ${form.passportExpiry}
4. 在留期間満了日: ${form.residenceExpiry}

※ 本欄はデモ用の自動整形です。実際の申請は最新様式と法令に従ってください。`}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                戻って修正
              </Button>
              <Button type="button" onClick={() => setStep(2)}>
                保存ステップへ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. PDF で保存（デモ）</CardTitle>
            <p className="text-sm text-muted">
              実際のファイルは生成しません。保存完了の演出のみです。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!savedUrl ? (
              <Button type="button" onClick={runSaveDemo}>
                PDF で保存（デモ）
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-success">
                  保存しました（デモ）
                </p>
                <p className="text-xs text-muted">想定ストレージURL:</p>
                <code className="block break-all rounded-md border border-border bg-surface px-3 py-2 text-xs">
                  {savedUrl}
                </code>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                プレビューに戻る
              </Button>
              <Button variant="secondary" asChild>
                <Link
                  href={
                    isFeature
                      ? withDemoQuery("/feature-demos", industry, role)
                      : withDemoQuery("/documents", industry, role)
                  }
                >
                  {isFeature ? "技術デモ一覧へ" : "書類管理へ"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isFeature ? (
        <>
          <FeatureDemoExplainSection slug="visa-pdf" />
          <FeatureDemoSiblingGrid currentSlug="visa-pdf" />
        </>
      ) : null}
    </TemplatePageStack>
  );
}
