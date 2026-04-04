import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Candidate } from "@data/types";
import type { ReactNode } from "react";

type Props = {
  candidate: Candidate;
  profileCardTitle: string;
  adminContact: boolean;
};

function yesNoJa(v: boolean): string {
  return v ? "あり" : "なし";
}

function ProfileField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-x-2",
        className
      )}
    >
      <dt className="shrink-0 text-[11px] font-medium leading-tight text-muted sm:w-[7.75rem]">
        {label}
      </dt>
      <dd className="min-w-0 text-sm leading-snug sm:flex-1">{children}</dd>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="border-b border-border/80 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
      {children}
    </h3>
  );
}

export function CandidateBasicProfileFull({
  candidate: c,
  profileCardTitle,
  adminContact,
}: Props) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{profileCardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-2 text-sm">
        <section className="space-y-2">
          <SectionLabel>識別・属性</SectionLabel>
          <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileField label="表示名">
              <span className="font-medium">{c.displayName}</span>
            </ProfileField>
            <ProfileField label="法定氏名">
              {c.legalNameFull}
            </ProfileField>
            <ProfileField label="カタカナ">{c.nameKatakana}</ProfileField>
            <ProfileField label="年齢 / 性別">
              {c.age} / {c.gender === "male" ? "男性" : "女性"}
            </ProfileField>
            <ProfileField label="国籍">{c.nationality}</ProfileField>
            <ProfileField label="生年月日">
              <span className="tabular-nums">{c.birthDate}</span>
            </ProfileField>
            <ProfileField label="出生地" className="sm:col-span-2 lg:col-span-3">
              {c.birthPlace}
            </ProfileField>
            <ProfileField label="住所" className="sm:col-span-2 lg:col-span-3">
              {c.residence.country} {c.residence.city}
              {c.residence.note ? `（${c.residence.note}）` : ""}
            </ProfileField>
            <ProfileField label="候補者登録日">
              <span className="tabular-nums text-muted">{c.registeredAt}</span>
            </ProfileField>
          </dl>
        </section>

        <section className="space-y-2">
          <SectionLabel>日本語・資格</SectionLabel>
          <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            <ProfileField label="日本語（目安）">
              <Badge variant="secondary" className="font-normal">
                {c.jlpt}
              </Badge>
            </ProfileField>
            {c.jlptNote ? (
              <ProfileField label="日本語メモ" className="sm:col-span-2">
                {c.jlptNote}
              </ProfileField>
            ) : null}
            <ProfileField label="特定技能（食品）志望">
              {yesNoJa(c.tokuteiGinoFoodManufacturing)}
            </ProfileField>
            <ProfileField label="スリランカ免許（参考）">
              {yesNoJa(c.driversLicenseLk)}
            </ProfileField>
          </dl>
        </section>

        <section className="space-y-2">
          <SectionLabel>連絡先</SectionLabel>
          {adminContact ? (
            <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
              <ProfileField label="メール">
                <span className="break-all">{c.contact.email}</span>
              </ProfileField>
              <ProfileField label="電話">
                <span className="break-all">{c.contact.phone}</span>
              </ProfileField>
            </dl>
          ) : (
            <p className="text-xs leading-snug text-muted">
              個別の連絡先は支援機関が管理しています。ご連絡は支援機関窓口からお願いします（工場向けデモ表示）。
            </p>
          )}
        </section>

        <section className="space-y-2">
          <SectionLabel>プロフィール・タグ</SectionLabel>
          <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
            <div className="grid gap-3 md:grid-cols-2 lg:col-span-2">
              <div className="min-w-0 rounded-lg border border-border/60 bg-surface/30 px-2.5 py-2">
                <p className="text-[11px] font-medium text-muted">背景・特徴</p>
                <p className="mt-1 text-sm leading-snug">{c.backgroundSummary}</p>
              </div>
              <div className="min-w-0 rounded-lg border border-border/60 bg-surface/30 px-2.5 py-2">
                <p className="text-[11px] font-medium text-muted">学歴・職歴</p>
                <p className="mt-1 text-sm leading-snug">
                  {c.educationWorkHistory}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 lg:border-l lg:border-border/60 lg:pl-4">
              <p className="text-[11px] font-medium text-muted">スキルタグ</p>
              <div className="flex flex-wrap gap-1">
                {c.skillTags.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
