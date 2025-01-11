import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
    <div className={cn("bg-gray-900 rounded-lg p-4 shadow-lg", className)}>
      <h3 className="text-gray-200 font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
