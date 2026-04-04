"use client";

import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import type { DemoRole } from "@/lib/demo-role";
import {
  avgEthicsModules,
  avgJpProgress,
  demoWorkers,
} from "@/lib/demo-workers";

const growthChartData = demoWorkers.slice(0, 6).map((w) => ({
  name: w.displayNameEn.split(" ")[0] ?? w.displayNameEn,
  jp: w.jpProgressPct,
  ethics: w.ethicsDoneCount * 15,
}));

type Props = {
  role: DemoRole;
  /** チャートの高さ（px 相当） */
  chartHeightClass?: string;
};

export function LearningGrowthChart({
  role,
  chartHeightClass = "h-56",
}: Props) {
  const avgJp = avgJpProgress();
  const avgEth = avgEthicsModules();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="secondary" className="gap-1">
          <BarChart3 className="size-3.5" />
          平均日本語到達 {avgJp}%
        </Badge>
        <Badge variant="outline" className="gap-1">
          倫理モジュール平均 {avgEth} / 6
        </Badge>
      </div>
      <div className={`w-full min-w-0 ${chartHeightClass}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={growthChartData}
            margin={{ top: 8, right: 8, left: -12, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={52}
            />
            <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} width={32} />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              formatter={(v, key) => {
                const n = typeof v === "number" ? v : Number(v);
                const safe = Number.isFinite(n) ? n : 0;
                return key === "jp"
                  ? [`${safe}%`, "日本語"]
                  : [safe, "倫理(目安)"];
              }}
            />
            <Bar dataKey="jp" fill="#2563eb" radius={[4, 4, 0, 0]} name="jp" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted">
        {role === "client"
          ? "現場に説明しやすい集計です（デモデータ）。"
          : "全ワーカー横断のサマリー（デモデータ）。チャートは登録スタッフの一部を表示しています。"}
      </p>
    </div>
  );
}
