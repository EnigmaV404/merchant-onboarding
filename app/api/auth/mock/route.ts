import { NextRequest, NextResponse } from "next/server";
import { getMockProfile } from "@/lib/auth/mock-users";

export async function GET(request: NextRequest) {
  const profile = getMockProfile(request.nextUrl.searchParams.get("profile"));
  const redirectUrl = new URL(profile.landingRoute, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("mock_profile", profile.profileId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
