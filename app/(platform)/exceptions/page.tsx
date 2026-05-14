import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export default function ExceptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exception management" description="Dedicated lane for low confidence, tampering, mismatch, and policy exceptions." />
      <EmptyState title="Exception workflow placeholder" description="Future orchestration and escalation states will use this module boundary." />
    </div>
  );
}
