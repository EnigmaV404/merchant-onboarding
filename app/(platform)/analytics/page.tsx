import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Operational reporting foundations for TAT, ageing, send-backs, waivers, and STP." />
      <EmptyState title="Reporting placeholder" description="Charts and exports can be layered here without changing the shell." />
    </div>
  );
}
