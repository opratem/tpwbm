"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { useMemo } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "orange";
  loading?: boolean;
  chart?: {
    data: number[];
    labels?: string[];
  };
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    trend: "text-blue-600",
    border: "border-blue-100",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    trend: "text-green-600",
    border: "border-green-100",
  },
  yellow: {
    bg: "bg-amber-50",
    icon: "text-[hsl(45,56%,55%)]",
    trend: "text-[hsl(45,56%,55%)]",
    border: "border-amber-100",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    trend: "text-red-600",
    border: "border-red-100",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    trend: "text-purple-600",
    border: "border-purple-100",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    trend: "text-orange-600",
    border: "border-orange-100",
  },
};

const MiniChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 30"
      className="w-full h-8"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className="text-[hsl(45,56%,55%)]"
      />
    </svg>
  );
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
  loading = false,
  chart,
}: StatsCardProps) {
  const classes = colorClasses[color];

  const trendIcon = useMemo(() => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  }, [trend]);

  const trendColor = useMemo(() => {
    if (!trend) return "";
    if (trend.value > 0) return "text-green-600 bg-green-50";
    if (trend.value < 0) return "text-red-600 bg-red-50";
    return "text-slate-600 bg-slate-50";
  }, [trend]);

  return (
    <Card
      className={`${classes.border} border-2 transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-105 ${loading ? "animate-pulse" : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[hsl(218,31%,18%)]">
          {title}
        </CardTitle>
        <div className={`${classes.bg} p-2 rounded-lg`}>
          <Icon className={`h-4 w-4 ${classes.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-[hsl(218,31%,18%)]">
                  {value}
                </div>
                {trend && (
                  <Badge
                    variant="secondary"
                    className={`${trendColor} gap-1 text-xs font-medium`}
                  >
                    {trendIcon}
                    {Math.abs(trend.value)}%
                  </Badge>
                )}
              </div>

              {description && (
                <p className="text-xs text-slate-600">{description}</p>
              )}

              {trend && (
                <p className="text-xs text-slate-500">{trend.label}</p>
              )}

              {chart && chart.data.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <MiniChart data={chart.data} />
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
