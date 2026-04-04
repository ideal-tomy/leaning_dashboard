import Link from "next/link";
import { ExternalLink, FolderLock } from "lucide-react";
import type { StoredDocumentFileDemo, StoredDocumentStatusDemo } from "@data/types";
import { Badge } from "@/components/ui/badge";
import type { DemoRole } from "@/lib/demo-role";

function statusJa(s: StoredDocumentStatusDemo): string {
  switch (s) {
    case "draft":
      return "ドラフト";
    case "final":
      return "確定";
    case "archived":
      return "アーカイブ";
    default:
      return s;
  }
}

type Props = {
  items: StoredDocumentFileDemo[] | undefined;
  role: DemoRole;
};

export function CandidateDocumentVault({ items, role }: Props) {
  const showUrls = role === "admin";

  if (!items?.length) {
    return (
      <p className="text-sm text-muted">
        保管庫に登録されたファイルはまだありません（デモ）。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-surface/80 text-xs text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">書類名</th>
            <th className="px-3 py-2 font-medium">カテゴリ</th>
            <th className="px-3 py-2 font-medium">更新日</th>
            <th className="px-3 py-2 font-medium">状態</th>
            <th className="px-3 py-2 font-medium">保管・リンク</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-b border-border/80 last:border-0">
              <td className="px-3 py-2 font-medium text-foreground">
                {row.labelJa}
                {row.fileName ? (
                  <p className="mt-0.5 text-xs font-normal text-muted">
                    {row.fileName}
                  </p>
                ) : null}
              </td>
              <td className="px-3 py-2 text-muted">{row.categoryJa}</td>
              <td className="px-3 py-2 tabular-nums text-muted">
                {row.updatedAt}
              </td>
              <td className="px-3 py-2">
                <Badge variant="outline">{statusJa(row.status)}</Badge>
              </td>
              <td className="px-3 py-2">
                {showUrls ? (
                  <Link
                    href={row.storageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    開く
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <FolderLock className="size-3.5 shrink-0" aria-hidden />
                    支援機関ドキュメント管理内（デモ）
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
