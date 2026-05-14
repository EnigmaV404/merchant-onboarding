export type MerchantCategory = "RETAIL" | "FOOD_AND_BEVERAGE" | "DIGITAL_SERVICES";

export type ApplicationStatus =
  | "DRAFT"
  | "PENDING_DOCUMENTS"
  | "VERIFICATION_IN_PROGRESS"
  | "READY_FOR_REVIEW"
  | "IN_REVIEW"
  | "EXCEPTION_REVIEW_REQUIRED"
  | "SENT_BACK"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"
  | "AUTO_APPROVED";

export type RiskStatus = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ChecklistItemStatus = "NOT_STARTED" | "PENDING" | "UPLOADED" | "VERIFIED" | "FAILED" | "WAIVED";

export type DocumentStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "OCR_COMPLETE"
  | "VERIFICATION_PASSED"
  | "VERIFICATION_FAILED"
  | "TAMPERED"
  | "MANUAL_REVIEW_REQUIRED"
  | "REJECTED"
  | "VERIFIED";
