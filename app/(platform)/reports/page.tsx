import { ReportsWorkspace } from "@/components/reports/reports-workspace";
import { getCurrentSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";

export default async function ReportsPage() {
  const session = await getCurrentSession();

  return <ReportsWorkspace canExport={hasPermission(session.user.role, "report:export")} />;
}
