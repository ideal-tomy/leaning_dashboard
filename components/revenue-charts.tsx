"use client";

import { useId } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BreakevenPoint, RevenueTrendRow } from "@/lib/revenue-demo";
import { getAccentBarShades } from "@/lib/industry-theme";

const MUTED = "#94a3b8";
const SUCCESS = "#10b981";
const DANGER = "#ef4444";

type MonthlyProps = { data: RevenueTrendRow[]; accentHex: string };

export function RevenueMonthlyChart({ data, accentHex }: MonthlyProps) {
  const gid = useId().replace(/:/g, "");
  const fillId = `revFill-${gid}`;
  return (
    <div className="h-[280px] w-full min-h-[240px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentHex} stopOpacity={0.35} />
              <stop offset="100%" stopColor={accentHex} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v) => `${v}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const n =
                typeof value === "number"
                  ? value
                  : Number(value ?? 0);
              const label =
                name === "amountManYen"
                  ? "当月（万円）"
                  : name === "prevYearManYen"
                    ? "前年同月（万円）"
                    : String(name);
              return [`${n} 万円`, label];
            }}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.month
                ? `集計月: ${String(payload[0].payload.month)}`
                : ""
            }
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) =>
              value === "amountManYen"
                ? "当月売上（紹介料ベース・万円）"
                : value === "prevYearManYen"
                  ? "前年同月（万円）"
                  : value
            }
          />
          <Area
            type="monotone"
            dataKey="amountManYen"
            name="amountManYen"
            stroke={accentHex}
            strokeWidth={2}
            fill={`url(#${fillId})`}
          />
          <Line
            type="monotone"
            dataKey="prevYearManYen"
            name="prevYearManYen"
            stroke={MUTED}
            strokeWidth={2}
            dot={{ r: 3, fill: MUTED }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

type BreakevenProps = {
  points: BreakevenPoint[];
  breakevenMonth: number | null;
  cacManYen: number;
  avgMarginManYen: number;
  /** 0〜1（年次継続率） */
  annualRetentionDecimal: number;
  accentHex: string;
};

export function RevenueBreakevenChart({
  points,
  breakevenMonth,
  cacManYen,
  avgMarginManYen,
  annualRetentionDecimal,
  accentHex,
}: BreakevenProps) {
  const chartData = points.map((p) => ({
    ...p,
    cacLine: cacManYen,
  }));

  return (
    <div className="h-[300px] w-full min-h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            label={{
              value: "配属後の経過月数（1名あたりモデル）",
              position: "insideBottom",
              offset: -12,
              fontSize: 11,
              fill: "#64748b",
            }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const n =
                typeof value === "number"
                  ? value
                  : Number(value ?? 0);
              if (name === "cumulativeManYen") return [`${n} 万円`, "累積粗利（見込み）"];
              if (name === "cacLine") return [`${n} 万円`, "平均CAC（回収目標）"];
              if (name === "survivalApprox") return [`${n}%`, "月次モデル生存率"];
              return [String(n), String(name)];
            }}
            labelFormatter={(m) => `${m} ヶ月目`}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) =>
              value === "cumulativeManYen"
                ? "累積粗利（万円）"
                : value === "cacLine"
                  ? "平均CAC（万円）"
                  : value === "survivalApprox"
                    ? "生存率（右軸）"
                    : value
            }
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cacLine"
            name="cacLine"
            stroke={DANGER}
            strokeDasharray="6 4"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cumulativeManYen"
            name="cumulativeManYen"
            stroke={accentHex}
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="survivalApprox"
            name="survivalApprox"
            stroke={MUTED}
            strokeWidth={1}
            dot={false}
            strokeDasharray="4 4"
          />
          {breakevenMonth != null ? (
            <ReferenceLine
              x={breakevenMonth}
              stroke={SUCCESS}
              strokeDasharray="4 4"
              label={{
                value: `損益分岐 ${breakevenMonth}ヶ月目`,
                position: "top",
                fill: SUCCESS,
                fontSize: 11,
              }}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-muted">
        前提: 加重平均の月次粗利{" "}
        <span className="font-medium text-foreground">{avgMarginManYen}</span>{" "}
        万円/月・年次継続率{" "}
        <span className="font-medium text-foreground">
          {(annualRetentionDecimal * 100).toFixed(1)}%
        </span>
        。単純デモモデル（実務の契約条件・按分とは一致しません）。
      </p>
    </div>
  );
}

type CacRow = { label: string; jpy: number; pct: number };

export function RevenueCacBreakdownChart({
  rows,
  accentHex,
}: {
  rows: CacRow[];
  accentHex: string;
}) {
  const data = rows.map((r) => ({
    ...r,
    manYen: Math.round(r.jpy / 10_000),
  }));
  const barShades = getAccentBarShades(accentHex);

  return (
    <div className="h-[220px] w-full min-h-[200px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tickFormatter={(v) => `${v}万`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={148}
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(_value, _name, item) => {
              const payload = item?.payload as (CacRow & { manYen: number }) | undefined;
              if (!payload) return ["", ""];
              return [
                `${payload.manYen} 万円（${payload.pct}%）`,
                "内訳",
              ];
            }}
          />
          <Bar dataKey="manYen" name="構成比" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={barShades[Math.min(i, barShades.length - 1)]!}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
