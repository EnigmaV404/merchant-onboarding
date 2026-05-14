import { AgentDashboard, LeadDashboard, ReviewerDashboard } from "@/components/dashboard/role-dashboards";
import { getCurrentSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (session.user.profileId === "reviewer") {
    return <ReviewerDashboard />;
  }

  if (session.user.profileId === "lead") {
    return <LeadDashboard />;
  }

  return <AgentDashboard />;
}
