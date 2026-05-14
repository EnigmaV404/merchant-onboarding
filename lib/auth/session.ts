import { Role } from "@/types/auth";
import { cookies } from "next/headers";
import { getMockProfile, MockProfileId } from "@/lib/auth/mock-users";

export type AppSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    title: string;
    profileId: MockProfileId;
  };
};

export async function getCurrentSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  const profile = getMockProfile(cookieStore.get("mock_profile")?.value);

  return {
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      title: profile.title,
      profileId: profile.profileId
    }
  };
}
