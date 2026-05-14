export type AuditEventInput = {
  actorId?: string;
  applicationId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export async function recordAuditEvent(event: AuditEventInput) {
  return event;
}
