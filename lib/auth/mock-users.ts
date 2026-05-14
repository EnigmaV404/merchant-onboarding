import { Role } from "@/types/auth";

export type MockProfileId = "agent" | "reviewer" | "lead";

export type MockUserProfile = {
  id: string;
  profileId: MockProfileId;
  name: string;
  email: string;
  role: Role;
  title: string;
  landingRoute: string;
  description: string;
};

export const mockProfiles: Record<MockProfileId, MockUserProfile> = {
  agent: {
    id: "mock-ops-agent",
    profileId: "agent",
    name: "Nisha Rao",
    email: "nisha.rao@fastlend.example",
    role: "OPERATIONS_AGENT",
    title: "Operations Agent",
    landingRoute: "/dashboard",
    description: "Assigned applications, missing documents, draft follow-ups, and SLA readiness."
  },
  reviewer: {
    id: "mock-reviewer",
    profileId: "reviewer",
    name: "Alex Chen",
    email: "alex.chen@fastlend.example",
    role: "COMPLIANCE_REVIEWER",
    title: "Reviewer",
    landingRoute: "/dashboard",
    description: "Pending reviews, failed verification, breached SLAs, and decision workload."
  },
  lead: {
    id: "mock-ops-lead",
    profileId: "lead",
    name: "Asha Mehta",
    email: "asha.mehta@fastlend.example",
    role: "TEAM_LEAD",
    title: "Operations Lead",
    landingRoute: "/dashboard",
    description: "Team performance, bottlenecks, SLA trends, and operational reporting."
  }
};

export function getMockProfile(profileId?: string | null) {
  if (profileId === "agent" || profileId === "reviewer" || profileId === "lead") {
    return mockProfiles[profileId];
  }

  return mockProfiles.agent;
}
