import { AgentApplicationsWorkspace } from "@/components/applications/agent-applications-workspace";
import { getCurrentSession } from "@/lib/auth/session";

export default async function ApplicationsPage() {
  const session = await getCurrentSession();

  return <AgentApplicationsWorkspace uploaderName={session.user.name} />;
}
