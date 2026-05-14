export type Role = "OPERATIONS_AGENT" | "COMPLIANCE_REVIEWER" | "TEAM_LEAD" | "ADMIN";

export type Permission =
  | "application:create"
  | "application:update_assigned"
  | "application:review"
  | "application:approve"
  | "application:reject"
  | "application:send_back"
  | "application:reassign"
  | "document:upload"
  | "document:verify"
  | "checklist:update_operations"
  | "review:submit"
  | "waiver:create"
  | "dashboard:view"
  | "report:view"
  | "report:export"
  | "admin:configure_policy"
  | "admin:manage_roles"
  | "admin:manage_sla"
  | "admin:manage_verification"
  | "audit:view";
