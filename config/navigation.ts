import type { Route } from "next";
import { Permission } from "@/types/auth";

export type NavIconName = "dashboard" | "applications" | "review" | "exceptions" | "reports" | "analytics" | "admin";

export type NavItem = {
  title: string;
  href: Route;
  icon: NavIconName;
  permission?: Permission;
};

export const platformNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    permission: "dashboard:view"
  },
  {
    title: "Applications",
    href: "/applications",
    icon: "applications",
    permission: "application:update_assigned"
  },
  {
    title: "Review",
    href: "/review",
    icon: "review",
    permission: "application:review"
  },
  {
    title: "Exceptions",
    href: "/exceptions",
    icon: "exceptions",
    permission: "application:review"
  },
  {
    title: "Reports",
    href: "/reports" as Route,
    icon: "reports",
    permission: "report:view"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "analytics",
    permission: "report:view"
  },
  {
    title: "Admin",
    href: "/admin",
    icon: "admin",
    permission: "admin:configure_policy"
  }
];
