"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, BarChart3, ClipboardList, FileSpreadsheet, Gauge, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/config/navigation";

const navIcons = {
  dashboard: Gauge,
  applications: ClipboardList,
  review: ShieldCheck,
  exceptions: AlertTriangle,
  reports: FileSpreadsheet,
  analytics: BarChart3,
  admin: Settings
};

export function ShellNavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = navIcons[item.icon];

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/72 transition-colors hover:bg-white/10 hover:text-white",
        isActive && "bg-sidebar-active text-white"
      )}
    >
      <Icon className="size-4" />
      <span>{item.title}</span>
    </Link>
  );
}
