import { ReviewerConsole } from "@/components/review/reviewer-console";
import { getCurrentSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";

export default async function ReviewPage() {
  const session = await getCurrentSession();

  return <ReviewerConsole reviewerName={session.user.name} canWaive={hasPermission(session.user.role, "waiver:create")} />;
}
