import { Permission, Role } from "@/types/auth";

export const rolePermissions: Record<Role, Permission[]> = {
  OPERATIONS_AGENT: [
    "dashboard:view",
    "application:create",
    "application:update_assigned",
    "document:upload",
    "checklist:update_operations",
    "review:submit",
    "report:view",
    "report:export"
  ],
  COMPLIANCE_REVIEWER: [
    "dashboard:view",
    "application:review",
    "application:approve",
    "application:reject",
    "application:send_back",
    "document:verify",
    "waiver:create",
    "report:view",
    "report:export"
  ],
  TEAM_LEAD: [
    "dashboard:view",
    "application:update_assigned",
    "application:review",
    "application:reassign",
    "report:view",
    "report:export"
  ],
  ADMIN: [
    "admin:configure_policy",
    "admin:manage_roles",
    "admin:manage_sla",
    "admin:manage_verification",
    "audit:view"
  ]
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
