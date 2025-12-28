"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  description?: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "orange";
  badge?: string | number;
}

interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50 hover:bg-blue-100",
    text: "text-blue-700",
    icon: "bg-blue-100 text-blue-600",
  },
  green: {
    bg: "bg-green-50 hover:bg-green-100",
    text: "text-green-700",
    icon: "bg-green-100 text-green-600",
  },
  yellow: {
    bg: "bg-amber-50 hover:bg-amber-100",
    text: "text-[hsl(45,56%,40%)]",
    icon: "bg-amber-100 text-[hsl(45,56%,50%)]",
  },
  red: {
    bg: "bg-red-50 hover:bg-red-100",
    text: "text-red-700",
    icon: "bg-red-100 text-red-600",
  },
  purple: {
    bg: "bg-purple-50 hover:bg-purple-100",
    text: "text-purple-700",
    icon: "bg-purple-100 text-purple-600",
  },
  orange: {
    bg: "bg-orange-50 hover:bg-orange-100",
    text: "text-orange-700",
    icon: "bg-orange-100 text-orange-600",
  },
};

export function QuickActions({
  title = "Quick Actions",
  actions,
  columns = 3,
}: QuickActionsProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const ActionButton = ({ action }: { action: QuickAction }) => {
    const classes = colorClasses[action.color || "blue"];
    const Icon = action.icon;

    const content = (
      <div
        className={`${classes.bg} rounded-lg p-4 transition-all duration-200 hover:shadow-md border-2 border-transparent hover:border-[hsl(45,56%,55%)] cursor-pointer`}
      >
        <div className="flex items-start gap-3">
          <div className={`${classes.icon} p-2.5 rounded-lg shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${classes.text} text-sm`}>
                {action.label}
              </h4>
              {action.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {action.badge}
                </span>
              )}
            </div>
            {action.description && (
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {action.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    if (action.href) {
      return <Link href={action.href}>{content}</Link>;
    }

    return (
      <button onClick={action.onClick} className="w-full text-left">
        {content}
      </button>
    );
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-[hsl(218,31%,18%)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${gridCols[columns]} gap-3`}>
          {actions.map((action, index) => (
            <ActionButton key={index} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
