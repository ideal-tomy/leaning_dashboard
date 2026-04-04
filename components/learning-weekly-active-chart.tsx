"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

const weeklyDemo = [
  { week: "3/10週", activePct: 58 },
  { week: "3/17週", activePct: 61 },
  { week: "3/24週", activePct: 55 },
  { week: "3/31週", activePct: 63 },
  { week: "4/7週", activePct: 67 },
];

type Props = {
  chartHeightClass?: string;
};

export function LearningWeeklyActiveChart({
  chartHeightClass = "h-56",
}: Props) {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <TrendingUp className="size-4 text-primary" aria-hidden />
        週次アクティブ率（ログインありの割合・デモ）
      </p>
      <p className="text-xs text-muted">
        全候補者を母数とした、eラーニング週1回以上アクセスの割合のイメージです。
      </p>
      <div className={chartHeightClass}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyDemo} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis
              domain={[40, 80]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value) => {
                const n = typeof value === "number" ? value : Number(value);
                const safe = Number.isFinite(n) ? n : 0;
                return [`${safe}%`, "アクティブ率"];
              }}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="activePct"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
