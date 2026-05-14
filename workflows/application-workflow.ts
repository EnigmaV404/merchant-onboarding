import { ApplicationStatus } from "@/types/domain";
import { Role } from "@/types/auth";

type TransitionRule = {
  from: ApplicationStatus[];
  to: ApplicationStatus;
  roles: Role[];
};

export const applicationTransitionRules: TransitionRule[] = [
  {
    from: ["DRAFT", "PENDING_DOCUMENTS", "SENT_BACK"],
    to: "READY_FOR_REVIEW",
    roles: ["OPERATIONS_AGENT", "ADMIN"]
  },
  {
    from: ["READY_FOR_REVIEW"],
    to: "IN_REVIEW",
    roles: ["COMPLIANCE_REVIEWER", "ADMIN"]
  },
  {
    from: ["IN_REVIEW", "EXCEPTION_REVIEW_REQUIRED"],
    to: "APPROVED",
    roles: ["COMPLIANCE_REVIEWER", "ADMIN"]
  },
  {
    from: ["IN_REVIEW", "EXCEPTION_REVIEW_REQUIRED"],
    to: "SENT_BACK",
    roles: ["COMPLIANCE_REVIEWER", "ADMIN"]
  }
];

export function canTransitionApplication(from: ApplicationStatus, to: ApplicationStatus, role: Role) {
  return applicationTransitionRules.some((rule) => rule.to === to && rule.from.includes(from) && rule.roles.includes(role));
}
