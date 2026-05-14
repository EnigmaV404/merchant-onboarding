import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin configuration" description="Policy, checklist, verification, SLA, and role configuration entry point." />
      <EmptyState title="Configuration placeholder" description="Admin-managed rules will build from the Prisma policy and checklist models." />
    </div>
  );
}
